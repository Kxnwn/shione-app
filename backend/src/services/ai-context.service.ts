import prisma from "../config/prisma.js";
import { getTodayMood } from "./mood.service.js";

export const buildUserContext = async (userId: number) => {
    const mood = await getTodayMood(userId);

    const getUserName = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true
        }
    })

    const previousMessages = await prisma.chat.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });

    previousMessages.reverse();

    const conversationHistory = previousMessages
        .map((chat) => {
            return `${chat.role}:\n${chat.message}`;
        })
        .join("\n\n");

    const previousJournals = await prisma.journal.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
        take: 10,
    });

    const journalHistory = previousJournals
        .map((journal) => {
            return `Title: ${journal.title}

            Content:
        ${journal.content ?? "No content"}`;

            }).join("\n\n");
                   

        return `
            User's Name:
            ${getUserName?.name ?? "Ask the User for their name or ask them what they would like to be called."}
            Today's Mood:
            ${mood?.mood ?? "Unknown"}

            Mood Note:
            ${mood?.note ?? "No Mood Note"}

            Journal History:
            ${journalHistory || "No journals yet."}

            Conversation History:
            ${conversationHistory || "No previous conversation."}
`;


};