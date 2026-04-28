import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ─── CORS headers ─────────────────────────────────────────────────────────────
// Must include x-client-info and apikey — Supabase JS client sends these automatically

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
}

// ─── Email HTML template ──────────────────────────────────────────────────────

function buildEmailHtml(groupName, inviteUrl) {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Du är inbjuden</title>
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
              <p style="margin:0 0 16px;font-family:'Lato',sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b8973a;text-align:center;">Personlig inbjudan</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border-top:1px solid #e8d5a3;width:45%;"></td>
                  <td style="text-align:center;width:10%;padding:0 8px;"><span style="color:#d4b96a;font-size:16px;">✦</span></td>
                  <td style="border-top:1px solid #e8d5a3;width:45%;"></td>
                </tr>
              </table>
              <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:42px;font-weight:normal;color:#3f2a3c;text-align:center;line-height:1.2;">Du är inbjuden</h1>
              <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:18px;color:#7d5474;text-align:center;font-style:italic;">till Pauls 60-årsfirande</p>
              <p style="margin:0 0 24px;font-family:'Lato',sans-serif;font-size:16px;color:#5e3d57;line-height:1.7;text-align:center;">Hej <strong>${groupName}</strong>,<br/>vi har reserverat din plats bland de fester<br/>som passar er allra bäst.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}" style="display:inline-block;background-color:#7d5474;color:#ffffff;font-family:'Lato',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:100px;border:1px solid #5e3d57;">Se mina inbjudningar →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-family:'Lato',sans-serif;font-size:12px;color:#b896aa;text-align:center;line-height:1.7;">Om knappen inte fungerar, kopiera länken nedan:<br/><a href="${inviteUrl}" style="color:#7d5474;word-break:break-all;">${inviteUrl}</a></p>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(90deg,#e8d5a3,#d4b96a,#e8d5a3);height:3px;border-radius:0 0 2px 2px;"></td>
          </tr>
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-family:'Lato',sans-serif;font-size:11px;color:#b896aa;letter-spacing:0.1em;">Pauls 60-årsfirande · Oktober 2025</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Edge Function handler ────────────────────────────────────────────────────

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (req.method !== "POST") {
        return json({ error: "Method not allowed" }, 405)
    }

    try {
        const { email, groupId } = await req.json()

        if (!email || !email.includes("@")) return json({ error: "Ogiltig e-postadress" }, 400)
        if (!groupId) return json({ error: "Ingen grupp vald" }, 400)

        const { data: group, error: groupError } = await supabase
            .from("invite_groups").select("id, name").eq("id", groupId).single()

        if (groupError || !group) return json({ error: "Gruppen hittades inte" }, 400)

        const { data: invite, error: inviteError } = await supabase
            .from("guest_invites")
            .insert({ email: email.trim().toLowerCase(), group_id: groupId })
            .select().single()

        if (inviteError) return json({ error: inviteError.message }, 500)

        const inviteUrl = `${SITE_URL}/invite/${invite.token}`

        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: "Pauls 60-årsfest <onboarding@resend.dev>",
                to: [email],
                subject: "Du är inbjuden till Pauls 60-årsfirande 🎉",
                html: buildEmailHtml(group.name, inviteUrl),
            }),
        })

        if (!emailRes.ok) {
            const emailError = await emailRes.json()
            console.error("Resend error:", emailError)
            return json({ error: "Misslyckades att skicka email" }, 500)
        }

        return json({ success: true, invite: { id: invite.id, email: invite.email, token: invite.token, inviteUrl, groupName: group.name } })

    } catch (err) {
        console.error("Edge function error:", err)
        return json({ error: "Serverfel" }, 500)
    }
})

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    })
}