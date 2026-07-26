import { getAnalyticsService } from "../services/analytics.service.js";
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getAnalyticsService(userId);
        res.status(200).json({
            message: "Mood analytics fetched successfully!", data: result
        });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Something went wrong" });
    }
};
