import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getProfile } from "../controllers/user.controller";


const router = Router();

router.post("/register", authMiddleware, registerUser);
router.post("/login",authMiddleware, loginUser)
router.post("/logout", authMiddleware, getProfile)
export default router;