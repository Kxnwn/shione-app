import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/", authMiddleware)

export default router