import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
}

// Email HTML template below

function buildCancellationEmail(
    guestName: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    inviteUrl: string
): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Avbokad</title>
</head>
<body style="margin:0;padding:0;background-color:#faf4e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf4e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:linear-gradient(90deg,#e8d5a3,#d4b96a,#e8d5a3);height:3px;border-radius:2px 2px 0 0;"></td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;border-left:1px solid #e8dde4;border-right:1px solid #e8dde4;padding:48px 48px 40px;">

              <p style="margin:0 0 16px;font-family:'Lato',sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b8973a;text-align:center;">
                Meddelande om din anmälan
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border-top:1px solid #e8d5a3;width:45%;"></td>
                  <td style="text-align:center;width:10%;padding:0 8px;"><span style="color:#d4b96a;font-size:16px;">✦</span></td>
                  <td style="border-top:1px solid #e8d5a3;width:45%;"></td>
                </tr>
              </table>

              <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:36px;font-weight:normal;color:#3f2a3c;text-align:center;line-height:1.2;">
                Hej ${guestName}
              </h1>
              <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:18px;color:#7d5474;text-align:center;font-style:italic;">
                Din plats har avbokats av arrangören
              </p>

              <!-- Event details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;background-color:#faf4e8;border-radius:12px;border:1px solid #e8d5a3;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 4px;font-family:'Lato',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8973a;">Fest</p>
                    <p style="margin:0 0 16px;font-family:'Georgia',serif;font-size:20px;color:#3f2a3c;">${eventTitle}</p>

                    <p style="margin:0 0 4px;font-family:'Lato',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8973a;">Datum & tid</p>
                    <p style="margin:0 0 16px;font-family:'Lato',sans-serif;font-size:15px;color:#5e3d57;">${eventDate} kl. ${eventTime}</p>

                    <p style="margin:0 0 4px;font-family:'Lato',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8973a;">Plats</p>
                    <p style="margin:0;font-family:'Lato',sans-serif;font-size:15px;color:#5e3d57;">${eventLocation}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-family:'Lato',sans-serif;font-size:14px;color:#5e3d57;text-align:center;line-height:1.7;">
                Kontakta arrangören om du har frågor eller om detta skett av misstag.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}"
                       style="display:inline-block;background-color:#7d5474;color:#ffffff;font-family:'Lato',sans-serif;
                              font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
                              text-decoration:none;padding:14px 36px;border-radius:100px;border:1px solid #5e3d57;">
                      Se mina fester →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background:linear-gradient(90deg,#e8d5a3,#d4b96a,#e8d5a3);height:3px;border-radius:0 0 2px 2px;"></td>
          </tr>

          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-family:'Lato',sans-serif;font-size:11px;color:#b896aa;letter-spacing:0.1em;">
                Pauls 60-årsfirande · Oktober 2025
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Edge Function handler 

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS })
    }
    if (req.method !== "POST") {
        return json({ error: "Method not allowed" }, 405)
    }

    try {
        const { inviteId, eventId } = await req.json()

        if (!inviteId || !eventId) {
            return json({ error: "inviteId och eventId krävs" }, 400)
        }

        // Fetch RSVP row (to get guest name)
        const { data: rsvp, error: rsvpError } = await supabase
            .from("rsvps")
            .select("guest_name")
            .eq("invite_id", inviteId)
            .eq("event_id", eventId)
            .single()

        if (rsvpError || !rsvp) {
            return json({ error: "RSVP hittades inte" }, 400)
        }

        // Fetch invite (email + token)
        const { data: invite, error: inviteError } = await supabase
            .from("guest_invites")
            .select("email, token")
            .eq("id", inviteId)
            .single()

        if (inviteError || !invite) {
            return json({ error: "Inbjudan hittades inte" }, 400)
        }

        // Fetch event details
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("title, date, time, location")
            .eq("id", eventId)
            .single()

        if (eventError || !event) {
            return json({ error: "Eventet hittades inte" }, 400)
        }

        // Delete the RSVP row
        const { error: deleteError } = await supabase
            .from("rsvps")
            .delete()
            .eq("invite_id", inviteId)
            .eq("event_id", eventId)

        if (deleteError) {
            return json({ error: `Kunde inte ta bort RSVP: ${deleteError.message}` }, 500)
        }

        // Send cancellation email
        const guestName = rsvp.guest_name ?? invite.email
        const inviteUrl = `${SITE_URL}/?token=${invite.token}`

        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Pauls 60-årsfest <onboarding@resend.dev>",
                to: [invite.email],
                subject: `Din plats på ${event.title} har avbokats`,
                html: buildCancellationEmail(
                    guestName,
                    event.title,
                    event.date,
                    event.time,
                    event.location,
                    inviteUrl
                ),
            }),
        })

        if (!emailRes.ok) {
            const emailError = await emailRes.json()
            console.error("Resend error:", emailError)
            // RSVP is already deleted — log but don't fail
            return json({ success: true, emailSent: false })
        }

        return json({ success: true, emailSent: true })

    } catch (err) {
        console.error("Edge function error:", err)
        return json({ error: "Serverfel" }, 500)
    }
})

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
}