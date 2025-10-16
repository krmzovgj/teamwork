/*
  Warnings:

  - You are about to drop the column `Priority` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "Priority",
DROP COLUMN "Status",
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TO_DO';
