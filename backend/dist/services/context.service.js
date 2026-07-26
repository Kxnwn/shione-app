import prisma from "../config/prisma.js";
import { getTodayMood } from "./mood.service.js";
import { getMemories } from "./memory.service.js";
const buildTimeContext = () => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Good Evening";
    let period = "evening";
    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        period = "morning";
    }
    else if (hour >= 12 && hour < 18) {
        greeting = "Good Afternoon";
        period = "afternoon";
    }
    return `
========== TIME CONTEXT ==========

Current Date:
${now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    })}

Current Time:
${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })}

Current Period:
${period}

Greeting:
${greeting}

If this is the beginning of a conversation, greet the user naturally based on the current time.
Avoid greeting repeatedly during the same conversation.
`;
};
const buildProfileContext = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            createdAt: true,
        },
    });
    return `
========== USER PROFILE ==========

Name:
${user?.name ?? "Unknown"}

Email:
${user?.email ?? "Unknown"}

Member Since:
${user?.createdAt.toDateString() ?? "Unknown"}
`;
};
const buildMoodContext = async (userId) => {
    const mood = await getTodayMood(userId);
    return `
========== TODAY'S MOOD ==========

Mood:
${mood?.mood ?? "No mood recorded today"}

Mood Note:
${mood?.note ?? "No note"}
`;
};
const buildJournalContext = async (userId) => {
    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
        take: 5,
    });
    const journalHistory = journals
        .map((journal) => {
        return `
            Title:
            ${journal.title}

            Content:
            ${journal.content ?? "No Content"}
`;
    })
        .join("\n---------------------\n");
};
const buildMemoryContext = async (userId) => {
    const memories = await getMemories(userId);
    if (memories.length === 0) {
        return `
========== USER MEMORIES ==========

No long-term memories stored yet.
`;
    }
    return `
========== USER MEMORIES ==========

${memories
        .map((memory) => `
Category: ${memory.category}
Key: ${memory.key}
Value: ${memory.value}
`)
        .join("\n---------------------\n")}
`;
};
const buildConversationContext = async (userId) => {
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
        .map((chat) => `${chat.role}: ${chat.message}`)
        .join("\n\n");
    return `
========== RECENT CONVERSATION ==========

${conversationHistory || "No previous conversation."}
`;
};
export const buildUserContext = async (userId) => {
    const timeContext = buildTimeContext();
    const profileContext = await buildProfileContext(userId);
    const memoryContext = await buildMemoryContext(userId);
    const moodContext = await buildMoodContext(userId);
    const journalContext = await buildJournalContext(userId);
    const conversationContext = await buildConversationContext(userId);
    return `
${timeContext}

${profileContext}

${memoryContext}

${moodContext}

${journalContext}

${conversationContext}
`;
};
