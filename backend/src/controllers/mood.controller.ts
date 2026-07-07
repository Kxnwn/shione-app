import { Request, Response } from "express";
import { createMoodService } from "../services/mood.service.js"


export const createMood = async (req: Request, res: Response) => {
    try {
        const { mood, note } = req.body
        const userId = req.user.id

        const result = await createMoodService(
            userId,
            note,
            mood
        )
    res.status(201).json({
        message: "Successfully created a mood", result
    })
    } catch (error) {
         res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}