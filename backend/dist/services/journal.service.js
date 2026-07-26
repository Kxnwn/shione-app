import prisma from "../config/prisma.js";
export const createJournalService = async (title, content, userId) => {
    const createJournal = await prisma.journal.create({
        data: {
            title,
            content,
            userId
        }
    });
    return createJournal;
};
export const getJournalService = async (userId) => {
    const getJournals = await prisma.journal.findMany({
        where: {
            userId
        }
    });
    return getJournals;
};
export const updateJournalService = async (title, content, userId, journalId) => {
    const updateJournal = await prisma.journal.findUnique({
        where: {
            id: journalId
        }
    });
    if (!updateJournal) {
        throw new Error("Journal not found");
    }
    if (updateJournal.userId !== userId) {
        throw new Error("NOT YOUR JOURNAL STAY OUT!");
    }
    const updatedJournal = await prisma.journal.update({
        where: {
            id: journalId
        },
        data: {
            title,
            content
        }
    });
    return updatedJournal;
};
export const deleteJournalService = async (journalId, userId) => {
    const deleteJournal = await prisma.journal.findUnique({
        where: {
            id: journalId
        }
    });
    if (!deleteJournal) {
        throw new Error("Journal not found");
    }
    if (deleteJournal.userId !== userId) {
        throw new Error("THIS IS NOT YOUR JOURNAL");
    }
    const deletedJournal = await prisma.journal.delete({
        where: {
            id: journalId
        }
    });
    return deletedJournal;
};
export const getLatestJournal = async (userId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const journal = await prisma.journal.findFirst({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return journal;
};
