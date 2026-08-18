import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

import prisma from "../lib/prisma";

async function calculateFileHash(
  filePath: string
): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);

  return crypto
    .createHash("sha256")
    .update(fileBuffer)
    .digest("hex");
}

function createDuplicateDocumentError() {
  const error = new Error(
    "This document has already been uploaded to this course."
  );

  error.name = "DuplicateDocumentError";

  return error;
}

export async function createDocument({
  file,
  courseId,
  userId,
}: {
  file: Express.Multer.File;
  courseId: string;
  userId: string;
}) {
  const filePath = file.path;

  const fileHash = await calculateFileHash(filePath);

  // Fast path: avoid an unnecessary database insert for
  // documents that are already known to exist.
const existingDocument =
  await prisma.document.findFirst({
    where: {
      courseId,
      userId,
      fileHash,
    },
  });

if (existingDocument) {
  /*
   * A previously failed document can be retried.
   *
   * Replace its stored file with the newly uploaded file
   * and reset processing back to PENDING.
   */
  if (
    existingDocument.processingStatus ===
    "FAILED"
  ) {
    try {
      const oldFilename = path.basename(
        existingDocument.fileUrl
      );

      const oldFilePath = path.resolve(
        "src/uploads",
        oldFilename
      );

      await fs.unlink(oldFilePath);
    } catch (error) {
      console.warn(
        "Could not remove old failed document file:",
        error
      );
    }

    return await prisma.document.update({
      where: {
        id: existingDocument.id,
      },
      data: {
        filename: file.originalname,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        fileHash,
        processingStatus: "PENDING",
      },
    });
  }

  /*
   * Completed or currently-processing documents are
   * genuine duplicates.
   */
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(
      "Could not remove duplicate uploaded file:",
      error
    );
  }

  throw createDuplicateDocumentError();
}

  try {
    return await prisma.document.create({
      data: {
        filename: file.originalname,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        fileHash,
        courseId,
        userId,
      },
    });
  } catch (error) {
    // The unique database constraint protects against two
    // identical uploads arriving at exactly the same time.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.warn(
          "Could not remove duplicate uploaded file:",
          unlinkError
        );
      }

      throw createDuplicateDocumentError();
    }

    throw error;
  }
}

export async function deleteDocument(
  documentId: string,
  userId: string
) {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      userId,
    },
  });

  if (!document) {
    return null;
  }

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });

  try {
    const filename = path.basename(document.fileUrl);

    const filePath = path.resolve(
      "src/uploads",
      filename
    );

    await fs.unlink(filePath);
  } catch (error) {
    console.warn(
      "Could not delete physical file:",
      error
    );
  }

  return document;
}