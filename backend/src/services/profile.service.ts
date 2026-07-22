import prisma from "../config/prisma.js";

export const getProfileService = async (userId: number) => {
   
        const getProfile = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

     return getProfile
}