
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
    getAdminTest,
    getAdminDashboardSummary,
    getAdminDashboardAnalytics,
    getAdminDashboardParticipants,
} from "../controllers/admin.controller.js";

const router = Router();

router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    getAdminTest
);

router.get(
    "/dashboard/summary",
    authMiddleware,
    adminMiddleware,
    getAdminDashboardSummary
);

router.get(
    "/dashboard/analytics",
    authMiddleware,
    adminMiddleware,
    getAdminDashboardAnalytics
);

router.get(
    "/dashboard/participants",
    authMiddleware,
    adminMiddleware,
    getAdminDashboardParticipants
);

export default router;
