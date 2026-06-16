import { useParams } from "react-router-dom"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Calendar, Clock8, MapPinHouse, Users } from "lucide-react"
import { useEvent } from "../Hooks/UsePartyData";

function EventDetail() { // Reference page that shows details for a specific event, not used in invites
    const { eventId } = useParams<{ eventId: string }>()
    const { event, loading, error } = useEvent(eventId)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-mauve-500 animate-pulse">Laddar fest...</p>
            </div>
        )
    }
    if (error || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-mauve-600">
                    Inget event hittades! Festen verkar inte finnas...
                </p>
                <Link to="/events" className="text-sm tracking-[0.3em] uppercase hover:underline">
                    ← Alla fester
                </Link>
            </div>
        )
    }
    return (
        <motion.div
            className="min-h-screen flex flex-col max-w-3xl mx-auto pt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Link to="/events" className="text-sm tracking-[0.3em] uppercase hover:underline transition-transform">
                ← Alla fester
            </Link>
            <h1 className="text-5xl text-mauve-700 p-4">{event.title}</h1>
            <div className="border-t border-mauve-500 py-2">
                <p className="text-2xl max-w-2xl p-4">{event.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-6">
                <p className="text-xl"><Calendar className="inline-block mr-2" />{event.date}</p>
                <p className="text-xl"><Clock8 className="inline-block mr-2" />{event.time}</p>
                <p className="text-xl"><MapPinHouse className="inline-block mr-2" />{event.location}</p>
                <p className="text-xl"><Users className="inline-block mr-2" />Antal platser kvar: {event.spots}</p>
            </div>
            <div className="max-w-2xl p-6 rounded-lg bg-white border border-mauve-200">
                <h2 className="text-2xl text-mauve-600 pb-6">Boka din plats</h2>
                <form className="flex flex-col justify-start">
                    <label htmlFor="name" className="text-xl text-mauve-700">Namn:</label>
                    <input type="text" placeholder="Namn" className="border p-2 m-2 rounded" />
                    <label htmlFor="message" className="text-xl text-mauve-700">Meddelande (valfritt):</label>
                    <textarea rows={5} id="message" placeholder="Särkilda önskemål" className="border p-2 m-2 rounded" />
                    <button className="font-semibold text-white text-2xl bg-pink-500 hover:bg-pink-600 hover:cursor-pointer py-2 px-4 rounded-2xl transition duration-200 mt-8">
                        Jag kommer! 🎉
                    </button>
                </form>
            </div>
        </motion.div>
    )
}

export default EventDetail