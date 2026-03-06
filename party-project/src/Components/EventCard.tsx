import type { Event } from "../Data/EventsData";

type EventCardProps = {
    event: Event
}

function EventCard({ event }: EventCardProps) {

    const title = event.title;
    const date = event.date;
    const time = event.time;
    const location = event.location;
    const description = event.description;

    return(
        <div className="grid-rows-2 bg-white hover:cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out  rounded-xl p-6 m-8 outline outline-offset-2 " >
            <h1 className="font-semibold text-2xl text-mauve-600" > {title}</h1>
            <p className="text-xl text-mauve-600 mt-4 " > {description}</p>
            <div className="mt-4" >
                <p className="text-xl text-mauve-600 p-2" > {date}</p>
                <p className="text-xl text-mauve-600 p-2" > {time}</p>
                <p className="text-xl text-mauve-600 p-2" > {location}</p>
            </div>
        </div>
    )
}

export default EventCard