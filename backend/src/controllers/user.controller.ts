import { Request, Response } from "express";
import { getProfileService, getStreakService, editProfileService } from "../services/profile.service.js";


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

export const getStreak = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        const result = await getStreakService(
            userId
        )

        res.status(200).json({
            message: "Successfully get the Streak!", data: result
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

export const editProfile = async (req: Request, res: Response) => {
    const userId = req.user.id
    const { name, email } = req.body

    try {

        const result = await editProfileService(
            userId,
            name,
            email
        )

        if (!name.trim()) {
        return res.status(400).json({
        message: "Name is required"
    });
    }
        res.status(200).json({
            message: "Profile updated successfully",
            data: result
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


