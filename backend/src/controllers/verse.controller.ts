import { Request, Response } from "express";
import { VerseCategory } from "@prisma/client";
import { getDailyVerseByCategory } from "../services/verse.service.js";

interface VerseParams {
    category: string;
}

export const getDailyVerse = async (
    req: Request<VerseParams>,
    res: Response
) => {
    try {
        const category = req.params.category.toUpperCase();

        if (!(category in VerseCategory)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verse category.",
            });
        }

        const verse = await getDailyVerseByCategory(
            category as VerseCategory
        );

        return res.status(200).json({
            success: true,
            data: verse,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get verse.",
        });
    }
};