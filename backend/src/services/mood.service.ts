import prisma from "../config/prisma.js"

export const createMoodService = async (
    userId: number,
    mood: string,
    note?: string
) => {
    const createUserMood = await prisma.mood.create({
        data: {
            mood,
            note,
            userId
        }
    })
    return createUserMood;
}

export const getMoodService = async (
    userId: number
) => {
    const getMoods = await prisma.mood.findMany({
        where: {
            userId
        }
    })

    return getMoods;
}

export const updateMoodService = async (
    moodId: number,
    userId: number,
    mood: string,
    note?: string
) => {
    const updateMood = await prisma.mood.findUnique({
        where: {
            id: moodId
        }
    })

    if(!updateMood) {
        throw new Error("Mood not found")
    }

    if(updateMood.userId !== userId) {
        throw  new Error("You are not allowed to update this mood")
    }

    const updatedMood = await prisma.mood.update({
        where: {
            id: moodId
        },
        data: {
            mood,
            note
        }
    })

    return updatedMood;
}











//export const deleteMoodService = async(
   // moodId: number,
   // userId: number
//) => {
  //  const deleteMood = await prisma.mood.findUnique({
   //     where: {
     //       id: moodId
   //     }
    //})

 //   if(!deleteMood) {
   //     throw new Error("Mood not found")
   // }

   // if (deleteMood.userId !== userId) {
     //   throw new Error("This is note your note, action prohibited.")
  //  }

   // const deletedMood = await prisma.mood.delete({
      //  where: {
         //   id: moodId
      //  }
    //})

    //return deletedMood;
//}