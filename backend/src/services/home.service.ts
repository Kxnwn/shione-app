import prisma from "../config/prisma.js";
import { getTodayMood } from "./mood.service.js";
import { getLatestJournal } from "./journal.service.js";

export const getHomeDataService = async (
    userId: number
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    const mood = await getTodayMood(userId)
    const journal = await getLatestJournal(userId)

    const moodCategoryMap = {
    Happy: "GRATITUDE",
    Calm: "PEACE",
    Sad: "HOPE",
    Anxiety: "PEACE",
    Angry: "LOVE",
    Excited: "JOY",
} as const;

const category =
    mood &&
    moodCategoryMap[
        mood.mood as keyof typeof moodCategoryMap
    ];

    const verses = category
    ? await prisma.bibleVerse.findMany({
          where: {
              category,
          },
      })
    : [];

    const randomVerse =
    verses.length > 0
        ? verses[
              Math.floor(
                  Math.random() * verses.length
              )
          ]
        : null;
    

    return {user, mood, journal, verse: randomVerse}
}
