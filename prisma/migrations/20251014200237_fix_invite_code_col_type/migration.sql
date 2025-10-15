/*
  Warnings:

  - You are about to drop the column `invideCode` on the `Workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Workspace_invideCode_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "invideCode",
ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_inviteCode_key" ON "Workspace"("inviteCode");
