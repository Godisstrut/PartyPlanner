import { EventsData } from "../Data/EventsData";
import { useParams } from "react-router-dom";
import Button from "../Components/Button";
import { motion } from "motion/react"
import { Link } from "react-router-dom";

function EventDetail() {

    const { eventId } = useParams<{eventId: string}>()
    const event = EventsData[eventId as string]
    if (!event) {
        return <p>Inget event hittades! Festen verkar inte finnas...</p>
    }
    return(
        <motion.div className="min-h-screen flex flex-col max-w-3xl mx-auto pt-24 "
        initial= {{ opacity: 0, y: 20 }}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.4}} >
            <Link to="/events" className="text-primary text-sm tracking-[0.3em] uppercase hover:underline transition-transform" >
                ← Alla fester
            </Link>
            <h1 className="text-4xl text-mauve-600 p-4 " >{event.title}</h1>
            <p className="text-xl max-w-2xl text-center p-4" >{event.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 p-6" >
                <p className="text-lg" >{event.date}</p>
                <p className="text-lg" >{event.time}</p>
                <p className="text-lg" >{event.location}</p>
                <p className="text-lg" >Antal platser kvar: {event.spots}</p>
            </div>
            <div className="max-w-2xl border p-6 rounded-lg bg-white" >
                <h1 className="text-2xl text-mauve-600 p-4 " >Boka din plats</h1>
                <form className="flex flex-col justify-start " >
                    <label htmlFor="name" className="text-xl text-mauve-600" >Namn:</label>
                    <input type="text" placeholder="Namn" className="border p-2 m-2 rounded" />
                    <label htmlFor="email" className="text-xl text-mauve-600" >E-post:</label>
                    <input type="email" placeholder="E-post" className="border p-2 m-2 rounded" />
                    <Button text="Boka" />
                </form>
            </div>
        </motion.div>
    )
}

export default EventDetail