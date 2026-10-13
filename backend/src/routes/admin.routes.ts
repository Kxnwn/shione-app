import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { getAdminTest } from "../controllers/admin.controller.js";

const router = Router();

router.get("/test",authMiddleware, adminMiddleware, getAdminTest);

export default router;
