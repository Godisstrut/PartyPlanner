import { supabase } from "../Lib/SupabaseClient";
import { eventService } from "./EventService";
import type {
    GuestInviteRow,
    InviteGroupRow,
    RsvpRow,
    GuestView,
    GuestInvite,
    InviteGroup,
    InviteWithDetails,
} from "../Data/Database";

function toInvite(row: GuestInviteRow): GuestInvite {
    return {
        id: row.id,
        groupId: row.group_id,
        email: row.email,
        token: row.token,
        sentAt: row.sent_at,
        openedAt: row.opened_at,
    }
}

function toGroup(row: InviteGroupRow): InviteGroup {
    return {
        id: row.id,
        name: row.name,
        eventSlugs: row.event_ids,
    }
}

export const guestService = {

    /**
     * Resolve a URL token into everything the guest page needs.
     * This is called once when the guest lands on /invite/:token
     *
     * Returns null if the token doesn't exist.
     */
    async resolveToken(token: string): Promise<GuestView | null> {
        // 1. Find the invite by token (with group joined in one query)
        const { data: inviteData, error: inviteError } = await supabase
            .from("guest_invites")
            .select(`
                *,
                invite_groups (*)
            `)
            .eq("token", token)
            .single()

        if (inviteError) {
            if (inviteError.code === "PGRST116") return null  // token not found
            throw new Error(`Failed to resolve token: ${inviteError.message}`)
        }

        const invite = toInvite(inviteData as GuestInviteRow)
        const group = toGroup(inviteData.invite_groups as InviteGroupRow)

        // 2. Mark as opened on first visit
        if (!inviteData.opened_at) {
            await supabase
                .from("guest_invites")
                .update({ opened_at: new Date().toISOString() })
                .eq("token", token)
        }

        // 3. Fetch only the events this group can see
        const events = await eventService.getBySlugs(group.eventSlugs)

        // 4. Fetch existing RSVPs for this invite
        const { data: rsvpData } = await supabase
            .from("rsvps")
            .select("event_id, going")
            .eq("invite_id", invite.id)

        // Map RSVPs as { eventId: going }
        const rsvps: Record<string, boolean> = {}
        for (const rsvp of (rsvpData ?? []) as Pick<RsvpRow, "event_id" | "going">[]) {
            rsvps[rsvp.event_id] = rsvp.going
        }

        return { invite, group, events, rsvps }
    },

    /**
     * Submit or update an RSVP.
     * Uses upsert so calling it twice just updates the answer.
     *
     * Returns the updated rsvps map, or null if the token/event is invalid.
     */
    async rsvp(
        token: string,
        eventId: string,
        going: boolean, 
        guestName?: string,
        message?: string
    ): Promise<Record<string, boolean> | null> {
        // Re-resolve to get invite id and verify this event is in their group
        const view = await guestService.resolveToken(token)
        if (!view) return null

        const allowed = view.events.some((e) => e.id === eventId)
        if (!allowed) {
            console.warn(`Guest tried to RSVP to an event not in their group: ${eventId}`)
            return null
        }

        const { error } = await supabase
            .from("rsvps")
            .upsert(
                {
                    invite_id: view.invite.id,
                    event_id: eventId,
                    going,
                    guest_name: guestName,
                    message: message, 
                },
                { onConflict: "invite_id,event_id" }
            )

        if (error) throw new Error(`Failed to save RSVP: ${error.message}`)

        // Return the updated rsvps map
        return { ...view.rsvps, [eventId]: going }
    },
}

// Admin related service
export const adminService = {

    /** Get all invite groups */
    async getGroups(): Promise<InviteGroup[]> {
        const { data, error } = await supabase
            .from("invite_groups")
            .select("*")
            .order("created_at")

        if (error) throw new Error(`Failed to fetch groups: ${error.message}`)
        return (data as InviteGroupRow[]).map(toGroup)
    },

    /**
     * Create a new guest invite.
     * In production, trigger your email send here after inserting.
     *
     * Returns the created invite (including its token for the invite URL).
     */
    async createInvite(email: string, groupId: string): Promise<GuestInvite | { error: string }> {
        if (!email || !email.includes("@")) return { error: "Ogiltig e-postadress" }

        const { data: group } = await supabase
            .from("invite_groups")
            .select("id")
            .eq("id", groupId)
            .single()

        if (!group) return { error: `Gruppen hittades inte: ${groupId}` }

        const { data, error } = await supabase
            .from("guest_invites")
            .insert({ email: email.trim().toLowerCase(), group_id: groupId })
            .select()
            .single()

        if (error) throw new Error(`Failed to create invite: ${error.message}`)

        // TODO: send email with invite URL here
        // e.g. await emailService.send(email, `yoursite.com/invite/${data.token}`)

        return toInvite(data as GuestInviteRow)
    },

    /** All invites with group info and RSVP counts — for the admin dashboard */
    async getAllInvites(): Promise<InviteWithDetails[]> {
        const { data, error } = await supabase
            .from("guest_invites")
            .select(`
                *,
                invite_groups (*),
                rsvps (going)
            `)
            .order("sent_at", { ascending: false })

        if (error) throw new Error(`Failed to fetch invites: ${error.message}`)

        return (data as any[]).map((row) => {
            const invite = toInvite(row as GuestInviteRow)
            const group = toGroup(row.invite_groups as InviteGroupRow)
            const rsvpList: { going: boolean }[] = row.rsvps ?? []
            const totalEvents = group.eventSlugs.length

            return {
                ...invite,
                group,
                goingCount: rsvpList.filter((r) => r.going).length,
                declinedCount: rsvpList.filter((r) => !r.going).length,
                pendingCount: totalEvents - rsvpList.length,
            }
        })
    },

    /** Revoke (delete) an invite by its token */
    async revokeInvite(token: string): Promise<boolean> {
        const { error } = await supabase
            .from("guest_invites")
            .delete()
            .eq("token", token)

        return !error
    },

    /** RSVP headcounts per event — for planning */
    async getHeadcounts(): Promise<
        Record<string, { going: number; notGoing: number; pending: number; spots: number }>
    > {
        const { data, error } = await supabase
            .from("events")
            .select(`
                id,
                slug,
                spots,
                rsvps (going)
            `)

        if (error) throw new Error(`Failed to fetch headcounts: ${error.message}`)

        const result: Record<string, { going: number; notGoing: number; pending: number; spots: number }> = {}

        for (const event of data as any[]) {
            const rsvps: { going: boolean }[] = event.rsvps ?? []
            result[event.slug] = {
                going: rsvps.filter((r) => r.going).length,
                notGoing: rsvps.filter((r) => !r.going).length,
                pending: event.spots - rsvps.length,
                spots: event.spots,
            }
        }

        return result
    },
}