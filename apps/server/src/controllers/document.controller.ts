import { Response } from "express";
import { processDocument } from "../services/document-processing.service";
import { AuthRequest } from "../middleware/auth";
import {
  createDocument,
  deleteDocument,
} from "../services/document.services";

export async function uploadDocument(
  req: AuthRequest,
  res: Response
) {
  try {
    const file = req.file;
    const { courseId } = req.body;

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

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const document = await createDocument({
      file,
      courseId,
      userId: req.user.id,
    });
    await processDocument(document.id);

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Upload Document Error:", error);

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