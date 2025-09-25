import { updateMessageId } from "../controllers/trackerController.js";
import { requireAuth } from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.get("/create", requireAuth, createTracker)
router.get("/update/message-id", requireAuth, updateMessageId)
router.get("/:id", logOpen)

export default router;