import { google } from "googleapis";
import { supabase } from "../config/supabase.js";

export async function getGmailAuthUrl(req, res) {
  console.log(`${process.env.API_URL}/auth/gmail/callback`);

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.API_URL}/auth/gmail/consent/callback`
    );

    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: req.user.id,
      redirect_uri: `${process.env.API_URL}/auth/gmail/consent/callback`,
    });

    res.json({ url });
  } catch (err) {
    console.error("Error generating Gmail auth URL:", err);
    res.status(500).json({ error: "Failed to generate Gmail auth link" });
  }
}

export async function gmailCallback(req, res) {
  try {
    const { code, state: userId } = req.query;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.API_URL}/auth/gmail/consent/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, expiry_date, scope } = tokens;

    await supabase.from("user_providers").upsert(
      {
        user_id: userId,
        provider: "gmail",
        access_token,
        refresh_token,
        expires_at: new Date(expiry_date).toISOString(),
        scope,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/integrations?success=gmail`);
  } catch (err) {
    console.error("Error handling Gmail callback:", err);
    res.status(500).json({ error: "Failed to complete Gmail OAuth" });
  }
}
