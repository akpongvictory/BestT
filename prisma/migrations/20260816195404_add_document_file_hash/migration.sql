/*
  Warnings:

  - A unique constraint covering the columns `[courseId,userId,fileHash]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "fileHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Document_courseId_userId_fileHash_key" ON "Document"("courseId", "userId", "fileHash");
