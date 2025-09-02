import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
const router = Router();

router.get("/test", requireAuth, (req, res) => {
  res.send("Track service is up and running!");
});

export default router;
