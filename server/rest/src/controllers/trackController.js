import { supabase } from "../config/supabase.js";
import { transparentPixel } from "../utils/pixel.js";
import { v4 as uuidv4 } from "uuid";

export async function createTrackedEmail(req, res) {
  try {
    const { gmailMessageId, userId, subject } = req.body;
    if (!gmailMessageId || !userId) {
      return res.status(400).json({ error: "Missing gmailMessageId or userId" });
    }
    const trackingId = uuidv4();
    const { error } = await supabase.from("tracked_emails").insert([
      { tracking_id: trackingId, gmail_message_id: gmailMessageId, user_id: userId, subject }
    ]);
    if (error) return res.status(500).json({ error });

    res.json({
      pixelUrl: `https://yourdomain.com/open/${trackingId}.png`,
      clickUrlPrefix: `https://yourdomain.com/click/${trackingId}?url=`
    });
  } catch (err) {
    console.error("createTrackedEmail error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function logOpen(req, res) {
  try {
    const { id } = req.params;
    await supabase.from("email_opens").insert([
      { tracking_id: id, ip_address: req.ip, user_agent: req.get("User-Agent") || "unknown" }
    ]);
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-cache, no-store");
    res.send(transparentPixel);
  } catch (err) {
    console.error("logOpen error:", err);
    res.status(500).end();
  }
}

export async function logClick(req, res) {
  try {
    const { id } = req.params;
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url" });
    await supabase.from("email_clicks").insert([
      { tracking_id: id, url, ip_address: req.ip, user_agent: req.get("User-Agent") || "unknown" }
    ]);
    res.redirect(url);
  } catch (err) {
    console.error("logClick error:", err);
    res.status(500).json({ error: "Server error" });
  }
}