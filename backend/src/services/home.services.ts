import prisma from "../config/prisma.js";
import { Request, Response } from "express"
import { getTodayMood } from "./mood.service.js";
import { getLatestJournal } from "./journal.service.js";


export const getHomeDataService = async (
    userId: number
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    const mood = await getTodayMood(userId)
    const journal = await getLatestJournal(userId)
    

    return {user, mood, journal}
}
