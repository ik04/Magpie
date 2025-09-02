import { Router } from "express";
import userRoutes from "./user.js";

const router = Router();
router.use("/auth", userRoutes);

export default router;
