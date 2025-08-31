import { Router } from "express";
import { createTrackedEmail, logOpen, logClick } from "../controllers/trackController.js";

const router = Router();
router.post("/track-email", createTrackedEmail);
router.get("/open/:id.png", logOpen);
router.get("/click/:id", logClick);
export default router;