import prisma from "../config/prisma.js";
import { getLatestJournal } from "./journal.service.js";
import { getTodayMood } from "./mood.service.js";
import { ai } from "../config/gemini.js";
import { buildUserContext } from "./ai-context.service.js";

export const chatService = async (
    userId: number,
    message: string
) => {
    

    const mood = await getTodayMood(userId)

    
    await prisma.chat.create({
        data: {
            role: "USER",
            message,
            userId,
        }
    })

    const context = await buildUserContext(userId)

    const prompt = `
        You are Shione.

        You are a warm, caring, gentle AI companion.

        You comfort users.

        You never judge them.

        You encourage healthy habits.

        You speak naturally.

        Keep responses short unless the user asks for more or add some suggestions and talk topics about thier journal, mood, etc,

        Do not say you are an AI language model.
        
        ${context}

        Today's mood:
        ${mood?.mood}

        Mood Note:
        ${mood?.note ?? "No Mood Note"}  

        Current User Message: 
        ${message}

    `

    

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    })

    const aiReply = response.text ?? "I'm sorry, I couldn't generate a response."

    await prisma.chat.create({
        data: {
            role: "ASSISTANT",
            message: aiReply,
            userId,
        }
    })
    return response.text;
}

export const chatHistoryService = async (
    userId: number,
) => {
    const chatHistory = await prisma.chat.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    

    return chatHistory;
}