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
        <div className="flex flex-col max-w-3xl mx-auto pt-24" >
            <h1 className="text-3xl font-semibold text-mauve-600 p-4" > {event.title} </h1>
            <p className="text-xl text-mauve-600 p-4" >Datum: {event.date} </p>
            <p className="text-xl text-mauve-600 p-4" >Tid: {event.time} </p>
            <p className="text-xl text-mauve-600 p-4" >Plats: {event.location} </p>
            <p className="text-xl text-mauve-600 p-4" >Platser: {event.spots} </p>
            <p className="text-xl font-semibold text-mauve-600 p-4" >Gäster: </p>
        </div>
    )
}

export default AdminEventDetails