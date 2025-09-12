import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getGmailAuthUrl,
  gmailCallback,
} from "../controllers/userController.js";
import { supabase } from "../config/supabase.js";
const router = Router();

router.get("/test", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_providers")
      .insert([
        {
          user_id: "444291fd-745a-4b38-9d3f-e9ab3038d31c",
          provider: "gmail",
          access_token: "fake-access-token",
          refresh_token: "fake-refresh-token",
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Insert success:", data);
    return res.json({
      message: "Track service is up and running!",
      inserted: data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/gmail/consent", requireAuth, getGmailAuthUrl);
router.get("/gmail/consent/callback", gmailCallback);

export default router;
