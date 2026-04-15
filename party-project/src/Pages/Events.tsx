import { Link } from "react-router-dom";
import EventCard from "../Components/EventCard";
import { useEvents } from "../Hooks/UsePartyData";
import { motion } from "motion/react"

function Events() {

    
    const {events, loading, error } = useEvents() // Hämta event-objekt från custom hook

    return(
        <motion.div className="flex flex-col items-center justify-start pt-24 gap-2"
        initial= {{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}> 
            <Link to="/" className="text-sm tracking-[0.3em] uppercase hover:underline transition-transform" >
                ← Tillbaka
            </Link>
            <h1 className=" font-semibold text-6xl text-mauve-700 " >Festerlighterna</h1>
            <p className="text-xl text-mauve-600 pt-6 " >Välj nedan vilken fest som tilltalar dig mest. Kom ihåg, man kan bara välja en!</p>
            {loading && (
                <p className="text-mauve-500 mt-12 animate-pulse">Laddar fester...</p>
            )}
            {error && (
                <p className="text-red-500 mt-12">Något gick fel: {error}</p>
            )}
            {!loading && events.length === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-10/12 mt-4 p-4 " >
                {events.map((event) => ( // Loopa igenom arrayen av event-objekt och rendera en EventCard för varje event
                    <EventCard key={event.id} event={event} />
                ))}
                </div>
            )}
        </motion.div>
    )
}

export default Events