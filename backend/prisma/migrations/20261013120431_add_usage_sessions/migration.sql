-- CreateTable
CREATE TABLE "UsageSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,

    CONSTRAINT "UsageSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageSession_userId_startedAt_idx" ON "UsageSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "UsageSession_startedAt_idx" ON "UsageSession"("startedAt");

-- AddForeignKey
ALTER TABLE "UsageSession" ADD CONSTRAINT "UsageSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
