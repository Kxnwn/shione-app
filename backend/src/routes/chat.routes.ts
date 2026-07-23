import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatHistory, postChat } from "../controllers/chat.controller.js";

const router = Router()

router.post("/", authMiddleware, postChat)
router.get("/history", authMiddleware, chatHistory)

export default router