
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { startUsageSession, heartbeatUsageSession, endUsageSession } from "../controllers/usage.controller.js";

const router = Router();

router.post("/start", authMiddleware, startUsageSession);
router.post("/heartbeat", authMiddleware, heartbeatUsageSession);
router.post("/end", authMiddleware, endUsageSession);

export default router;
