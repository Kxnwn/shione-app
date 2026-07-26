import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createJournal, deleteJournal, getJournals, updateJournal } from "../controllers/journal.controller.js";
const router = Router();
router.post("/", authMiddleware, createJournal);
router.get("/", authMiddleware, getJournals);
router.put("/:id", authMiddleware, updateJournal);
router.delete("/:id", authMiddleware, deleteJournal);
export default router;
