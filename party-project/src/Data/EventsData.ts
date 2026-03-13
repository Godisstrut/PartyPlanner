export type Event = { // Type alias av hur en fest ska se ut
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    spots: number;
}

export const EventsData: Record<string, Event> = { // Fest data objekt
    tockarpsfest: {
        id: "tockarpsfest",
        title: "Middag på Tockarp",
        date: "Lördag den 3 Oktober",
        time: "18:00",
        location: "Tockarpsvägen",
        description: "Tjusig middagsbjuddning på t-100! Tre rätters middag med bubbel som fördrink kommer serveras, klä dig snyggt och kom som du är. ",
        spots: 20
    },
    molinvagenfest: {
        id: "molinvagenfest",
        title: "Stockholms fest",
        date: "Fredag den 2 Oktober",
        time: "19:00",
        location: "Molinvägen",
        description: "Storslagen fest på molinvägen! Kommer bjudas rikligt på dricka, klä dig i dina bästa partykläder och kom med ett glatt humör!",
        spots: 30
    },
    margretetorp: {
        id: "margretetorp",
        title: "Fest på Margretetorps Gästgifvaregård",
        date: "Lördag den 10 Oktober",
        time: "18:00",
        location: "Kägle väg 9, 266 98 Hjärnarp",
        description: "Gammalgod fest på Margretetorps Gästgifvaregård! Festen inleds men fördrink och mingel på utomhus platsen, som sedan går vidare till middag och fest inne på deras största lokal. ",
        spots: 50
    },
    molinvagenvin: {
        id: "molinvagenvin",
        title: "Vinbjudning",
        date: "Fredag den 9 Oktober",
        time: "17:00",
        location: "Molinvägen",
        description: "Storslagen vinbjudning på molinvägen, klä dig i dina bästa partykläder och kom med ett glatt humör!",
        spots: 20
    },
    tockarpvin: {
        id: "tockarpvin",
        title: "Vinbjudning på Tockarp",
        date: "Söndag den 11 Oktober",
        time: "14:00",
        location: "Molinvägen",
        description: "Storslagen vinbjudning på Tockarp, klä dig i dina bästa partykläder och kom med ett glatt humör!",
        spots: 25
    },
    margretetorpmiddag: {
        id: "margretetorpmiddag",
        title: "Middag på Margretetorps",
        date: "Lördag den 17 Oktober",
        time: "18:00",
        location: "Kägle väg 9, 266 98 Hjärnarp",
        description: "Gammalgod middag på Margretetorps Gästgifvaregård! Festen inleds men fördrink och mingel på utomhus platsen, som sedan går vidare till middag och fest inne på deras största lokal. ",
        spots: 20
    }
}