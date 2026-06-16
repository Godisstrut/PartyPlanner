import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "motion/react"
import { Calendar, Clock8, MapPinHouse, Users } from "lucide-react"
import { useGuestInvite } from "../Hooks/UsePartyData"

function InviteEventDetail() { // Page that shows details for a specific event guest is invited to
    const { token, eventId } = useParams<{ token: string; eventId: string }>()
    const { view, rsvp, rsvping, loading, error } = useGuestInvite(token)

    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [submitted, setSubmitted] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-mauve-500 animate-pulse">Laddar fest...</p>
            </div>
        )
    }

    if (error || !view) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-mauve-600">Ogiltig inbjudan.</p>
                <p className="text-mauve-500 text-sm">Kontrollera att du använder rätt länk.</p>
            </div>
        )
    }

    const event = view.events.find((e) => e.id === eventId || e.slug === eventId)

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-mauve-600">Du är inte inbjuden till den här festen.</p>
                <Link to={`/invite/${token}`} className="text-sm tracking-[0.3em] uppercase hover:underline">
                    ← Dina fester
                </Link>
            </div>
        )
    }

    const alreadyGoing = view.rsvps[event.id] === true

    async function handleRsvp(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        await rsvp(event!.id, true, name.trim(), message.trim() || undefined) // pass name through
        setSubmitted(true)
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col max-w-3xl mx-auto pt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Link to={`/invite/${token}`} className="text-sm tracking-[0.3em] uppercase hover:underline transition-transform">
                ← Dina fester
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
                {(alreadyGoing || submitted) ? (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center gap-3 py-6"
                    >
                        <div className="text-4xl">🎉</div>
                        <h2 className="text-2xl text-mauve-600">Vi ses där!</h2>
                        <p className="text-mauve-500">
                            Din plats på <span className="font-semibold">{event.title}</span> är bokad.
                        </p>
                        <Link
                            to={`/invite/${token}`}
                            className="mt-4 text-sm tracking-[0.3em] uppercase hover:underline text-mauve-400"
                        >
                            ← Dina fester
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <h2 className="text-2xl text-mauve-600 pb-6">Boka din plats</h2>
                        <form onSubmit={handleRsvp} className="flex flex-col justify-start">
                            <label htmlFor="name" className="text-xl text-mauve-700">Namn:</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Namn"
                                required
                                className="border p-2 m-2 rounded"
                            />
                            <label htmlFor="message" className="text-xl text-mauve-700">Meddelande (valfritt):</label>
                            <textarea
                                id="message"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Särskilda önskemål"
                                className="border p-2 m-2 rounded"
                            />
                            <button
                                type="submit"
                                disabled={rsvping || !name.trim()}
                                className="font-semibold text-white text-2xl bg-pink-500 hover:bg-pink-600 hover:cursor-pointer py-2 px-4 rounded-2xl transition duration-200 mt-8"
                            >
                                {rsvping ? "Sparar..." : "Jag kommer! 🎉"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </motion.div>
    )
}

export default InviteEventDetail