import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/profile", authMiddleware, getProfile)
export default router;