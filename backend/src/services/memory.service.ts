import prisma from "../config/prisma.js";
import { MemoryCategory } from "@prisma/client";


export const getMemory = async(
    userId:number,
    key:string
)=>{

    return await prisma.memory.findUnique({

        where:{
            userId_key:{
                userId,
                key
            }
        }

    });

}

export const getMemories = async (userId: number) => {
    
    return await prisma.memory.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
}

export const updateMemory = async(

    userId:number,

    key:string,

    value:string

)=>{

    return await prisma.memory.update({

        where:{
            userId_key:{
                userId,
                key
            }
        },

        data:{
            value
        }

    });

}

export const deleteMemory = async(

    userId:number,

    key:string

)=>{

    return await prisma.memory.delete({

        where:{
            userId_key:{
                userId,
                key
            }
        }

    });

}

export const saveMemory = async (
    userId: number,
    category: MemoryCategory,
    key: string,
    value: string
) => {

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

}