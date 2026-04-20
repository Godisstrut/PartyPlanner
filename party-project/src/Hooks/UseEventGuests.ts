import { useState, useEffect } from "react"
import { supabase } from "../Lib/SupabaseClient";

export type EventGuest = {
    email: string
    groupName: string
    going: boolean
    answeredAt: string  // rsvp.updated_at
}

export type EventGuestSummary = {
    going: EventGuest[]
    declined: EventGuest[]
    pending: string[]   // emails of invited guests who haven't answered yet
    spotsLeft: number
}

export function useEventGuests(eventSlug: string | undefined) {
    const [summary, setSummary] = useState<EventGuestSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!eventSlug) { setLoading(false); return }

        async function fetch() {
            // 1. Get the event row (we need its uuid and spots)
            const { data: eventRow, error: eventError } = await supabase
                .from("events")
                .select("id, spots, event_ids:id")
                .eq("slug", eventSlug)
                .single()

            if (eventError || !eventRow) {
                setError("Festen hittades inte.")
                setLoading(false)
                return
            }

            // 2. Get all RSVPs for this event, joined with guest_invites and invite_groups
            const { data: rsvpRows, error: rsvpError } = await supabase
                .from("rsvps")
                .select(`
                    going,
                    updated_at,
                    guest_invites (
                        email,
                        invite_groups ( name )
                    )
                `)
                .eq("event_id", eventRow.id)

            if (rsvpError) {
                setError(rsvpError.message)
                setLoading(false)
                return
            }

            // 3. Get all guests invited to this event (via their group's event_ids)
            //    so we can compute who hasn't answered yet
            const { data: invitedRows, error: invitedError } = await supabase
                .from("guest_invites")
                .select(`
                    email,
                    invite_groups ( event_ids )
                `)

            if (invitedError) {
                setError(invitedError.message)
                setLoading(false)
                return
            }

            // Build the RSVP maps
            const going: EventGuest[] = []
            const declined: EventGuest[] = []
            const answeredEmails = new Set<string>()

            for (const row of (rsvpRows ?? []) as any[]) {
                const guest: EventGuest = {
                    email: row.guest_invites.email,
                    groupName: row.guest_invites.invite_groups.name,
                    going: row.going,
                    answeredAt: row.updated_at,
                }
                answeredEmails.add(guest.email)
                if (row.going) going.push(guest)
                else declined.push(guest)
            }

            // Pending = invited to this event but no RSVP row yet
            const pending: string[] = (invitedRows ?? [])
                .filter((row: any) =>
                    row.invite_groups?.event_ids?.includes(eventSlug) &&
                    !answeredEmails.has(row.email)
                )
                .map((row: any) => row.email)

            setSummary({
                going,
                declined,
                pending,
                spotsLeft: eventRow.spots - going.length,
            })
        }

        fetch()
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [eventSlug])

    return { summary, loading, error }
}