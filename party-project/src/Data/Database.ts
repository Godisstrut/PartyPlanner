// These match the column names in Supabase exactly
// Used internally by services, components use the mapped App types below

export type EventRow = {
    id: string
    slug: string
    title: string
    date: string
    time: string
    location: string
    description: string
    spots: number
    created_at: string
}

export type InviteGroupRow = {
    id: string
    name: string
    event_ids: string[]   // array of event slugs e.g. ["tockarpsfest", "margretetorp"]
    created_at: string
}

export type GuestInviteRow = {
    id: string
    group_id: string
    email: string
    token: string
    sent_at: string
    opened_at: string | null
}

export type RsvpRow = {
    id: string
    invite_id: string
    event_id: string      // references events.id (uuid)
    going: boolean
    created_at: string
    updated_at: string
}

// App types
// camelCase types used throughout React components
// Services map DB rows → these types before returning

export type Event = {
    id: string        // the uuid from the DB
    slug: string      // e.g. "tockarpsfest" — used in URLs
    title: string
    date: string
    time: string
    location: string
    description: string
    spots: number
}

export type InviteGroup = {
    id: string
    name: string
    eventSlugs: string[]
}

export type GuestInvite = {
    id: string
    groupId: string
    email: string
    token: string
    sentAt: string
    openedAt: string | null
}

// What the guest page receives after resolving a token
export type GuestView = {
    invite: GuestInvite
    group: InviteGroup
    events: Event[]
    rsvps: Record<string, boolean>  // { eventId: going }
}

// Admin: one invite enriched with group info + RSVP counts
export type InviteWithDetails = GuestInvite & {
    group: InviteGroup
    goingCount: number
    declinedCount: number
    pendingCount: number
}