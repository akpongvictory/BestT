/*
  Warnings:

  - Added the required column `courseId` to the `ChatSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "courseId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ChatSession_userId_courseId_idx" ON "ChatSession"("userId", "courseId");

-- CreateIndex
CREATE INDEX "Document_courseId_processingStatus_idx" ON "Document"("courseId", "processingStatus");

-- CreateIndex
CREATE INDEX "DocumentChunk_documentId_idx" ON "DocumentChunk"("documentId");

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
