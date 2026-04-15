import EventCard from "../Components/EventCard";
import { useEvents } from "../Hooks/UsePartyData";

function Admin() {
    const { events, loading, error } = useEvents()

    return (
        <div className="flex flex-col items-center pt-12">
            <h1 className="text-4xl font-bold text-mauve-700">Pauls 60års fest — Admin Panel</h1>

            {loading && (
                <p className="text-mauve-500 mt-12 animate-pulse">Laddar fester...</p>
            )}
            {error && (
                <p className="text-red-500 mt-12">Något gick fel: {error}</p>
            )}
            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-10/12 mt-4 p-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} basePath="/admin" />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Admin