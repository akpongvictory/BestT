import { createEmbedding } from "@bestt/ai";

import prisma from "../lib/prisma";

export interface SimilarChunk {
  id: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  documentName: string;
  similarity: number;
}

/**
 * Finds the document chunks most semantically related
 * to the student's question.
 */
export async function searchSimilarChunks({
  question,
  courseId,
  limit = 5,
}: {
  question: string;
  courseId: string;
  limit?: number;
}): Promise<SimilarChunk[]> {
  if (!question.trim()) {
    return [];
  }

  const questionEmbedding =
    await createEmbedding(question);

  const vector = `[${questionEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw<SimilarChunk[]>`
    SELECT
      dc."id",
      dc."content",
      dc."chunkIndex",
      dc."documentId",
      d."originalName" AS "documentName",

      1 - (
        dc."embedding" <=> ${vector}::vector
      ) AS "similarity"

    FROM "DocumentChunk" dc

    INNER JOIN "Document" d
      ON d."id" = dc."documentId"

    WHERE
      d."courseId" = ${courseId}
      AND dc."embedding" IS NOT NULL

    ORDER BY
      dc."embedding" <=> ${vector}::vector

    LIMIT ${limit};
  `;

  return results;
}