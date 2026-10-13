
import prisma from "../config/prisma.js";

const HEARTBEAT_INTERVAL_SECONDS = 30;
const MAX_COUNTABLE_GAP_SECONDS = 60;

export const startUsageSessionService = async (userId: number) => {
    const existingSession = await prisma.usageSession.findFirst({
        where: { userId, endedAt: null },
        orderBy: { startedAt: "desc" },
    });

    if (existingSession) {
        const now = new Date();
        const gapSeconds = Math.floor(
            (now.getTime() - existingSession.lastActiveAt.getTime()) / 1000
        );

        // Reuse a session only if its last heartbeat is recent.
        if (gapSeconds <= MAX_COUNTABLE_GAP_SECONDS) {
            return existingSession;
        }

        // Recover a stale session without counting inactive time.
        await prisma.usageSession.update({
            where: { id: existingSession.id },
            data: {
                endedAt: existingSession.lastActiveAt,
                durationSeconds: existingSession.durationSeconds ?? 0,
            },
        });
    }

    return prisma.usageSession.create({
        data: { userId },
    });
};

export const heartbeatUsageSessionService = async (
    userId: number,
    sessionId: number
) => {
    const session = await prisma.usageSession.findFirst({
        where: { id: sessionId, userId, endedAt: null },
    });

    if (!session) {
        throw new Error("ACTIVE_SESSION_NOT_FOUND");
    }

    const now = new Date();
    const gapSeconds = Math.floor(
        (now.getTime() - session.lastActiveAt.getTime()) / 1000
    );

    // Never count a long gap as foreground usage.
    const addedSeconds =
        gapSeconds >= 0 && gapSeconds <= MAX_COUNTABLE_GAP_SECONDS
            ? gapSeconds
            : 0;

    return prisma.usageSession.update({
        where: { id: session.id },
        data: {
            lastActiveAt: now,
            durationSeconds:
                (session.durationSeconds ?? 0) + addedSeconds,
        },
    });
};

export const endUsageSessionService = async (
    userId: number,
    sessionId: number
) => {
    const session = await prisma.usageSession.findFirst({
        where: { id: sessionId, userId, endedAt: null },
    });

    if (!session) {
        throw new Error("ACTIVE_SESSION_NOT_FOUND");
    }

    const now = new Date();
    const gapSeconds = Math.floor(
        (now.getTime() - session.lastActiveAt.getTime()) / 1000
    );

    const addedSeconds =
        gapSeconds >= 0 && gapSeconds <= MAX_COUNTABLE_GAP_SECONDS
            ? gapSeconds
            : 0;

    return prisma.usageSession.update({
        where: { id: session.id },
        data: {
            endedAt: now,
            lastActiveAt: now,
            durationSeconds:
                (session.durationSeconds ?? 0) + addedSeconds,
        },
    });
};
