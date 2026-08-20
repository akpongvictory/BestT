import prisma from "../lib/prisma";

import { parseSourceUrl } from "./source-url.services";
import { processDocument } from "./document-processing.service";

export async function createSourceDocument({
  url,
  courseId,
  userId,
}: {
  url: string;
  courseId: string;
  userId: string;
}) {
  // -----------------------------------------
  // Parse source URL
  // -----------------------------------------

  const parsed = parseSourceUrl(url);

  // -----------------------------------------
  // Verify course ownership
  // -----------------------------------------

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  // -----------------------------------------
  // Check for existing source
  // -----------------------------------------

  const existing = await prisma.document.findFirst({
    where: {
      courseId,
      userId,
      sourceUrl: parsed.url,
    },
  });

  // -----------------------------------------
  // Existing source already processed
  // -----------------------------------------

  if (
    existing &&
    existing.processingStatus !== "FAILED"
  ) {
    const error = new Error(
      "This source has already been added to this course."
    );

    error.name = "DuplicateSourceError";

    throw error;
  }

  // -----------------------------------------
  // Retry previously failed source
  // -----------------------------------------

  if (
    existing &&
    existing.processingStatus === "FAILED"
  ) {
    await prisma.documentChunk.deleteMany({
      where: {
        documentId: existing.id,
      },
    });

    await prisma.document.update({
      where: {
        id: existing.id,
      },
      data: {
        processingStatus: "PENDING",
      },
    });

    await processDocument(existing.id);

    return prisma.document.findUnique({
      where: {
        id: existing.id,
      },
    });
  }

  // -----------------------------------------
  // Create new source document
  // -----------------------------------------

  const document = await prisma.document.create({
    data: {
      originalName:
        parsed.type === "YOUTUBE"
          ? "YouTube video"
          : parsed.url,

      sourceUrl: parsed.url,

      type: parsed.type,

      fileUrl: null,
      filename: null,

      fileType:
        parsed.type === "YOUTUBE"
          ? "video/youtube"
          : "text/html",

      courseId,
      userId,

      processingStatus: "PENDING",
    },
  });

  // -----------------------------------------
  // Process source
  // -----------------------------------------

  await processDocument(document.id);

  // -----------------------------------------
  // Return processed document
  // -----------------------------------------

  return prisma.document.findUnique({
    where: {
      id: document.id,
    },
  });
}