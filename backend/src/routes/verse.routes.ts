
import express from "express";
import { getDailyVerse } from "../controllers/verse.controller.js";

const router = express.Router();

router.get("/daily", getDailyVerse);

export default router;

