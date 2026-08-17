import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock8, MapPinHouse, Users, CheckCircle, Clock, MessageSquare, Bell, UserMinus } from "lucide-react"
import { useEvent } from "../Hooks/UsePartyData"
import { useEventGuests } from "../Hooks/UseEventGuests"
import { supabase } from "../Lib/SupabaseClient"

function AdminEventDetails() {
    const { eventId } = useParams<{ eventId: string }>()
    const { event, loading: eventLoading, error: eventError } = useEvent(eventId)
    const { summary, loading: guestsLoading, error: guestsError, refetch } = useEventGuests(eventId)

    const [sending, setSending] = useState(false)
    const [reminderMsg, setReminderMsg] = useState<string | null>(null)
    const [removingEmail, setRemovingEmail] = useState<string | null>(null)

    const loading = eventLoading || guestsLoading
    const error = eventError || guestsError

    async function handleSendReminders() {
        if (!event) return
        const confirmed = window.confirm(
            `Skicka påminnelse till alla ${summary?.going.length ?? 0} gäster som anmält sig till ${event.title}?`
        )
        if (!confirmed) return

        setSending(true)
        setReminderMsg(null)
        try {
            const { data, error } = await supabase.functions.invoke("send-reminder", {
                body: { eventId: event.id },
            })
            if (error) throw new Error(error.message)
            setReminderMsg(`✓ Påminnelse skickad till ${data.sent} av ${data.total} gäster.`)
        } catch (err: any) {
            setReminderMsg(`Något gick fel: ${err.message}`)
        } finally {
            setSending(false)
            setTimeout(() => setReminderMsg(null), 6000)
        }
    }

    async function handleUnassign(inviteId: string, email: string) {
        if (!event) return
        const confirmed = window.confirm(
            `Ta bort ${email} från ${event.title}? De får ett email om avbokningen.`
        )
        if (!confirmed) return

        setRemovingEmail(email)
        try {
            const { error } = await supabase.functions.invoke("send-cancellation", {
                body: { inviteId, eventId: event.id },
            })
            if (error) throw new Error(error.message)
            refetch()  // refresh the guest list
        } catch (err: any) {
            alert(`Något gick fel: ${err.message}`)
        } finally {
            setRemovingEmail(null)
        }
    }

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

    const guestsWithMessages = summary?.going.filter(g => g.message) ?? []

    return (
        <div className="flex flex-col max-w-4xl mx-auto pt-24 px-6 pb-16">
            <Link to="/admin" className="text-sm tracking-[0.3em] uppercase hover:underline mb-6">← Admin</Link>

            {/* Header with reminder button */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-semibold text-mauve-700">{event.title}</h1>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                        onClick={handleSendReminders}
                        disabled={sending || (summary?.going.length ?? 0) === 0}
                        className="flex items-center gap-2 font-body text-xs font-bold tracking-[0.15em]
                                   uppercase border border-mauve-200 rounded-xl px-4 py-2.5
                                   text-mauve-600 hover:bg-mauve-700 hover:text-white hover:border-mauve-700
                                   transition-colors duration-200 disabled:opacity-40 cursor-pointer"
                    >
                        <Bell size={13} />
                        {sending ? "Skickar..." : "Skicka påminnelse"}
                    </button>
                    {reminderMsg && (
                        <p className={`text-xs font-body ${reminderMsg.startsWith("✓") ? "text-emerald-600" : "text-rose-500"}`}>
                            {reminderMsg}
                        </p>
                    )}
                </div>
            </div>

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
                    <div className="rounded-xl border border-mauve-200 bg-mauve-50 p-4 text-center">
                        <p className="text-3xl font-bold text-mauve-500">{guestsWithMessages.length}</p>
                        <p className="text-sm text-mauve-600 mt-1 uppercase tracking-wide">Meddelanden</p>
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
                                <GuestRow
                                    key={guest.email}
                                    guest={guest}
                                    onUnassign={handleUnassign}
                                    removing={removingEmail === guest.email}
                                />
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

                {guestsWithMessages.length > 0 && (
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-mauve-600 mb-3">
                            <MessageSquare size={18} /> Meddelanden ({guestsWithMessages.length})
                        </h2>
                        <div className="flex flex-col gap-3">
                            {guestsWithMessages.map((guest) => (
                                <div key={guest.email} className="rounded-lg border border-mauve-100 bg-white px-4 py-4">
                                    <p className="text-mauve-700 font-medium text-sm mb-1">{guest.guestName}</p>
                                    <p className="text-mauve-500 text-sm leading-relaxed italic">"{guest.message}"</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}

// Sub-components 

type GuestRowProps = {
    guest: { inviteId: string; guestName: string; email: string; groupName: string; answeredAt: string; message?: string }
    onUnassign: (inviteId: string, email: string) => void
    removing: boolean
}

function GuestRow({ guest, onUnassign, removing }: GuestRowProps) {
    const date = new Date(guest.answeredAt).toLocaleDateString("sv-SE", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    })

    return (
        <div className="flex items-center justify-between rounded-lg border border-mauve-100 bg-white px-4 py-3">
            <div>
                <p className="text-mauve-700 font-medium">{guest.guestName}</p>
                <p className="text-sm text-mauve-400">{guest.email} · {guest.groupName}</p>
            </div>
            <div className="flex items-center gap-3">
                {guest.message && (
                    <span title={guest.message}>
                        <MessageSquare size={14} className="text-mauve-300" />
                    </span>
                )}
                <p className="text-xs text-mauve-400">{date}</p>
                <button
                    onClick={() => onUnassign(guest.inviteId, guest.email)}
                    disabled={removing}
                    title="Ta bort från festen"
                    className="flex items-center gap-1 font-body text-xs border border-rose-200 rounded-lg
                               px-2.5 py-1.5 text-rose-400 hover:bg-rose-500 hover:text-white
                               hover:border-rose-500 transition-colors duration-150
                               disabled:opacity-40 cursor-pointer"
                >
                    <UserMinus size={12} />
                    {removing ? "..." : "Ta bort"}
                </button>
            </div>
        </div>
    )
}

export default AdminEventDetails