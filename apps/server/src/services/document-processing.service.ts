import fs from "fs/promises";
import path from "path";

import { PDFParse } from "pdf-parse";

import prisma from "../lib/prisma";

const CHUNK_SIZE = 1500;

function createChunks(text: string): string[] {
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalizedText) {
    return [];
  }

  const chunks: string[] = [];

  for (
    let start = 0;
    start < normalizedText.length;
    start += CHUNK_SIZE
  ) {
    const chunk = normalizedText
      .slice(start, start + CHUNK_SIZE)
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }
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