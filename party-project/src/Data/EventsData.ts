export type Event = { // Type alias av hur en fest ska se ut
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
}

export const EventsData: Record<string, Event> = { // Fest data
    fest1: {
        id: "Tockarpsfest",
        title: "Middag på Tockarp",
        date: "2026/10/3",
        time: "18:00",
        location: "Tockarpsvägen",
        description: "Tjusig middagsbjuddning på t-100! Tre rätters middag med bubbel som fördrink kommer serveras, klä dig snyggt och kom som du är. "
    },
    fest2: {
        id: "Molinvägenfest",
        title: "Stockholms fest",
        date: "2026/10/4",
        time: "19:00",
        location: "Molinvägen",
        description: "Storslagen fest på molinvägen, klä dig i dina bästa partykläder och kom med ett glatt humör!"
    }
}