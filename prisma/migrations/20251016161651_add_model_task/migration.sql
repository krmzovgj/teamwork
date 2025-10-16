-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGI');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "asigneeId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "Priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "Status" "TaskStatus" NOT NULL DEFAULT 'TO_DO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_key" ON "Task"("id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_asigneeId_fkey" FOREIGN KEY ("asigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
