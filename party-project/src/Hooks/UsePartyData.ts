import { useState, useEffect, useCallback } from "react"
import { guestService, adminService } from "../Services/InviteService"
import { eventService } from "../Services/EventService"
import type { GuestView, Event, InviteWithDetails, InviteGroup } from "../Data/Database"

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(() => {
        setLoading(true)
        eventService.getAll()
            .then(setEvents)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    return { events, loading, error, refetch: load }
}

export function useEvent(slug: string | undefined) {
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) { setLoading(false); return }
        eventService.getBySlug(slug)
            .then(setEvent)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [slug])

    return { event, loading, error }
}

export function useGuestInvite(token: string | undefined) {
    const [view, setView] = useState<GuestView | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [rsvping, setRsvping] = useState(false)

    useEffect(() => {
        if (!token) {
            setError("Ingen inbjudningslänk hittades.")
            setLoading(false)
            return
        }
        guestService.resolveToken(token)
            .then((resolved) => {
                if (!resolved) setError("Ogiltig eller utgången inbjudan.")
                else setView(resolved)
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [token])

    // name is now accepted and forwarded to the service
    const rsvp = useCallback(
        async (eventId: string, going: boolean, name?: string) => {
            if (!token || !view) return
            setRsvping(true)
            try {
                const updatedRsvps = await guestService.rsvp(token, eventId, going, name)
                if (updatedRsvps) {
                    setView((prev) => prev ? { ...prev, rsvps: updatedRsvps } : prev)
                }
            } catch (e: any) {
                setError(e.message)
            } finally {
                setRsvping(false)
            }
        },
        [token, view]
    )

    return { view, rsvp, rsvping, loading, error }
}

export function useAdminInvites() {
    const [invites, setInvites] = useState<InviteWithDetails[]>([])
    const [groups, setGroups] = useState<InviteGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        try {
            const [fetchedInvites, fetchedGroups] = await Promise.all([
                adminService.getAllInvites(),
                adminService.getGroups(),
            ])
            setInvites(fetchedInvites)
            setGroups(fetchedGroups)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { refresh() }, [refresh])

    const createInvite = useCallback(
        async (email: string, groupId: string) => {
            const result = await adminService.createInvite(email, groupId)
            await refresh()
            return result
        },
        [refresh]
    )

    const revokeInvite = useCallback(
        async (token: string) => {
            await adminService.revokeInvite(token)
            await refresh()
        },
        [refresh]
    )

    return { invites, groups, loading, error, createInvite, revokeInvite, refresh }
}