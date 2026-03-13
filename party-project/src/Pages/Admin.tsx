import { EventsData } from "../Data/EventsData";
import EventCard from "../Components/EventCard";

function Admin() {

    const events = Object.values(EventsData)

    return(
        <div className="flex flex-col items-center pt-12">
            <h1 className="text-4xl font-bold text-mauve-700" >Pauls 60års fest - Admin Panel</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-10/12 mt-4 p-4 " >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} basePath="/admin" />
                ))}
            </div>
        </div>
    )
}

export default Admin