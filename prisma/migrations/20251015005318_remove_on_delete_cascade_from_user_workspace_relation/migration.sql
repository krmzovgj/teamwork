-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
