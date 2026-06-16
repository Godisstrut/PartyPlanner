import { useState, useEffect } from "react"
import { supabase } from "../Lib/SupabaseClient";

export type EventGuest = {
    guestName: string    // from rsvps.guest_name
    email: string
    groupName: string
    going: boolean
    answeredAt: string
    message?: string 
}

export type EventGuestSummary = {
    going: EventGuest[]
    declined: EventGuest[]
    pending: string[]
    spotsLeft: number
}

export function useEventGuests(eventSlug: string | undefined) { // Custom hook for fetching guest list and RSVP summary for specific event, used on AdminEventDetails
    const [summary, setSummary] = useState<EventGuestSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!eventSlug) { setLoading(false); return }

        async function fetch() {
            const { data: eventRow, error: eventError } = await supabase
                .from("events")
                .select("id, spots")
                .eq("slug", eventSlug)
                .single()

            if (eventError || !eventRow) {
                setError("Festen hittades inte.")
                setLoading(false)
                return
            }

            // Fetch RSVPs with guest_name included
            const { data: rsvpRows, error: rsvpError } = await supabase
                .from("rsvps")
                .select(`
                    going,
                    updated_at,
                    guest_name,
                    message,
                    guest_invites (
                        email,
                        invite_groups ( name )
                    )
                `)
                .eq("event_id", eventRow.id)

            if (rsvpError) { setError(rsvpError.message); setLoading(false); return }

            const { data: invitedRows, error: invitedError } = await supabase
                .from("guest_invites")
                .select("email, invite_groups ( event_ids )")

            if (invitedError) { setError(invitedError.message); setLoading(false); return }

            const going: EventGuest[] = []
            const declined: EventGuest[] = []
            const answeredEmails = new Set<string>()

            for (const row of (rsvpRows ?? []) as any[]) {
                const guest: EventGuest = {
                    guestName: row.guest_name ?? row.guest_invites.email,
                    email: row.guest_invites.email,
                    groupName: row.guest_invites.invite_groups.name,
                    going: row.going,
                    answeredAt: row.updated_at,
                    message: row.message ?? undefined,
                    
                }
                answeredEmails.add(guest.email)
                if (row.going) going.push(guest)
                else declined.push(guest)
            }

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