import fs from "fs/promises";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

import prisma from "../lib/prisma";
import {
  uploadDocumentFile,
  deleteDocumentFile,
} from "./storage.service";

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

function createStoragePath(
  courseId: string,
  documentId: string,
  originalName: string
) {
  const extension =
    originalName.toLowerCase().endsWith(".pdf")
      ? ".pdf"
      : "";

  return `documents/${courseId}/${documentId}${extension}`;
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

  try {
    const fileHash =
      await calculateFileHash(filePath);

    /*
     * Check whether this exact document already
     * exists in this course.
     */
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
       * Failed documents can be retried.
       */
      if (
        existingDocument.processingStatus ===
        "FAILED"
      ) {
        const storagePath =
          createStoragePath(
            courseId,
            existingDocument.id,
            file.originalname
          );

        /*
         * Upload replacement file.
         */
        await uploadDocumentFile({
          filePath,
          storagePath,
          contentType: file.mimetype,
        });

        /*
         * Remove temporary local file.
         */
        await fs.unlink(filePath);

        return await prisma.document.update({
          where: {
            id: existingDocument.id,
          },

          data: {
            filename: file.originalname,
            originalName: file.originalname,
            fileUrl: storagePath,
            fileType: file.mimetype,
            fileSize: file.size,
            fileHash,
            processingStatus: "PENDING",
          },
        });
      }

      /*
       * Completed or currently-processing
       * documents are genuine duplicates.
       */
      await fs.unlink(filePath);

      throw createDuplicateDocumentError();
    }

    /*
     * Create database record first so we get
     * a stable document ID for the storage path.
     */
    const document =
      await prisma.document.create({
        data: {
          filename: file.originalname,
          originalName: file.originalname,

          /*
           * Temporary placeholder.
           * We update this immediately after creation.
           */
          fileUrl: "",

          fileType: file.mimetype,
          fileSize: file.size,
          fileHash,
          courseId,
          userId,
          processingStatus: "PENDING",
        },
      });

    const storagePath =
      createStoragePath(
        courseId,
        document.id,
        file.originalname
      );

    try {
      /*
       * Upload the actual PDF to Supabase Storage.
       */
      await uploadDocumentFile({
        filePath,
        storagePath,
        contentType: file.mimetype,
      });

      /*
       * Store the storage path in PostgreSQL.
       */
      const updatedDocument =
        await prisma.document.update({
          where: {
            id: document.id,
          },

          data: {
            fileUrl: storagePath,
          },
        });

      /*
       * Remove the temporary local file.
       */
      await fs.unlink(filePath);

      return updatedDocument;
    } catch (error) {
      /*
       * If storage upload fails, don't leave
       * an orphaned database record behind.
       */
      await prisma.document.delete({
        where: {
          id: document.id,
        },
      });

      throw error;
    }
  } catch (error) {
    /*
     * Make a best effort to remove the temporary
     * Multer file.
     */
    try {
      await fs.unlink(filePath);
    } catch {
      // File may already have been removed.
    }

    /*
     * Preserve duplicate-document errors.
     */
    if (
      error instanceof Error &&
      error.name === "DuplicateDocumentError"
    ) {
      throw error;
    }

    /*
     * Preserve Prisma errors and other failures.
     */
    throw error;
  }
}

export async function deleteDocument(
  documentId: string,
  userId: string
) {
  const document =
    await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

  if (!document) {
    return null;
  }

  /*
   * Delete database record first.
   *
   * The Prisma relation cascade will remove
   * associated chunks.
   */
  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });

  /*
   * Then remove the PDF from Supabase Storage.
   */
  if (document.fileUrl) {
    try {
      await deleteDocumentFile(
        document.fileUrl
      );
    } catch (error) {
      /*
       * The database deletion has already succeeded.
       * Log the storage failure rather than making the
       * user think the document still exists.
       */
      console.warn(
        "Could not delete document from storage:",
        error
      );
    }
  }

  return document;
}