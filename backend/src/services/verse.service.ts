import prisma from "../config/prisma.js";
import { VerseCategory } from "@prisma/client";

export const getDailyVerseByCategory = async (
    category: VerseCategory
) => {
    const verses = await prisma.bibleVerse.findMany({
        where: {
            category,
        },
        orderBy: {
            id: "asc",
        },
    });

    if (verses.length === 0) {
        return null;
    }

    // Use the current date to deterministically select a verse
    const today = new Date();

    const startOfYear = new Date(
        today.getFullYear(),
        0,
        0
    );

    const difference =
        today.getTime() - startOfYear.getTime();

    const oneDay = 1000 * 60 * 60 * 24;

    const dayOfYear = Math.floor(
        difference / oneDay
    );

    const index = dayOfYear % verses.length;

    return verses[index];
};