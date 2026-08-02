import prisma from "../config/prisma.js";
import { VerseCategory } from "@prisma/client";

export const getRandomVerseByCategory = async (
    category: VerseCategory
) => {
    const verses = await prisma.bibleVerse.findMany({
        where: {
            category,
        },
    });

    if (verses.length === 0) {
        return null;
    }

    return verses[
        Math.floor(Math.random() * verses.length)
    ];
};