import { getHomeDataService } from "../services/home.service.js";
export const getHomeData = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await getHomeDataService(userId);
        return res.status(200).json({
            message: "Data get successfully.", data: data
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong!"
        });
    }
};
