import { Response } from "express";
import { BestTTutorAgent } from "@bestt/ai";

import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";
import { extractUrlContent } from "../services/content.service";
import { searchSimilarChunks } from "../services/embedding-search.service";

const tutor = new BestTTutorAgent({
  provider: env.aiProvider as
    | "gemini"
    | "groq"
    | "openai"
    | "openrouter"
    | "cerebras",

  geminiApiKey: env.geminiApiKey,
  geminiModel: env.geminiModel,

  groqApiKey: env.groqApiKey,
  groqModel: env.groqModel,

  openaiApiKey: env.openaiApiKey,
  openaiModel: env.openaiModel,

  openrouterApiKey: env.openrouterApiKey,
  openrouterModel: env.openrouterModel,

  cerebrasApiKey: env.cerebrasApiKey,
  cerebrasModel: env.cerebrasModel,
});

const MAX_QUESTION_LENGTH = 4000;
const MAX_CONTEXT_LENGTH = 30000;

export async function chatWithTutor(
  req: AuthRequest,
  res: Response
) {
  try {
    const {
      question,
      courseId,
      context,
      url,
    } = req.body;

    // --------------------------------------------------
    // Validate question
    // --------------------------------------------------

    if (
      !question ||
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Question cannot exceed ${MAX_QUESTION_LENGTH} characters.`,
      });
    }

    // --------------------------------------------------
    // Validate courseId
    // --------------------------------------------------

    if (
      courseId !== undefined &&
      typeof courseId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "courseId must be a string.",
      });
    }

    // --------------------------------------------------
    // RAG course path
    // --------------------------------------------------

    if (courseId) {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const similarChunks =
        await searchSimilarChunks({
          question: question.trim(),
          courseId,
          userId: req.user.id,
          limit: 5,
          minSimilarity: 0.45,
        });

      if (similarChunks.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No relevant indexed course material was found. Make sure your documents have finished processing, then try again.",
        });
      }

      const tutorContext = similarChunks
        .map((chunk, index) => {
          return [
            `SOURCE ${index + 1}`,
            `Document: ${chunk.documentName}`,
            `Chunk: ${chunk.chunkIndex}`,
            `Similarity: ${chunk.similarity.toFixed(3)}`,
            "",
            chunk.content,
          ].join("\n");
        })
        .join("\n\n====================\n\n");

      const answer = await tutor.answer({
        question: question.trim(),
        context: tutorContext,
      });

      return res.status(200).json({
        success: true,
        data: {
          answer,
          sources: similarChunks.map((chunk) => ({
            documentId: chunk.documentId,
            documentName: chunk.documentName,
            chunkIndex: chunk.chunkIndex,
            similarity: chunk.similarity,
          })),
        },
      });
    }

    // --------------------------------------------------
    // Legacy context / URL path
    // --------------------------------------------------

    if (
      context !== undefined &&
      typeof context !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Context must be a string.",
      });
    }

    if (
      url !== undefined &&
      typeof url !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "URL must be a string.",
      });
    }

    if (
      context &&
      context.length > MAX_CONTEXT_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: `Context cannot exceed ${MAX_CONTEXT_LENGTH} characters.`,
      });
    }

    if (!context && !url) {
      return res.status(400).json({
        success: false,
        message:
          "courseId, context, or URL is required.",
      });
    }

    let tutorContext = context;

    if (url) {
      const extracted = await extractUrlContent(url);

      tutorContext = extracted.content;

      if (tutorContext.length > MAX_CONTEXT_LENGTH) {
        tutorContext =
          tutorContext.slice(0, MAX_CONTEXT_LENGTH);
      }
    }

    const answer = await tutor.answer({
      question: question.trim(),
      context: tutorContext ?? "",
    });

    return res.status(200).json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("========== CHAT ERROR ==========");

    if (error instanceof Error) {
      console.error("NAME:", error.name);
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    } else {
      console.error("UNKNOWN ERROR:", error);
    }

    console.error("================================");

    return res.status(500).json({
      success: false,
      message: "Failed to generate tutor response.",
    });
  }
}