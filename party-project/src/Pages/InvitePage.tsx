import { useParams, Link } from "react-router-dom"
import { motion } from "motion/react"
import { useGuestInvite } from "../Hooks/UsePartyData"
import EventCard from "../Components/EventCard"

function InvitePage() { // Page that shows all events guests are invited to
    const { token } = useParams<{ token: string }>()
    const { view, loading, error } = useGuestInvite(token)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-mauve-500 animate-pulse">Laddar din inbjudan...</p>
            </div>
        )
    }

    if (error || !view) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="text-3xl text-mauve-700">Ogiltig inbjudan</h1>
                <p className="text-mauve-500">
                    Den här länken verkar inte fungera. Kontrollera att du använder rätt länk från ditt inbjudningsmail.
                </p>
            </div>
        )
    }

    // Find if the guest has already booked any event
    const bookedEventId = Object.entries(view.rsvps).find(([, going]) => going === true)?.[0]
    const bookedEvent = bookedEventId ? view.events.find(e => e.id === bookedEventId) : null

    return (
        <motion.div
            className="flex flex-col items-center justify-start pt-24 gap-2 pb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
            <h1 className="font-semibold text-4xl lg:text-6xl text-mauve-700">Festligheterna 🎉</h1>

            {bookedEvent ? (
                // If the guest has already booked an event, shows that one prominently and locks others
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex flex-col items-center text-center gap-2 bg-white border border-green-200 rounded-2xl px-8 py-6 shadow-sm">
                        <div className="text-3xl">🎉</div>
                        <p className="text-mauve-600 font-semibold text-xl">Din plats är bokad!</p>
                        <p className="text-mauve-500">
                            Du har anmält dig till{" "}
                            <Link
                                to={`/invite/${token}/${bookedEvent.slug}`}
                                className="font-semibold text-mauve-700 hover:underline">
                                {bookedEvent.title}
                            </Link>
                        </p>
                    </motion.div>

                    {/* Show all cards but locked, only the booked one is clickable */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 w-11/12 mt-4 p-4 gap-4">
                        {view.events.map((event) => {
                            const isBooked = event.id === bookedEventId
                            return isBooked ? (
                                // Booked event fully clickable
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    basePath={`/invite/${token}`}
                                    rsvpStatus={true}/>
                            ) : (
                                // Other events visually locked, not clickable
                                <div key={event.id} className="relative">
                                    <div className="pointer-events-none opacity-40">
                                        <EventCard
                                            event={event}
                                            basePath={`/invite/${token}`}/>
                                    </div>
                                    <div className="absolute inset-0 m-6 rounded-xl flex items-center justify-center">
                                        <span className="bg-white/90 border border-mauve-200 text-mauve-500 text-xs tracking-[0.2em] uppercase font-medium px-4 py-2 rounded-full">
                                            Ej tillgänglig
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            ) : (
                // If the user hasn't booked any event yet, show all options normally
                <>
                    <p className="text-center md:text-left md:text-xl text-mauve-600 pt-6">
                        Välj nedan vilken fest som tilltalar dig mest. Kom ihåg, man kan bara välja en!
                    </p>
                    <div className="grid grid-cols-1 xl:grid-cols-2 w-11/12 p-4 gap-4">
                        {view.events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                basePath={`/invite/${token}`}
                                rsvpStatus={view.rsvps[event.id]}/>
                        ))}
                    </div>
                </>
            )}
        </motion.div>
    )
}

export default InvitePage