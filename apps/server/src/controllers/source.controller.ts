import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

import { parseSourceUrl } from "../services/source-url.services";

import { getYouTubeVideo } from "../services/youtube.service";

import { extractWebPage } from "../services/webpage.service";

import { processDocument } from "../services/document-processing.service";

export async function addSource(
  req: AuthRequest,
  res: Response
) {
  try {
    const { courseId, url } = req.body;

    // -----------------------------------------
    // Authentication
    // -----------------------------------------

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // -----------------------------------------
    // Validate input
    // -----------------------------------------

    if (!courseId || typeof courseId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    // -----------------------------------------
    // Verify course ownership
    // -----------------------------------------

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

    // -----------------------------------------
    // Parse and validate source URL
    // -----------------------------------------

    const source = parseSourceUrl(url);

         // -----------------------------------------
    // Prevent duplicate URL sources
    // (allow retrying a previously failed source)
    // -----------------------------------------

    const existing = await prisma.document.findFirst({
      where: {
        courseId,
        userId: req.user.id,
        sourceUrl: source.url,
      },
      select: {
        id: true,
        originalName: true,
        sourceUrl: true,
        type: true,
        processingStatus: true,
      },
    });

    if (existing && existing.processingStatus !== "FAILED") {
      return res.status(409).json({
        success: false,
        message:
          "This source has already been added to this course.",
        data: existing,
      });
    }

    if (existing && existing.processingStatus === "FAILED") {
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

      const retriedDocument = await prisma.document.findUnique({
        where: {
          id: existing.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Source retried successfully.",
        data: retriedDocument,
      });
    }

    // -----------------------------------------
    // Get source metadata
    // -----------------------------------------

    let title = "Web page";
    let description = "";

    if (source.type === "YOUTUBE") {
      if (!source.youtubeVideoId) {
        return res.status(400).json({
          success: false,
          message: "Could not determine YouTube video ID.",
        });
      }

      const video = await getYouTubeVideo(
        source.youtubeVideoId
      );

      title = video.title;
      description = video.description ?? "";
    } else if (source.type === "WEBPAGE") {
      const webpage = await extractWebPage(source.url);

      title = webpage.title || "Web page";
    }

    // -----------------------------------------
    // Create document
    // -----------------------------------------

    const document = await prisma.document.create({
      data: {
        originalName: title,
        sourceUrl: source.url,
        type: source.type,
        title,
        description,
        courseId,
        userId: req.user.id,
        processingStatus: "PENDING",
      },
    });

    // -----------------------------------------
    // Process into chunks + embeddings
    // -----------------------------------------

    await processDocument(document.id);

    // -----------------------------------------
    // Return updated document
    // -----------------------------------------

    const processedDocument =
      await prisma.document.findUnique({
        where: {
          id: document.id,
        },
      });

    return res.status(201).json({
      success: true,
      message: "Source added successfully.",
      data: processedDocument,
    });
  } catch (error) {
    console.error(
      "[SOURCE] Failed to add source:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to add source.";

    const normalizedMessage = message.toLowerCase();

    let status = 500;

    if (
      normalizedMessage.includes("already been added")
    ) {
      status = 409;
    } else if (
      normalizedMessage.includes("required") ||
      normalizedMessage.includes("invalid url") ||
      normalizedMessage.includes("could not determine") ||
      normalizedMessage.includes("no transcript") ||
      normalizedMessage.includes(
        "youtube video could not be found"
      )
    ) {
      status = 400;
    }

    return res.status(status).json({
      success: false,
      message,
    });
  }
}