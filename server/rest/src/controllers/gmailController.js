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

  const message = await getLatestMessage(threadId, data.access_token);
  res.json(message);
};

const getLatestMessage = async (threadId, accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const res = await gmail.users.messages.list({
    userId: "me",
    threadId,
    maxResults: 1,
  });

  const messages = res.data.messages || [];
  if (messages.length === 0) {
    throw new Error("No messages found in thread");
  }

  const latestMessageId = messages[0].id;

  const messageRes = await gmail.users.messages.get({
    userId: "me",
    id: latestMessageId,
    format: "metadata",
    metadataHeaders: ["From", "To", "Subject", "Date"],
  });

  const message = messageRes.data;

  return {
    messageId: message.id,
    threadId: message.threadId,
    snippet: message.snippet,
    headers: message.payload.headers,
  };
};
