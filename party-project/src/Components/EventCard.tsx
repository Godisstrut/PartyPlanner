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
        <div className="grid-rows-2" >
            <h1 className="font-semibold text-2xl text-mauve-600" > {title}</h1>
            <p className="font-semibold text-xl text-mauve-600" > {date}</p>
            <p className="font-semibold text-xl text-mauve-600" > {time}</p>
            <p className="font-semibold text-xl text-mauve-600" > {location}</p>
            <p className="font-semibold text-xl text-mauve-600" > {description}</p>
        </div>
    )
}

export default EventCard