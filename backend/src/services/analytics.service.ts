import prisma from "../config/prisma.js";

export const getAnalyticsService = async (userId: number) => {
    const moodAnalytics = await prisma.mood.groupBy({
        by: ["mood"],
        where: {
            userId
        },
        _count: {
            mood: true
        }
    })

    return moodAnalytics
}