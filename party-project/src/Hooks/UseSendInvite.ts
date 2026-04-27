import { useState } from "react"
import { supabase } from "../Lib/SupabaseClient";

export type SentInvite = {
    id: string
    email: string
    token: string
    inviteUrl: string
    groupName: string
}

export function useSendInvite() {
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function sendInvite(
        email: string,
        groupId: string
    ): Promise<SentInvite | null> {
        setSending(true)
        setError(null)

        try {
            // Call the Supabase Edge Function
            const { data, error: fnError } = await supabase.functions.invoke(
                "send-invite",
                { body: { email, groupId } }
            )

            if (fnError) throw new Error(fnError.message)
            if (data?.error) throw new Error(data.error)

            return data.invite as SentInvite
        } catch (err: any) {
            setError(err.message)
            return null
        } finally {
            setSending(false)
        }
    }

    return { sendInvite, sending, error }
}