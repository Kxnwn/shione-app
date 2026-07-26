import prisma from "../config/prisma.js";
export const getMemory = async (userId, key) => {
    return await prisma.memory.findUnique({
        where: {
            userId_key: {
                userId,
                key
            }
        }
    });
};
export const getMemories = async (userId) => {
    return await prisma.memory.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
};
export const updateMemory = async (userId, key, value) => {
    return await prisma.memory.update({
        where: {
            userId_key: {
                userId,
                key
            }
        },
        data: {
            value
        }
    });
};
export const deleteMemory = async (userId, key) => {
    return await prisma.memory.delete({
        where: {
            userId_key: {
                userId,
                key
            }
        }
    });
};
export const saveMemory = async (userId, category, key, value) => {
    const existingMemory = await prisma.memory.findUnique({
        where: {
            userId_key: {
                userId,
                key
            }
        }
    });
    if (existingMemory) {
        return await prisma.memory.update({
            where: {
                userId_key: {
                    userId,
                    key
                }
            },
            data: {
                value,
                category
            }
        });
    }
    return await prisma.memory.create({
        data: {
            userId,
            category,
            key,
            value
        }
    });
};
