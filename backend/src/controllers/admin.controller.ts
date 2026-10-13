
import { Request, Response } from "express";
import { getAdminTestService } from "../services/admin.service.js";

export const getAdminTest = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await getAdminTestService();

        return res.status(200).json({
            message: "Success.",
            data
        });
    } catch (error) {
        console.error("Admin test error:", error);

        return res.status(500).json({
            message: "Something went wrong!"
        });
    }
};
