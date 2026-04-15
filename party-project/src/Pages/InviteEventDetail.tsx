import { useParams, Link } from "react-router-dom"
import { motion } from "motion/react"
import { Calendar, Clock8, MapPinHouse, Users } from "lucide-react"
import { useGuestInvite } from "../Hooks/UsePartyData";

function InviteEventDetail() {
    const { token, eventId } = useParams<{ token: string; eventId: string }>()
    const { view, rsvp, rsvping, loading, error } = useGuestInvite(token)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-mauve-500 animate-pulse">Laddar...</p>
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

    // Find the specific event — must be in the guest's group
    const event = view.events.find((e) => e.id === eventId || e.slug === eventId)

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-mauve-600">
                    Du är inte inbjuden till den här festen.
                </p>
                <Link
                    to={`/invite/${token}`}
                    className="text-sm tracking-[0.3em] uppercase hover:underline"
                >
                    ← Dina fester
                </Link>
            </div>
        )
    }

    const currentRsvp = view.rsvps[event.id]

    return (
        <motion.div
            className="min-h-screen flex flex-col max-w-3xl mx-auto pt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Link
                to={`/invite/${token}`}
                className="text-sm tracking-[0.3em] uppercase hover:underline transition-transform"
            >
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

            {/* RSVP section */}
            <div className="max-w-2xl p-6 rounded-lg bg-white border border-mauve-200">
                <h2 className="text-2xl text-mauve-600 pb-2">Kommer du?</h2>

                {currentRsvp === true && (
                    <p className="text-green-600 font-medium mb-4">
                        ✓ Du har tackat ja till den här festen.
                    </p>
                )}
                {currentRsvp === false && (
                    <p className="text-mauve-500 mb-4">
                        Du har tackat nej till den här festen.
                    </p>
                )}
                {currentRsvp === undefined && (
                    <p className="text-mauve-500 mb-4">Du har inte svarat ännu.</p>
                )}

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={() => rsvp(event.id, true)}
                        disabled={rsvping || currentRsvp === true}
                        className={`flex-1 font-semibold text-xl py-3 px-6 rounded-2xl transition duration-200
                            ${currentRsvp === true
                                ? "bg-green-500 text-white cursor-default"
                                : "bg-pink-500 hover:bg-pink-600 text-white hover:cursor-pointer"
                            }
                            disabled:opacity-60`}
                    >
                        {rsvping ? "Sparar..." : "Ja, jag kommer!"}
                    </button>

                    <button
                        onClick={() => rsvp(event.id, false)}
                        disabled={rsvping || currentRsvp === false}
                        className={`flex-1 font-semibold text-xl py-3 px-6 rounded-2xl border transition duration-200
                            ${currentRsvp === false
                                ? "border-mauve-400 text-mauve-500 bg-mauve-50 cursor-default"
                                : "border-mauve-300 text-mauve-600 hover:border-mauve-500 hover:cursor-pointer"
                            }
                            disabled:opacity-60`}
                    >
                        Tyvärr kan jag inte
                    </button>
                </div>

                {currentRsvp !== undefined && (
                    <p className="text-sm text-mauve-400 mt-4 text-center">
                        Du kan ändra ditt svar när som helst.
                    </p>
                )}
            </div>
        </motion.div>
    )
}

export default InviteEventDetail