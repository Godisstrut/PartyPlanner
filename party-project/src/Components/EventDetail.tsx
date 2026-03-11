import { EventsData } from "../Data/EventsData";
import { useParams } from "react-router-dom";
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
            <Link to="/events" className="text-sm tracking-[0.3em] uppercase hover:underline transition-transform" >
                ← Alla fester
            </Link>
            <h1 className="text-4xl text-mauve-700 p-4 " >{event.title}</h1>
            <div className="border-t border-mauve-500 py-2">
                <p className="text-xl max-w-2xl p-4" >{event.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-6" >
                <p className="text-lg" >{event.date}</p>
                <p className="text-lg" >{event.time}</p>
                <p className="text-lg" >{event.location}</p>
                <p className="text-lg" >Antal platser kvar: {event.spots}</p>
            </div>
            <div className="max-w-2xl p-6 rounded-lg bg-white border border-mauve-200" >
                <h1 className="text-2xl text-mauve-600 pb-6 " >Boka din plats</h1>
                <form className="flex flex-col justify-start " >
                    <label htmlFor="name" className="text-xl text-mauve-700" >Namn:</label>
                    <input type="text" placeholder="Namn" className="border p-2 m-2 rounded" />
                    <label htmlFor="email" className="text-xl text-mauve-700" >E-post:</label>
                    <input type="email" placeholder="E-post" className="border p-2 m-2 rounded" />
                    <label htmlFor="message" className="text-xl text-mauve-700" >Meddelande (valfritt):</label>
                    <textarea rows={5} id="message" placeholder="Särkilda önskemål" className="border p-2 m-2 rounded" ></textarea>
                    <button className="font-semibold text-white text-2xl bg-pink-500 hover:bg-pink-600 hover:cursor-pointer py-2 px-4 rounded-2xl transition duration-200 mt-8" >
                        Boka
                    </button>
                </form>
            </div>
        </motion.div>
    )
}

export default EventDetail