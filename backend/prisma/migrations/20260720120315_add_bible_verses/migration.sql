-- CreateEnum
CREATE TYPE "VerseCategory" AS ENUM ('HOPE', 'PEACE', 'JOY', 'ANXIETY', 'FEAR', 'LOVE', 'STRENGTH', 'WISDOM', 'GRATITUDE');

-- CreateTable
CREATE TABLE "BibleVerse" (
    "id" SERIAL NOT NULL,
    "verse" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "category" "VerseCategory" NOT NULL,

    CONSTRAINT "BibleVerse_pkey" PRIMARY KEY ("id")
);
