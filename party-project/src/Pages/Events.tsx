import { Link } from "react-router-dom";
import EventCard from "../Components/EventCard";
import { EventsData } from "../Data/EventsData";
import { motion } from "motion/react"

function Events() {

    const events = Object.values(EventsData)

    return(
        <motion.div className="flex flex-col items-center justify-start pt-24 gap-2"
        initial= {{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}> 
            <Link to="/" className="text-primary text-sm tracking-[0.3em] uppercase hover:underline transition-transform" >
                ← Tillbaka
            </Link>
            <h1 className=" font-semibold text-6xl text-mauve-600 " >Festerlighterna</h1>
            <p className="text-xl text-mauve-600 pt-6 " >Välj nedan vilken fest som tilltalar dig mest. Kom ihåg, man kan bara välja en!</p>
            
            <div className="grid grid-cols-2 w-8/12 mt-6 p-4  " >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </motion.div>
    )
}

export default Events