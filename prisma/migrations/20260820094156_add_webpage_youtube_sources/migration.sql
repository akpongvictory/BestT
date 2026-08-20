-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FILE', 'WEBPAGE', 'YOUTUBE');

-- DropIndex
DROP INDEX "Document_courseId_userId_fileHash_key";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "description" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'FILE',
ALTER COLUMN "filename" DROP NOT NULL,
ALTER COLUMN "fileType" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Document_courseId_type_idx" ON "Document"("courseId", "type");

-- CreateIndex
CREATE INDEX "Document_userId_sourceUrl_idx" ON "Document"("userId", "sourceUrl");
