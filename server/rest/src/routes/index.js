import { Router } from "express";
import userRoutes from "./user.js";
import gmailRoutes from "./gmail.js";

const router = Router();
router.use("/auth", userRoutes);
router.use("/gmail", gmailRoutes);

export default router;
