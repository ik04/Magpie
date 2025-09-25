import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getGmailAuthUrl,
  gmailCallback,
} from "../controllers/userController.js";
const router = Router();

router.get("/test", requireAuth, async (req, res) => {
  res.send("Gmail route is working");
});

router.get("/gmail/consent", requireAuth, getGmailAuthUrl);
router.get("/gmail/consent/callback", gmailCallback);

export default router;
