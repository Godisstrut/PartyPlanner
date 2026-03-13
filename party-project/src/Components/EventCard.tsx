import type { Event } from "../Data/EventsData";
import { motion } from "motion/react"
import { Link } from "react-router-dom";
import { Calendar, Clock8, MapPinHouse } from "lucide-react";

type EventCardProps = {
    event: Event
    basePath?: string
}

function EventCard({ event, basePath = "/events" }: EventCardProps) {

    const title = event.title;
    const date = event.date;
    const time = event.time;
    const location = event.location;
    const description = event.description;
    const spots = event.spots;

    return(
        <Link to={`${basePath}/${event.id}`} >
            <motion.div className="grid-rows-2 h-11/12 bg-white hover:cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition duration-300 ease-in-out rounded-xl p-6 m-6 border border-mauve-200 hover:border-pink-500"> 
                <div className="flex items-start justify-between" >
                    <h1 className="font-semibold text-3xl text-mauve-700" > {title}</h1>
                    <span className=" font-medium text-sm tracking-[0.2em] uppercase bg-pink-50 rounded-full px-4 py-1" >{spots} Platser kvar</span>
                </div>
                <p className="text-xl text-mauve-600 mt-4 leading-relaxed mb-6 line-clamp-3 " > {description}</p>
                <div className="mt-4 border-t border-mauve-300 pt-4 " >
                    <p className="text-xl text-mauve-700 p-2" > <Calendar className="inline-block mr-1" /> {date}</p>
                    <p className="text-xl text-mauve-700 p-2" > <Clock8 className="inline-block mr-1" /> {time}</p>
                    <p className="text-xl text-mauve-700 p-2" > <MapPinHouse className="inline-block mr-1" /> {location}</p>
                </div>
            </motion.div>
        </Link>
    )
}

export default EventCard