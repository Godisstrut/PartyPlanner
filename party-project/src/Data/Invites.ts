export type Invite = {
    id: string; 
    displayName: string;
    eventIds: string[]; // Matchar med ids i EventsData
}

export type GuestInvite = {
    inviteId: string; // UUID som matchar med Invite.id e.g invite/kalleniusFamily
    email: string; // Gästens email
    groupsId: string; // Vilken grupp denna gäst tillhör, matchar med Invite.id
    rsvps: Record<string, boolean> // Vilka event gästen har tackat ja eller nej till e.g { tockarpsfest: true, molinvagenfest: false }
}

export const Invites: Record<string, Invite> = {
    kalleniusFamily: {
        id: "kalleniusFamily",
        displayName: "Familjen Källenius", 
        eventIds: ["tockarpsfest", "molinvagenfest"] // Vilka event denna grupp är inbjuden till
    },
    stockholmFriends: {
        id: "stockholmFriends",
        displayName: "Stockholms vänner",
        eventIds: ["molinvagenfest", "molinvagenvin"]
    },
    closeRelatives: {
        id: "closeRelatives",
        displayName: "Nära släktingar",
        eventIds: ["tockarpsfest", "margretetorp"]
    }
}