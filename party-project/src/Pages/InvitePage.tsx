import { useParams} from "react-router-dom"
import { motion } from "motion/react"
import { useGuestInvite } from "../Hooks/UsePartyData";
import EventCard from "../Components/EventCard"

function InvitePage() {
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

    return (
        <motion.div
            className="flex flex-col items-center justify-start pt-24 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <h1 className="font-semibold text-6xl text-mauve-700">Festerlighterna</h1>
            <p className="text-xl text-mauve-600 pt-2">
                Välkommen, <span className="font-semibold">{view.group.name}</span>!
            </p>
            <p className="text-mauve-500 pt-1">
                Du är inbjuden till {view.events.length} av festerna nedan.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 w-10/12 mt-4 p-4">
                {view.events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        basePath={`/invite/${token}`}
                        rsvpStatus={view.rsvps[event.id]}
                    />
                ))}
            </div>
        </motion.div>
    )
}

export default InvitePage