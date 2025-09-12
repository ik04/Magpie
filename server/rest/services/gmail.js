import { google } from "googleapis";

export async function refreshAccessToken(userId, providerTokens) {
  const oauth2Client = initOauthClient();

  oauth2Client.setCredentials({
    refresh_token: providerTokens.refresh_token,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  const { error } = await supabase
    .from("user_providers")
    .update({
      access_token: credentials.access_token,
      expires_at: new Date(expiry_date).toISOString(),
    })
    .eq("user_id", userId)
    .eq("provider", "gmail");

  if (error) {
    console.error("Failed to update refreshed token:", error);
    throw new Error("Could not update access token");
  }

  return {
    ...providerTokens,
    access_token: credentials.access_token,
    expires_at: credentials.expiry_date,
  };
}

const initOauthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.API_URL}/auth/gmail/callback`
  );
  return oauth2Client;
};
