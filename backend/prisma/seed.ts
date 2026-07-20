import { PrismaClient, VerseCategory } from "@prisma/client";

const prisma = new PrismaClient();


const main = async () => {
    await prisma.bibleVerse.deleteMany();

    await prisma.bibleVerse.createMany({

    data: [
        {verse: "The verse", reference: "Jerimiah 29:11", category: VerseCategory.LOVE},
        {verse: "The verse", reference: "Jerimiah 29:11", category: VerseCategory.LOVE},
        {verse: "The verse", reference: "Jerimiah 29:11", category: VerseCategory.LOVE}
    ]
});

}

main().finally(async () => await prisma.$disconnect())