import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProfile, getStreak } from "../controllers/user.controller.js";
const router = Router();
router.get("/profile", authMiddleware, getProfile);
router.get("/streak", authMiddleware, getStreak);
export default router;
