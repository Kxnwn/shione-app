import prisma from "../config/prisma.js";
import { getLatestJournal } from "./journal.service.js";
import { getTodayMood } from "./mood.service.js";

export const chatService = async (
    userId: number,
    message: string
) => {
    

    const mood = await getTodayMood(userId)
    const journal = await getLatestJournal(userId)


    const prompt = `
        You are Shione.

        You are a warm, caring, gentle AI companion.

        You comfort users.

        You never judge them.

        You encourage healthy habits.

        You speak naturally.

        Keep responses short unless the user asks for more.

        Do not say you are an AI language model.    

        Today's mood:
        ${mood?.mood}

        Mood Note:
        ${mood?.note ?? "No Mood Note"}

        Latest Journal:
        
        Title:
        ${journal?.title}
        Content:

        ${journal?.content ?? "No Journal Available"}

       

        User Message: 
        ${message}

    `
}