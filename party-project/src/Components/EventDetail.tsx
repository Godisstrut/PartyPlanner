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
        <div className="min-h-screen flex flex-col items-center pt-32 " >
            <h1 className="text-4xl text-mauve-600 p-4 " >{event.title}</h1>
            <p className="text-xl max-w-2xl text-center p-4" >{event.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 p-6" >
                <p className="text-lg" >{event.date}</p>
                <p className="text-lg" >{event.time}</p>
                <p className="text-lg" >{event.location}</p>
                <p className="text-lg" >Antal platser kvar: {event.spots}</p>
            </div>
            <div>
                <h1 className="text-2xl text-mauve-600" >Boka din plats</h1>
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