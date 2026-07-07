import { Request, Response } from "express"
import prisma from "../config/prisma.js"

export const createMoodService = async (
    userId: number,
    mood: string,
    note?: string
) => {
    const createUserMood = await prisma.mood.create({
        data: {
            mood,
            note
        }
    })
}