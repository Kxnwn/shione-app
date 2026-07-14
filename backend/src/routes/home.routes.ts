import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getHomeData } from "../controllers/home.controller.js";

const router = Router()

router.get("/home", authMiddleware, getHomeData)
router.get("/home", authMiddleware,)

export default router