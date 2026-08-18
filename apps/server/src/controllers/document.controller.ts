import { Response } from "express";

import { processDocument } from "../services/document-processing.service";
import { AuthRequest } from "../middleware/auth";

import {
  createDocument,
  deleteDocument,
} from "../services/document.services";

import prisma from "../lib/prisma";

export async function uploadDocument(
  req: AuthRequest,
  res: Response
) {
  let uploadedFilePath: string | undefined;

  try {
    const file = req.file;
    const { courseId } = req.body;

    uploadedFilePath = file?.path;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    // Verify that the authenticated user owns the course.
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: req.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const document = await createDocument({
      file,
      courseId,
      userId: req.user.id,
    });

    // createDocument owns the physical file from this point.
    uploadedFilePath = undefined;

    await processDocument(document.id);

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Upload Document Error:", error);

    if (
      error instanceof Error &&
      error.name === "DuplicateDocumentError"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    // If an error occurred before createDocument took ownership
    // of the physical file, clean it up.
    if (uploadedFilePath) {
      try {
        const fs = await import("fs/promises");
        await fs.unlink(uploadedFilePath);
      } catch {
        // Nothing else to do.
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload document.",
    });
  }
}

export async function removeDocument(
  req: AuthRequest,
  res: Response
) {
  try {
    const { documentId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const document = await deleteDocument(
      documentId,
      req.user.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Delete Document Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document.",
    });
  }
}