export type Invite = {
    displayName: string;
    eventIds: string[]; // Matchar med ids i EventsData
}

export const Invites: Record<string, Invite> = {
    kalleniusFamily: {
        displayName: "Familjen Källenius",
        eventIds: ["Tockarpsfest", "Molinvägenfest"]
    }
}