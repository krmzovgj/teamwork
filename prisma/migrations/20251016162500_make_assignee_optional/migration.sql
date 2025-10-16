/*
  Warnings:

  - You are about to drop the column `asigneeId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_asigneeId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "asigneeId",
ADD COLUMN     "assigneeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
