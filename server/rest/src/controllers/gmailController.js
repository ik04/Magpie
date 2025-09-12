import { google } from "googleapis";
import { supabase } from "../config/supabase.js";

export const fetchMessageId = async (req, res) => {
  const { threadId } = req.body;
  if (!threadId || threadId.trim() === "") {
    return res.status(400).json({ error: "threadId is required" });
  }

  const userId = req.user.id;

  const { data, error } = await supabase
    .from("user_providers")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("provider", "gmail")
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "No Gmail provider linked" });
  }
  console.log(data);

  const message = await getLatestMessage(threadId, data.access_token);
  res.json(message);
};

const getLatestMessage = async (threadId, accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const thread = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
  });

  const messages = thread.data.messages || [];
  const lastMessage = messages[messages.length - 1];

  return {
    messageId: lastMessage.id,
    threadId: thread.data.id,
    snippet: lastMessage.snippet,
    headers: lastMessage.payload.headers,
  };
};
