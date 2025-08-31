import { Router } from "express";
import trackRoutes from "./track.js";

const router = Router();
router.use("/", trackRoutes);
export default router;