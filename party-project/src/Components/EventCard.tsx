import type { Event } from "../Data/Database";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, Clock8, MapPinHouse } from "lucide-react";

type EventCardProps = {
    event: Event
    basePath?: string
    rsvpStatus?: boolean  // true = going, false = declined, undefined = pending
}

function EventCard({ event, basePath = "/events", rsvpStatus }: EventCardProps) {
    return (
        <Link to={`${basePath}/${event.slug}`}>
            <motion.div className="group grid-rows-2 h-11/12 bg-white hover:cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition duration-300 ease-in-out rounded-xl p-6 m-6 border border-mauve-200 hover:border-pink-500">
                <div className="flex items-start justify-between gap-2">
                    <h1 className="font-semibold text-3xl text-mauve-700 group-hover:text-[#d4b96a] transition-colors duration-300">{event.title}</h1>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="font-medium text-sm tracking-[0.2em] uppercase bg-pink-100  rounded-full px-4 py-1">
                            {event.spots} Platser kvar
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
                <p className="text-xl text-mauve-600 mt-4 leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                </p>
                <div className="mt-4 border-t border-mauve-300 pt-4">
                    <p className="text-xl text-mauve-700 p-2"><Calendar className="inline-block mr-1" />{event.date}</p>
                    <p className="text-xl text-mauve-700 p-2"><Clock8 className="inline-block mr-1" />{event.time}</p>
                    <p className="text-xl text-mauve-700 p-2"><MapPinHouse className="inline-block mr-1" />{event.location}</p>
                </div>
            </motion.div>
        </Link>
    )
}

export default EventCard