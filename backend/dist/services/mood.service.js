import prisma from "../config/prisma.js";
export const createMoodService = async (userId, mood, note) => {
    const createUserMood = await prisma.mood.create({
        data: {
            mood,
            note,
            userId
        }
    });
    return createUserMood;
};
export const getMoodService = async (userId) => {
    const getMoods = await prisma.mood.findMany({
        where: {
            userId
        }
    });
    return getMoods;
};
export const updateMoodService = async (moodId, userId, mood, note) => {
    const updateMood = await prisma.mood.findUnique({
        where: {
            id: moodId
        }
    });
    if (!updateMood) {
        throw new Error("Mood not found");
    }
    if (updateMood.userId !== userId) {
        throw new Error("You are not allowed to update this mood");
    }
    const updatedMood = await prisma.mood.update({
        where: {
            id: moodId
        },
        data: {
            mood,
            note
        }
    });
    return updatedMood;
};
export const deleteMoodService = async (moodId, userId) => {
    const deleteMood = await prisma.mood.findUnique({
        where: {
            id: moodId
        }
    });
    if (!deleteMood) {
        throw new Error("Mood not found");
    }
    if (deleteMood.userId !== userId) {
        throw new Error("This is not your mood you cannot delete this!");
    }
    const deletedMood = await prisma.mood.delete({
        where: {
            id: moodId
        }
    });
    return deletedMood;
};
export const getTodayMood = async (userId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const mood = await prisma.mood.findFirst({
        where: {
            userId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return mood;
};
