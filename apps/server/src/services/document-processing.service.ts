import { randomUUID } from "crypto";

import { PDFParse } from "pdf-parse";

import {
  createEmbeddings as generateEmbeddings,
} from "@bestt/ai";

import prisma from "../lib/prisma";

import {
  downloadDocumentFile,
} from "./storage.service";

import {
  extractWebPage,
} from "./webpage.service";

import {
  extractYouTubeContent,
} from "./youtube.service";

const CHUNK_SIZE = 1500;

function splitOversizedText(text: string): string[] {
  const pieces: string[] = [];

  for (
    let start = 0;
    start < text.length;
    start += CHUNK_SIZE
  ) {
    const piece = text
      .slice(start, start + CHUNK_SIZE)
      .trim();

    if (piece) {
      pieces.push(piece);
    }
  }

  return pieces;
}

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
    // Paragraph itself is too large on its own —
    // split it directly instead of parking it in
    // currentChunk unchecked.
    if (paragraph.length > CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      chunks.push(...splitOversizedText(paragraph));
      continue;
    }

    if (!currentChunk) {
      currentChunk = paragraph;
      continue;
    }

    const combinedLength =
      currentChunk.length +
      2 +
      paragraph.length;

    if (combinedLength <= CHUNK_SIZE) {
      currentChunk =
        `${currentChunk}\n\n${paragraph}`;

      continue;
    }

    chunks.push(currentChunk);
    currentChunk = paragraph;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function createEmbeddings(
  chunks: string[]
): Promise<number[][]> {
  if (chunks.length === 0) {
    return [];
  }

  console.log(
    `Generating embeddings for ${chunks.length} chunks...`
  );

  const embeddings =
    await generateEmbeddings(chunks);

  if (embeddings.length !== chunks.length) {
    throw new Error(
      `Embedding count mismatch. Expected ${chunks.length}, got ${embeddings.length}.`
    );
  }

  return embeddings;
}

async function saveChunkWithEmbedding(
  documentId: string,
  content: string,
  chunkIndex: number,
  embedding: number[]
): Promise<void> {
  if (!embedding.length) {
    throw new Error(
      "Failed to generate document chunk embedding."
    );
  }

  const id = randomUUID();

  const vector =
    `[${embedding.join(",")}]`;

  await prisma.$executeRaw`
    INSERT INTO "DocumentChunk"
      (
        "id",
        "content",
        "embedding",
        "chunkIndex",
        "documentId",
        "createdAt"
      )
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

/**
 * Extract text depending on the source type.
 */
async function extractDocumentText(
  document: {
    id: string;
    type: "FILE" | "WEBPAGE" | "YOUTUBE";
    fileUrl: string | null;
    sourceUrl: string | null;
  }
): Promise<string> {
  // -----------------------------
  // PDF FILE
  // -----------------------------

  if (document.type === "FILE") {
    if (!document.fileUrl) {
      throw new Error(
        "Document file is missing."
      );
    }

    const fileBuffer =
      await downloadDocumentFile(
        document.fileUrl
      );

    const parser = new PDFParse({
      data: fileBuffer,
    });

    try {
      const result =
        await parser.getText();

      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  // -----------------------------
  // WEBPAGE
  // -----------------------------

  if (document.type === "WEBPAGE") {
    if (!document.sourceUrl) {
      throw new Error(
        "Webpage URL is missing."
      );
    }

    const webpage =
      await extractWebPage(
        document.sourceUrl
      );

    return webpage.content;
  }

  // -----------------------------
  // YOUTUBE
  // -----------------------------

  if (document.type === "YOUTUBE") {
    if (!document.sourceUrl) {
      throw new Error(
        "YouTube URL is missing."
      );
    }

    const parsed =
      new URL(document.sourceUrl);

    let videoId = "";

    if (
      parsed.hostname === "youtu.be"
    ) {
      videoId =
        parsed.pathname.slice(1);
    } else {
      videoId =
        parsed.searchParams.get("v") ??
        parsed.pathname.split("/").pop() ??
        "";
    }

    if (!videoId) {
      throw new Error(
        "Could not determine YouTube video ID."
      );
    }

    const youtube =
      await extractYouTubeContent(
        videoId
      );

    return youtube.content;
  }

  throw new Error(
    `Unsupported document type: ${document.type}`
  );
}

export async function processDocument(
  documentId: string
): Promise<void> {
  const document =
    await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

  if (!document) {
    throw new Error(
      "Document not found."
    );
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
    const text =
      await extractDocumentText({
        id: document.id,
        type: document.type,
        fileUrl: document.fileUrl,
        sourceUrl: document.sourceUrl,
      });

    const chunks =
      createChunks(text);

    if (chunks.length === 0) {
      throw new Error(
        "No readable text was extracted from the source."
      );
    }

    console.log(
      `Document ${document.id}: ${chunks.length} chunks created.`
    );

    await prisma.documentChunk.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    const embeddings =
      await createEmbeddings(chunks);

    if (
      embeddings.length !==
      chunks.length
    ) {
      throw new Error(
        "Embedding count does not match chunk count."
      );
    }

    for (
      let index = 0;
      index < chunks.length;
      index++
    ) {
      const embedding =
        embeddings[index];

      if (!embedding?.length) {
        throw new Error(
          `Failed to generate embedding for chunk ${index}.`
        );
      }

      await saveChunkWithEmbedding(
        document.id,
        chunks[index],
        index,
        embedding
      );
    }

    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        processingStatus:
          "COMPLETED",
      },
    });

    console.log(
      `Document ${document.id}: processing completed.`
    );
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