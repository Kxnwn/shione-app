
import { Request, Response } from "express";
import {
    getAdminTestService,
    getAdminDashboardSummaryService,
    getAdminDashboardAnalyticsService,
    getAdminDashboardParticipantsService,
} from "../services/admin.service.js";

export const getAdminTest = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await getAdminTestService();

        return res.status(200).json({
            message: "Success.",
            data,
        });
    } catch (error) {
        console.error("Admin test error:", error);

        return res.status(500).json({
            message: "Something went wrong!",
        });
    }
};

export const getAdminDashboardSummary = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await getAdminDashboardSummaryService();

        return res.status(200).json({
            message: "Dashboard summary retrieved successfully.",
            data,
        });
    } catch (error) {
        console.error("Admin dashboard summary error:", error);

        return res.status(500).json({
            message: "Failed to retrieve dashboard summary.",
        });
    }
};



export const getAdminDashboardAnalytics = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate } = req.query;

        const isValidDate = (value: unknown): value is string => {
            if (typeof value !== "string") return false;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

            const date = new Date(`${value}T00:00:00.000Z`);

            return (
                !Number.isNaN(date.getTime()) &&
                date.toISOString().slice(0, 10) === value
            );
        };

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message:
                    "Provide valid startDate and endDate in YYYY-MM-DD format.",
            });
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: "startDate must be on or before endDate.",
            });
        }

        // Avoid accidentally requesting an excessively large date range.
        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T00:00:00.000Z`);
        const days =
            (end.getTime() - start.getTime()) / 86_400_000 + 1;

        if (days > 366) {
            return res.status(400).json({
                message: "The maximum date range is 366 days.",
            });
        }

        const data = await getAdminDashboardAnalyticsService(
            startDate,
            endDate
        );

        return res.status(200).json({
            message: "Dashboard analytics retrieved successfully.",
            data,
        });
    } catch (error) {
        console.error("Admin dashboard analytics error:", error);

        return res.status(500).json({
            message: "Failed to retrieve dashboard analytics.",
        });
    }
};



export const getAdminDashboardParticipants = async (
    req: Request,
    res: Response
) => {
    try {
        const pageParam = req.query.page ?? "1";
        const limitParam = req.query.limit ?? "10";

        const page = Number(pageParam);
        const limit = Number(limitParam);

        if (
            typeof pageParam !== "string" ||
            typeof limitParam !== "string" ||
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                message:
                    "page must be a positive integer and limit must be between 1 and 100.",
            });
        }

        const data = await getAdminDashboardParticipantsService(
            page,
            limit
        );

        return res.status(200).json({
            message: "Participant summaries retrieved successfully.",
            data,
        });
    } catch (error) {
        console.error("Admin participants error:", error);

        return res.status(500).json({
            message: "Failed to retrieve participant summaries.",
        });
    }
};
