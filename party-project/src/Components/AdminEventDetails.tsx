import { EventsData } from "../Data/EventsData";
import { useParams } from "react-router-dom";

function AdminEventDetails() {

    const params = useParams<{eventId: string}>()
    const eventId = params.eventId
    const event = EventsData[eventId as string]
   
    if (!event) {
        return <p>Inget event hittades! Festen verkar inte finnas...</p>
    }
    return(
        <div>
            <h1> {event.title} </h1>
        </div>
    )
}

export default AdminEventDetails