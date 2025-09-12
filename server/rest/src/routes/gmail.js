import { Router } from "express";
import { fetchMessageId } from "../controllers/gmailController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();

router.post("/message-id", requireAuth, fetchMessageId);

export default router;
