import { Request, Response } from "express";
import { createMoodService, getMoodService, updateMoodService, deleteMoodService } from "../services/mood.service.js"



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

export const getMoods = async (req: Request, res: Response) => {
    const userId = req.user.id

    try {
        const result = await getMoodService (
            userId
        )

        res.status(200).json({
            moods: result
        })
    } catch (error) {
         res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const updateMood = async (req: Request, res: Response) => {
    const userId = req.user.id
    const { mood, note } = req.body
    const moodId = Number(req.params.id)

    try {
        const result = await updateMoodService (
            moodId,
            userId,
            mood,
            note
        )

        res.status(200).json({
            moods: result
        })
    } catch (error) {
         res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}

export const deleteMood = async( req: Request, res: Response) => {
    const moodId = Number(req.params.id)
    const userId = req.user.id

    try {
        const result = await deleteMoodService (
            moodId,
            userId
        )

        res.status(200).json({
            message: "successfully deleted", deletedMood: result
        })
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Something went wrong" })
    }
}












