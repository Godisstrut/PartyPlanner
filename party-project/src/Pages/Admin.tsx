import { useState } from "react"
import { Link } from "react-router-dom"
import EventCard from "../Components/EventCard"
import { useEvents, useAdminInvites } from "../Hooks/UsePartyData"
import { useSendInvite } from "../Hooks/UseSendInvite"
import { Send, Copy, Check, Mail, Users, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

function Admin() {
    const { events, loading: eventsLoading } = useEvents()
    const { invites, groups, loading: invitesLoading, refresh } = useAdminInvites()
    const { sendInvite, sending, error: sendError } = useSendInvite()

    const [email, setEmail] = useState("")
    const [groupId, setGroupId] = useState("")
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"events" | "invites">("events")

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !groupId) return

        const result = await sendInvite(email, groupId)
        if (result) {
            setSuccessMsg(
                `Inbjudan skickad till ${result.email} (${result.groupName})`
            )
            setEmail("")
            setGroupId("")
            refresh()
            setTimeout(() => setSuccessMsg(null), 5000)
        }
    }

    async function copyLink(token: string) {
        const url = `${window.location.origin}/invite/${token}`
        await navigator.clipboard.writeText(url)
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 2000)
    }

    return (
        <div className="min-h-screen bg-cream-100">

            {/*Header */}
            <div className="bg-white border-b border-mauve-100 px-8 py-6">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-500 mb-1">
                    Administration
                </p>
                <h1 className="font-heading text-4xl text-mauve-800">
                    Pauls 60-årsfest
                </h1>
            </div>

            <div className="max-w-9/10 mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/*Send invite form */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl border border-mauve-100 shadow-sm overflow-hidden">

                        {/* Gold top bar */}
                        <div className="h-0.5 bg-linear-to from-gold-300 via-gold-400 to-gold-300" />

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Mail size={16} className="text-gold-500" />
                                <h2 className="font-heading text-xl text-mauve-700">
                                    Skicka inbjudan
                                </h2>
                            </div>

                            <form onSubmit={handleSend} className="flex flex-col gap-4">
                                <div>
                                    <label className="font-body text-xs tracking-[0.2em] uppercase text-mauve-400 mb-1.5 block">
                                        E-postadress
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="gast@example.com"
                                        required
                                        className="w-full font-body text-sm border border-mauve-200 rounded-xl px-4 py-3
                                                   text-mauve-700 placeholder:text-mauve-300 bg-cream-50
                                                   focus:outline-none focus:border-mauve-400 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="font-body text-xs tracking-[0.2em] uppercase text-mauve-400 mb-1.5 block">
                                        Grupp
                                    </label>
                                    <select
                                        value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                        required
                                        className="w-full font-body text-sm border border-mauve-200 rounded-xl px-4 py-3
                                                   text-mauve-700 bg-cream-50
                                                   focus:outline-none focus:border-mauve-400 transition-colors"
                                    >
                                        <option value="">— Välj grupp —</option>
                                        {groups.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Show which events this group sees */}
                                    {groupId && (
                                        <p className="font-body text-xs text-mauve-400 mt-2 pl-1">
                                            Ser:{" "}
                                            {groups
                                                .find((g) => g.id === groupId)
                                                ?.eventSlugs.join(", ")}
                                        </p>
                                    )}
                                </div>

                                {/* Feedback messages */}
                                <AnimatePresence>
                                    {sendError && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="font-body text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3"
                                        >
                                            {sendError}
                                        </motion.p>
                                    )}
                                    {successMsg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="font-body text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
                                        >
                                            ✓ {successMsg}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={sending || !email || !groupId}
                                    className="flex items-center justify-center gap-2 font-body text-sm font-bold
                                               tracking-[0.15em] uppercase bg-mauve-700 hover:bg-mauve-800
                                               text-white rounded-xl py-3 px-6 transition-colors duration-200
                                               disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={14} />
                                    {sending ? "Skickar..." : "Skicka inbjudan"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-white rounded-xl border border-mauve-100 p-4 text-center">
                            <p className="font-heading text-3xl text-mauve-700">{invites.length}</p>
                            <p className="font-body text-xs tracking-widest uppercase text-mauve-400 mt-1">Skickade</p>
                        </div>
                        <div className="bg-white rounded-xl border border-mauve-100 p-4 text-center">
                            <p className="font-heading text-3xl text-mauve-700">
                                {invites.filter(i => i.openedAt).length}
                            </p>
                            <p className="font-body text-xs tracking-widest uppercase text-mauve-400 mt-1">Öppnade</p>
                        </div>
                    </div>
                </div>

                {/* Right col: tabs for events / invites */}
                <div className="xl:col-span-2">

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white border border-mauve-100 rounded-xl p-1 mb-5 w-fit">
                        {(["events", "invites"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`font-body text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-lg transition-all duration-200
                                    ${activeTab === tab
                                        ? "bg-mauve-700 text-white shadow-sm"
                                        : "text-mauve-400 hover:text-mauve-600"
                                    }`}
                            >
                                {tab === "events" ? (
                                    <span className="flex items-center gap-2"><Calendar size={12} />Fester</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Users size={12} />Inbjudningar</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Events tab */}
                    {activeTab === "events" && (
                        <div>
                            {eventsLoading ? (
                                <p className="font-body text-sm text-mauve-400 animate-pulse">Laddar...</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {events.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            basePath="/admin"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Invites tab */}
                    {activeTab === "invites" && (
                        <div className="flex flex-col gap-3">
                            {invitesLoading ? (
                                <p className="font-body text-sm text-mauve-400 animate-pulse">Laddar...</p>
                            ) : invites.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-mauve-100 p-10 text-center">
                                    <p className="font-body text-mauve-400">Inga inbjudningar skickade ännu.</p>
                                </div>
                            ) : (
                                invites.map((invite) => (
                                    <motion.div
                                        key={invite.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl border border-mauve-100 px-5 py-4
                                                   flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-body text-sm font-semibold text-mauve-700 truncate">
                                                {invite.email}
                                            </p>
                                            <p className="font-body text-xs text-mauve-400 mt-0.5">
                                                {invite.group.name}
                                                {" · "}
                                                {invite.openedAt ? (
                                                    <span className="text-emerald-600">Öppnad</span>
                                                ) : (
                                                    <span className="text-amber-500">Ej öppnad</span>
                                                )}
                                            </p>
                                            <p className="font-body text-xs text-mauve-300 mt-1">
                                                {invite.goingCount} ja · {invite.declinedCount} nej · {invite.pendingCount} ej svarat
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Copy invite link */}
                                            <button
                                                onClick={() => copyLink(invite.token)}
                                                title="Kopiera inbjudningslänk"
                                                className="flex items-center gap-1.5 font-body text-xs
                                                           border border-mauve-200 rounded-lg px-3 py-2
                                                           text-mauve-500 hover:border-mauve-400 hover:text-mauve-700
                                                           transition-colors duration-150"
                                            >
                                                {copiedToken === invite.token ? (
                                                    <><Check size={12} className="text-emerald-500" /> Kopierad</>
                                                ) : (
                                                    <><Copy size={12} /> Länk</>
                                                )}
                                            </button>

                                            {/* View event details */}
                                            <Link
                                                to={`/admin/${invite.token}`}
                                                className="font-body text-xs border border-mauve-200 rounded-lg px-3 py-2
                                                           text-mauve-500 hover:border-mauve-400 hover:text-mauve-700
                                                           transition-colors duration-150"
                                            >
                                                Detaljer
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Admin