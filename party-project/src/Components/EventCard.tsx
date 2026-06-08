import { useEffect, useState } from "react"
import type { Event } from "../Data/Database"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Calendar, Clock8, MapPinHouse } from "lucide-react"
import { supabase } from "../Lib/SupabaseClient";

type EventCardProps = {
    event: Event
    basePath?: string
    rsvpStatus?: boolean
}

function useSpots(eventId: string, totalSpots: number) {
    const [spots, setSpots] = useState(totalSpots)

    useEffect(() => {
        // Count going RSVPs directly — same source of truth as AdminEventDetails
        supabase
            .from("rsvps")
            .select("id", { count: "exact" })
            .eq("event_id", eventId)
            .eq("going", true)
            .then(({ count }) => {
                if (count !== null) setSpots(totalSpots - count)
            })
    }, [eventId, totalSpots])

    return spots
}

function EventCard({ event, basePath = "/events", rsvpStatus }: EventCardProps) {
    const spots = useSpots(event.id, event.spots)

    return (
        <Link to={`${basePath}/${event.slug}`}>
            <motion.div className="group grid-rows-2 h-11/12 bg-white hover:cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition duration-300 ease-in-out rounded-xl p-6 m-6 border border-mauve-200 hover:border-pink-500">
                <div className="h-48 w-full overflow-hidden rounded-lg" >
                    {event.imageUrl
                        ? <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                        : <div className="w-full h-full bg-linear-to-br from-pink-100 to-mauve-200" />
                    }
                </div>
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <h1 className="font-semibold text-lg lg:text-3xl text-mauve-700 group-hover:text-[#d4b96a] transition-colors duration-300">{event.title}</h1>
                    <div className="flex flex-wrap sm:flex-col items-end gap-1 md:shrink-0">
                        <span className="font-medium text-xs lg:text-sm tracking-[0.2em] uppercase bg-pink-200 rounded-full px-4 py-1">
                            {spots} Platser kvar
                        </span>
                        {rsvpStatus === true && (
                            <span className="text-xs font-medium tracking-wide uppercase bg-green-100 text-green-700 rounded-full px-3 py-1">
                                ✓ Jag kommer
                            </span>
                        )}
                        {rsvpStatus === false && (
                            <span className="text-xs font-medium tracking-wide uppercase bg-mauve-100 text-mauve-500 rounded-full px-3 py-1">
                                Tackat nej
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm md:text-xl text-mauve-600 mt-4 leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                </p>
                <div className="mt-4 border-t border-mauve-300 pt-4">
                    <p className="text-sm sm:text-xl text-mauve-700 p-2"><Calendar className="inline-block mr-1" />{event.date}</p>
                    <p className="text-sm sm:text-xl text-mauve-700 p-2"><Clock8 className="inline-block mr-1" />{event.time}</p>
                    <p className="text-sm sm:text-xl text-mauve-700 p-2"><MapPinHouse className="inline-block mr-1" />{event.location}</p>
                </div>
            </div>
            </motion.div>
        </Link>
    )
}

export default EventCard