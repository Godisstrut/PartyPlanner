import EventCard from "../Components/EventCard";
import { EventsData } from "../Data/EventsData";

function Events() {

    const events = Object.values(EventsData)

    return(
        <div className="flex flex-col items-center justify-start pt-24 gap-2" >
            <h1 className=" font-semibold text-6xl text-mauve-600 " >Festerlighterna</h1>
            <p className="text-xl text-mauve-600 pt-6 " >Välj nedan vilken fest som tilltalar dig mest. Kom ihåg, man kan bara välja en!</p>
            
            <div className="grid grid-cols-2 w-8/12 mt-6 p-4  " >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    )
}

export default Events