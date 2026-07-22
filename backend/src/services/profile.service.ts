import prisma from "../config/prisma.js";

export const getProfileService = async (userId: number) => {
   
        const getProfile = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

     return getProfile
}

export const getStreakService = async (userId: number) => {
    const moods = await prisma.mood.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    let streak = 0;
    let lastCountedDate: Date | null = null;

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
        const difference =
            lastCountedDate.getTime() - currentDate.getTime();

        // Exactly one day apart?
        if (difference === ONE_DAY) {
            streak++;
            lastCountedDate = currentDate;
        } else {
            break;
        }
    }

    return {
        streak
    };
};