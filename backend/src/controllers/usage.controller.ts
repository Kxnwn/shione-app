
import { Request, Response } from "express";
import {
    startUsageSessionService,
    heartbeatUsageSessionService,
    endUsageSessionService,
} from "../services/usage.service.js";

export const startUsageSession = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id;

        const session = await startUsageSessionService(userId);

        return res.status(200).json({
            message: "Usage session started successfully.",
            data: session,
        });
    } catch (error) {
        console.error("Start usage session error:", error);

        return res.status(500).json({
            message: "Failed to start usage session.",
        });
    }
};

export const heartbeatUsageSession = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id;
        const sessionId = Number(req.body.sessionId);

        if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
            return res.status(400).json({
                message: "A valid sessionId is required.",
            });
        }

        const session = await heartbeatUsageSessionService(
            userId,
            sessionId
        );

        return res.status(200).json({
            message: "Usage session updated successfully.",
            data: session,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "ACTIVE_SESSION_NOT_FOUND"
        ) {
            return res.status(404).json({
                message: "Active usage session not found.",
            });
        }

        console.error("Usage heartbeat error:", error);

        return res.status(500).json({
            message: "Failed to update usage session.",
        });
    }
};

export const endUsageSession = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user.id;
        const sessionId = Number(req.body.sessionId);

        if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
            return res.status(400).json({
                message: "A valid sessionId is required.",
            });
        }

        const session = await endUsageSessionService(
            userId,
            sessionId
        );

        return res.status(200).json({
            message: "Usage session ended successfully.",
            data: session,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "ACTIVE_SESSION_NOT_FOUND"
        ) {
            return res.status(404).json({
                message: "Active usage session not found.",
            });
        }

        console.error("End usage session error:", error);

        return res.status(500).json({
            message: "Failed to end usage session.",
        });
    }
};
