import { supabase } from "../Lib/SupabaseClient";
import type { Event, EventRow } from "../Data/Database";

function toEvent(row: EventRow): Event {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        date: row.date,
        time: row.time,
        location: row.location,
        description: row.description,
        spots: row.spots,
    }
}

export const eventService = {

    // Fetch all events — used by the public /events page 
    async getAll(): Promise<Event[]> {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at")

        if (error) throw new Error(`Failed to fetch events: ${error.message}`)
        return (data as EventRow[]).map(toEvent)
    },

    // Fetch a single event by its slug — used by /events/:eventId 
    async getBySlug(slug: string): Promise<Event | null> {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("slug", slug)
            .single()

        if (error) {
            if (error.code === "PGRST116") return null  // not found
            throw new Error(`Failed to fetch event: ${error.message}`)
        }
        return toEvent(data as EventRow)
    },

    // Fetch multiple events by their slugs, used by the invite guest view 
    async getBySlugs(slugs: string[]): Promise<Event[]> {
        if (slugs.length === 0) return []

        const { data, error } = await supabase
            .from("events")
            .select("*")
            .in("slug", slugs)

        if (error) throw new Error(`Failed to fetch events: ${error.message}`)
        return (data as EventRow[]).map(toEvent)
    },
}