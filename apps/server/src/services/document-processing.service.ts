import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { PDFParse } from "pdf-parse";
import { createEmbedding } from "@bestt/ai";

import prisma from "../lib/prisma";

const CHUNK_SIZE = 1500;
const EMBEDDING_CONCURRENCY = 5;

function createChunks(text: string): string[] {
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalizedText) {
    return [];
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (!currentChunk) {
      currentChunk = paragraph;
      continue;
    }

    const combinedLength =
      currentChunk.length + 2 + paragraph.length;

    if (combinedLength <= CHUNK_SIZE) {
      currentChunk = `${currentChunk}\n\n${paragraph}`;
      continue;
    }

    chunks.push(currentChunk);

    if (paragraph.length <= CHUNK_SIZE) {
      currentChunk = paragraph;
      continue;
    }

    for (
      let start = 0;
      start < paragraph.length;
      start += CHUNK_SIZE
    ) {
      const piece = paragraph
        .slice(start, start + CHUNK_SIZE)
        .trim();

      if (!piece) {
        continue;
      }

      if (piece.length === CHUNK_SIZE) {
        chunks.push(piece);
      } else {
        currentChunk = piece;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Generates embeddings with controlled concurrency.
 *
 * Instead of sending every chunk simultaneously,
 * we process a small number at a time.
 */
async function createEmbeddings(
  chunks: string[]
): Promise<number[][]> {
  const embeddings: number[][] = new Array(
    chunks.length
  );

  for (
    let start = 0;
    start < chunks.length;
    start += EMBEDDING_CONCURRENCY
  ) {
    const batch = chunks.slice(
      start,
      start + EMBEDDING_CONCURRENCY
    );

    console.log(
      `Generating embeddings ${start + 1}-${Math.min(
        start + EMBEDDING_CONCURRENCY,
        chunks.length
      )} of ${chunks.length}...`
    );

    const batchEmbeddings = await Promise.all(
      batch.map((chunk) => createEmbedding(chunk))
    );

    batchEmbeddings.forEach((embedding, index) => {
      embeddings[start + index] = embedding;
    });
  }

  return embeddings;
}

/**
 * Stores a document chunk and its pgvector embedding.
 *
 * Prisma does not currently expose pgvector as a normal
 * scalar type, so the vector itself is written using
 * parameterized raw SQL.
 */
async function saveChunkWithEmbedding(
  documentId: string,
  content: string,
  chunkIndex: number,
  embedding: number[]
): Promise<void> {
  const id = randomUUID();

  const vector = `[${embedding.join(",")}]`;

  await prisma.$executeRaw`
    INSERT INTO "DocumentChunk"
      ("id", "content", "embedding", "chunkIndex", "documentId", "createdAt")
    VALUES
      (
        ${id},
        ${content},
        ${vector}::vector,
        ${chunkIndex},
        ${documentId},
        NOW()
      )
  `;
}

export async function processDocument(
  documentId: string
): Promise<void> {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  await prisma.document.update({
    where: {
      id: document.id,
    },
    data: {
      processingStatus: "PROCESSING",
    },
  });

  try {
    const filename = path.basename(document.fileUrl);

    const filePath = path.resolve(
      "src/uploads",
      filename
    );

    const fileBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: fileBuffer,
    });

    try {
      const result = await parser.getText();

      const chunks = createChunks(result.text);

      if (chunks.length === 0) {
        throw new Error(
          "No readable text was extracted from the document."
        );
      }

      console.log(
        `Document ${document.id}: ${chunks.length} chunks created.`
      );

      /*
       * Remove previous chunks so re-processing a document
       * never creates duplicate embeddings.
       */
      await prisma.documentChunk.deleteMany({
        where: {
          documentId: document.id,
        },
      });

      /*
       * Generate semantic embeddings.
       */
      const embeddings = await createEmbeddings(chunks);

      console.log(
        `Document ${document.id}: embeddings generated.`
      );

      /*
       * Store chunks together with their vectors.
       */
      for (let index = 0; index < chunks.length; index++) {
        await saveChunkWithEmbedding(
          document.id,
          chunks[index],
          index,
          embeddings[index]
        );
      }

      console.log(
        `Document ${document.id}: chunks stored in pgvector.`
      );

      await prisma.document.update({
        where: {
          id: document.id,
        },
        data: {
          processingStatus: "COMPLETED",
        },
      });
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        processingStatus: "FAILED",
      },
    });

    console.error(
      `Document processing failed for ${document.id}:`,
      error
    );

    throw error;
  }
}