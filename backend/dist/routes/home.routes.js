import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getHomeData } from "../controllers/home.controller.js";
const router = Router();
router.get("/", authMiddleware, getHomeData);
export default router;
