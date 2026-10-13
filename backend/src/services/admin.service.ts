
import prisma from "../config/prisma.js";

export const getAdminTestService = async () => {
    return {
        message: "Admin access granted!",
    };
};

export const getAdminDashboardSummaryService = async () => {
    const [
        totalParticipants,
        totalSessions,
        activeSessions,
        durationStats,
    ] = await Promise.all([
        prisma.user.count({
            where: { role: "USER" },
        }),

        prisma.usageSession.count(),

        prisma.usageSession.count({
            where: { endedAt: null },
        }),

        prisma.usageSession.aggregate({
            _sum: {
                durationSeconds: true,
            },
            _avg: {
                durationSeconds: true,
            },
        }),
    ]);

    return {
        totalParticipants,
        totalSessions,
        activeSessions,
        totalRecordedUsageSeconds:
            durationStats._sum.durationSeconds ?? 0,
        averageSessionDurationSeconds: Math.round(
            durationStats._avg.durationSeconds ?? 0
        ),
    };
};




const RESEARCH_TIMEZONE_OFFSET_HOURS = 8;

export const getAdminDashboardAnalyticsService = async (
    startDate: string,
    endDate: string
) => {
    // Treat the selected dates as Philippines local dates (UTC+8).
    const start = new Date(`${startDate}T00:00:00+08:00`);

    const nextDay = new Date(`${endDate}T00:00:00.000Z`);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const endExclusive = new Date(
        `${nextDay.toISOString().slice(0, 10)}T00:00:00+08:00`
    );

    const sessions = await prisma.usageSession.findMany({
        where: {
            startedAt: {
                gte: start,
                lt: endExclusive,
            },
        },
        select: {
            id: true,
            startedAt: true,
            endedAt: true,
            durationSeconds: true,
        },
        orderBy: {
            startedAt: "asc",
        },
    });

    const dailyTotals = new Map<
        string,
        { sessionCount: number; usageSeconds: number }
    >();

    let totalRecordedUsageSeconds = 0;
    let sessionsWithDuration = 0;
    let durationSum = 0;
    let activeSessions = 0;

    for (const session of sessions) {
        const duration = session.durationSeconds;

        if (duration !== null) {
            totalRecordedUsageSeconds += duration;
            durationSum += duration;
            sessionsWithDuration++;
        }

        if (session.endedAt === null) {
            activeSessions++;
        }

        // Convert the timestamp to a Philippines calendar date.
        const localDate = new Date(
            session.startedAt.getTime() +
                RESEARCH_TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000
        )
            .toISOString()
            .slice(0, 10);

        const daily = dailyTotals.get(localDate) ?? {
            sessionCount: 0,
            usageSeconds: 0,
        };

        daily.sessionCount++;

        if (duration !== null) {
            daily.usageSeconds += duration;
        }

        dailyTotals.set(localDate, daily);
    }

    // Include dates with zero sessions so charts have no missing days.
    const daily = [];
    const cursor = new Date(`${startDate}T00:00:00.000Z`);
    const lastDay = new Date(`${endDate}T00:00:00.000Z`);

    while (cursor <= lastDay) {
        const date = cursor.toISOString().slice(0, 10);
        const totals = dailyTotals.get(date);

        daily.push({
            date,
            sessionCount: totals?.sessionCount ?? 0,
            usageSeconds: totals?.usageSeconds ?? 0,
        });

        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return {
        startDate,
        endDate,
        timezone: "Asia/Manila",
        totalSessions: sessions.length,
        activeSessions,
        totalRecordedUsageSeconds,
        averageSessionDurationSeconds:
            sessionsWithDuration > 0
                ? Math.round(durationSum / sessionsWithDuration)
                : 0,
        daily,
    };
};






export const getAdminDashboardParticipantsService = async (
    page: number,
    limit: number
) => {
    const where = {
        role: "USER" as const,
        researchCode: { not: null },
    };

    const skip = (page - 1) * limit;

    const [totalParticipants, participants] = await Promise.all([
        prisma.user.count({ where }),

        prisma.user.findMany({
            where,
            select: {
                id: true,
                researchCode: true,
                usageSessions: {
                    orderBy: { startedAt: "desc" },
                    take: 1,
                    select: {
                        startedAt: true,
                        endedAt: true,
                    },
                },
            },
            orderBy: { researchCode: "asc" },
            skip,
            take: limit,
        }),
    ]);

    const participantIds = participants.map(
        (participant) => participant.id
    );

    const usageStats =
        participantIds.length > 0
            ? await prisma.usageSession.groupBy({
                  by: ["userId"],
                  where: {
                      userId: { in: participantIds },
                  },
                  _count: { _all: true },
                  _sum: { durationSeconds: true },
                  _avg: { durationSeconds: true },
              })
            : [];

    const statsByUserId = new Map(
        usageStats.map((stats) => [stats.userId, stats])
    );

    const data = participants.map((participant) => {
        const stats = statsByUserId.get(participant.id);

        return {
            researchCode: participant.researchCode,
            totalSessions: stats?._count._all ?? 0,
            totalRecordedUsageSeconds:
                stats?._sum.durationSeconds ?? 0,
            averageSessionDurationSeconds: Math.round(
                stats?._avg.durationSeconds ?? 0
            ),
            lastSessionStartedAt:
                participant.usageSessions[0]?.startedAt ?? null,
            lastSessionEndedAt:
                participant.usageSessions[0]?.endedAt ?? null,
        };
    });

    return {
        pagination: {
            page,
            limit,
            totalParticipants,
            totalPages: Math.ceil(totalParticipants / limit),
        },
        participants: data,
    };
};
