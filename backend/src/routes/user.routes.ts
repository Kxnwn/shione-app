import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", authMiddleware, getProfile)

export default router