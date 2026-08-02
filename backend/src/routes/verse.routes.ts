
import express from "express";
import { getVerseByCategory } from "../controllers/verse.controller.js";

const router = express.Router();

router.get("/random/:category", getVerseByCategory);

export default router;

