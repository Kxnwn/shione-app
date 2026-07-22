import { Request, Response } from "express";
import { getProfileService } from "../services/profile.service.js";

export const getProfile = async (req: Request, res: Response) => {
    const userId = req.user.id
    try {
        const result = await getProfileService(
            userId,
        )

        res.status(200).json({
            message: "Success getting profile", data: result
        })
    } catch (error) {
         res.status(400).json({
        message:
            error instanceof Error
                ? error.message
                : "Something went wrong"
    });
    }
}