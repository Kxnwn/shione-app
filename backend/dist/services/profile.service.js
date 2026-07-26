import prisma from "../config/prisma.js";
export const getProfileService = async (userId) => {
    const getProfile = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        }
    });
    const getMoodCount = await prisma.mood.count({
        where: {
            userId
        }
    });
    const getJournalCount = await prisma.journal.count({
        where: {
            userId
        }
    });
    const getChatCount = await prisma.chat.count({
        where: {
            userId
        }
    });
    return { getProfile, getMoodCount, getJournalCount, getChatCount };
};
export const getStreakService = async (userId) => {
    const moods = await prisma.mood.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    let streak = 0;
    let lastCountedDate = null;
    const ONE_DAY = 24 * 60 * 60 * 1000;
    for (const mood of moods) {
        const currentDate = new Date(mood.createdAt);
        // Remove the time (00:00:00)
        currentDate.setHours(0, 0, 0, 0);
        // First mood always counts
        if (lastCountedDate === null) {
            streak++;
            lastCountedDate = currentDate;
            continue;
        }
        // Ignore duplicate moods on the same day
        if (currentDate.getTime() === lastCountedDate.getTime()) {
            continue;
        }
        // Difference between dates
        const difference = lastCountedDate.getTime() - currentDate.getTime();
        // Exactly one day apart?
        if (difference === ONE_DAY) {
            streak++;
            lastCountedDate = currentDate;
        }
        else {
            break;
        }
    }
    return {
        streak
    };
};
export const editProfileService = async (userId, name, email) => {
    if (!name.trim()) {
        throw new Error("Name is required");
    }
    const trimmedEmail = email?.trim() || null;
    if (trimmedEmail) {
        const currentUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!currentUser) {
            throw new Error("User not found");
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: trimmedEmail }
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Email is already in use");
        }
    }
    const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            ...(trimmedEmail ? { email: trimmedEmail } : {})
        }
    });
    return updatedProfile;
};
