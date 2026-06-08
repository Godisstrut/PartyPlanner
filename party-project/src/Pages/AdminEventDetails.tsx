import { useParams, Link } from "react-router-dom"
import { Calendar, Clock8, MapPinHouse, Users, CheckCircle, Clock } from "lucide-react"
import { useEvent } from "../Hooks/UsePartyData"
import { useEventGuests } from "../Hooks/UseEventGuests"

function AdminEventDetails() {
    const { eventId } = useParams<{ eventId: string }>()
    const { event, loading: eventLoading, error: eventError } = useEvent(eventId)
    const { summary, loading: guestsLoading, error: guestsError } = useEventGuests(eventId)

    const loading = eventLoading || guestsLoading
    const error = eventError || guestsError

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-mauve-500 animate-pulse">Laddar...</p>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-mauve-600">Inget event hittades!</p>
                <Link to="/admin" className="text-sm tracking-[0.3em] uppercase hover:underline">← Admin</Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col max-w-4xl mx-auto pt-24 px-6 pb-16"> {/* Main container with padding and max width */ }
            <Link to="/admin" className="text-sm tracking-[0.3em] uppercase hover:underline mb-6">← Admin</Link>

            <h1 className="text-3xl font-semibold text-mauve-700 mb-2">{event.title}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 my-6">
                <p className="text-mauve-600 flex items-center gap-2"><Calendar size={16} />{event.date}</p>
                <p className="text-mauve-600 flex items-center gap-2"><Clock8 size={16} />{event.time}</p>
                <p className="text-mauve-600 flex items-center gap-2"><MapPinHouse size={16} />{event.location}</p>
                <p className="text-mauve-600 flex items-center gap-2"><Users size={16} />{summary?.spotsLeft ?? event.spots} platser kvar</p>
            </div>

            {summary && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{summary.going.length}</p>
                        <p className="text-sm text-green-700 mt-1 uppercase tracking-wide">Kommer</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                        <p className="text-3xl font-bold text-amber-600">{summary.pending.length}</p>
                        <p className="text-sm text-amber-700 mt-1 uppercase tracking-wide">Ej svarat</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6">
                <section>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-3">
                        <CheckCircle size={18} /> Kommer ({summary?.going.length ?? 0})
                    </h2>
                    {summary?.going.length === 0 ? (
                        <p className="text-mauve-400 text-sm pl-1">Ingen har tackat ja ännu.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {summary?.going.map((guest) => (
                                <GuestRow key={guest.email} guest={guest} />
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-600 mb-3">
                        <Clock size={18} /> Ej svarat ({summary?.pending.length ?? 0})
                    </h2>
                    {summary?.pending.length === 0 ? (
                        <p className="text-mauve-400 text-sm pl-1">Alla har svarat!</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {summary?.pending.map((email) => (
                                <div key={email} className="flex items-center justify-between rounded-lg border border-mauve-100 bg-white px-4 py-3">
                                    <span className="text-mauve-600">{email}</span>
                                    <span className="text-xs text-amber-600 uppercase tracking-wide bg-amber-50 px-2 py-1 rounded-full">Inväntar svar</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

type GuestRowProps = { guest: { guestName: string; email: string; groupName: string; answeredAt: string } }

function GuestRow({ guest }: GuestRowProps) {
    const date = new Date(guest.answeredAt).toLocaleDateString("sv-SE", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    })

    return (
        <div className="flex items-center justify-between rounded-lg border border-mauve-100 bg-white px-4 py-3">
            <div>
                {/* Show name prominently, email as secondary info */}
                <p className="text-mauve-700 font-medium">{guest.guestName}</p>
                <p className="text-sm text-mauve-400">{guest.email} · {guest.groupName}</p>
            </div>
            <p className="text-xs text-mauve-400">{date}</p>
        </div>
    )
}

export default AdminEventDetails