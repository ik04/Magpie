import { Router } from "express";
import userRoutes from "./user.js";
import gmailRoutes from "./gmail.js";
import trackerRoutes from "./tracker.js";

const router = Router();
router.use("/auth", userRoutes);
router.use("/gmail", gmailRoutes);
router.use("/tracker", trackerRoutes)

export default router;
