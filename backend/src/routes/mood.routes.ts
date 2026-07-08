import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createMood, deleteMood, getMoods, updateMood } from "../controllers/mood.controller.js";

const router = Router()

router.post("/", authMiddleware, createMood)
router.get("/", authMiddleware, getMoods)
router.put("/:id", authMiddleware, updateMood)
router.delete("/:id", authMiddleware, deleteMood)

export default router