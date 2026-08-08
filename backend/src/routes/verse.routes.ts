
import express from "express";
import { getDailyVerse } from "../controllers/verse.controller.js";

const router = express.Router();

router.get("/daily/:category", getDailyVerse);

export default router;

