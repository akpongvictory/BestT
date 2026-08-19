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

export async function searchSimilarChunks({
  question,
  courseId,
  userId,
  limit = 5,
  minSimilarity = 0.45,
}: {
  question: string;
  courseId: string;
  userId: string;
  limit?: number;
  minSimilarity?: number;
}): Promise<SimilarChunk[]> {
  if (!question.trim()) {
    return [];
  }

  if (!courseId.trim() || !userId.trim()) {
    return [];
  }

  const safeLimit = Math.min(Math.max(limit, 1), 10);
  const safeMinSimilarity = Math.min(
    Math.max(minSimilarity, 0),
    1
  );

const questionEmbedding = await createEmbedding(question);

if (!questionEmbedding.length) {
  throw new Error("Failed to generate question embedding.");
}

const vector = `[${questionEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw<SimilarChunk[]>`
  SELECT
    dc."id",
    dc."content",
    dc."chunkIndex",
    dc."documentId",
    d."originalName" AS "documentName",

    (
      1 - (
        dc."embedding" <=> ${vector}::vector
      )
    )::float8 AS "similarity"

  FROM "DocumentChunk" dc

  INNER JOIN "Document" d
    ON d."id" = dc."documentId"

  INNER JOIN "Course" c
    ON c."id" = d."courseId"

  WHERE
    d."courseId" = ${courseId}
    AND d."userId" = ${userId}
    AND c."userId" = ${userId}
    AND d."processingStatus" = 'COMPLETED'
    AND dc."embedding" IS NOT NULL

    AND (
      1 - (
        dc."embedding" <=> ${vector}::vector
      )
    ) >= ${safeMinSimilarity}

  ORDER BY
    dc."embedding" <=> ${vector}::vector

  LIMIT ${safeLimit};
`;
console.log(
  "[RAG] Retrieved chunks:",
  results.map((r) => ({
    documentName: r.documentName,
    chunkIndex: r.chunkIndex,
    similarity: Number(r.similarity),
  }))
);
  return results.map((result) => ({
    ...result,
    similarity: Number(result.similarity),
  }));
}