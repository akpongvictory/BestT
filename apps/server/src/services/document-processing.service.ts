import fs from "fs/promises";
import path from "path";

import { PDFParse } from "pdf-parse";

import prisma from "../lib/prisma";

const CHUNK_SIZE = 1500;

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

      await prisma.documentChunk.deleteMany({
        where: {
          documentId: document.id,
        },
      });

      await prisma.documentChunk.createMany({
        data: chunks.map((content, index) => ({
          content,
          chunkIndex: index,
          documentId: document.id,
        })),
      });

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

    throw error;
  }
}