import { EventsData } from "../Data/EventsData";
import { useParams } from "react-router-dom";
import Button from "../Components/Button";

function EventDetail() {

    const { eventId } = useParams<{eventId: string}>()
    const event = EventsData[eventId as string]
    if (!event) {
        return <p>Inget event hittades! Festen verkar inte finnas...</p>
    }
    return(
        <div className="min-h-screen flex flex-col items-center pt-32" >
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <p>{event.date}</p>
            <p>{event.time}</p>
            <p>{event.location}</p>
            <div>
                <h1>Boka din plats</h1>
                <form>
                    <input type="text" placeholder="Namn" className="border p-2 m-2 rounded" />
                    <input type="email" placeholder="E-post" className="border p-2 m-2 rounded" />
                    <Button text="Boka" />
                </form>
            </div>
        </div>
    )
}

export default EventDetail