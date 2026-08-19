// chat.controller.ts

import { Response } from "express";
import { BestTTutorAgent } from "@bestt/ai";
import prisma from "../lib/prisma";

import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";
import { extractUrlContent } from "../services/content.service";
import { searchSimilarChunks } from "../services/embedding-search.service";


// ==================================================
// AI TUTOR CONFIGURATION
// ==================================================

const tutor = new BestTTutorAgent({
  provider: env.aiProvider as
    | "auto"
    | "gemini"
    | "groq"
    | "huggingface"
    | "openai"
    | "openrouter"
    | "cerebras",

  geminiApiKey: env.geminiApiKey,
  geminiModel: env.geminiModel,

  groqApiKey: env.groqApiKey,
  groqModel: env.groqModel,

  huggingfaceApiKey: env.huggingfaceApiKey,
  huggingfaceModel: env.huggingfaceModel,

  openaiApiKey: env.openaiApiKey,
  openaiModel: env.openaiModel,

  openrouterApiKey: env.openrouterApiKey,
  openrouterModel: env.openrouterModel,

  cerebrasApiKey: env.cerebrasApiKey,
  cerebrasModel: env.cerebrasModel,
});


// ==================================================
// LIMITS
// ==================================================

const MAX_QUESTION_LENGTH = 4000;
const MAX_CONTEXT_LENGTH = 30000;

// ==================================================
// GET CHAT HISTORY
// ==================================================

export async function getChatHistory(
  req: AuthRequest,
  res: Response
) {
  try {
    const { courseId } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!courseId || typeof courseId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const session = await prisma.chatSession.findFirst({
      where: {
        userId: req.user.id,
        courseId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return res.status(200).json({
        success: true,
        data: {
          sessionId: null,
          messages: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        messages: session.messages.map((message) => ({
          id: message.id,
          role:
            message.role === "USER"
              ? "user"
              : "assistant",
          content: message.content,
          createdAt: message.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error(
      "[CHAT HISTORY] Failed to load history:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load chat history.",
    });
  }
}

// ==================================================
// CHAT WITH TUTOR
// ==================================================

export async function chatWithTutor(
  req: AuthRequest,
  res: Response
) {
  try {
    console.log("[CHAT] Sending 200 response");
   const {
  question,
  courseId,
  sessionId,
  context,
  url,
} = req.body;

    // ==================================================
    // VALIDATE QUESTION
    // ==================================================

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


    // ==================================================
    // VALIDATE COURSE ID
    // ==================================================

    if (
      courseId !== undefined &&
      typeof courseId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "courseId must be a string.",
      });
    }


      // ==================================================
    // RAG COURSE PATH
    // ==================================================

    if (courseId) {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // --------------------------------------------------
      // VERIFY COURSE BELONGS TO USER
      // --------------------------------------------------

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

      // --------------------------------------------------
      // FIND OR CREATE CHAT SESSION
      // --------------------------------------------------

      let chatSession;

      if (sessionId) {
        chatSession = await prisma.chatSession.findFirst({
          where: {
            id: sessionId,
            userId: req.user.id,
            courseId,
          },
        });

        if (!chatSession) {
          return res.status(404).json({
            success: false,
            message: "Chat session not found.",
          });
        }
      } else {
        chatSession = await prisma.chatSession.create({
          data: {
            userId: req.user.id,
            courseId,
            title: question.trim().slice(0, 80),
          },
        });
      }

      // --------------------------------------------------
      // SAVE USER MESSAGE
      // --------------------------------------------------

      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          role: "USER",
          content: question.trim(),
        },
      });

      // --------------------------------------------------
      // SEARCH SIMILAR COURSE CHUNKS
      // --------------------------------------------------
          const similarChunks =
        await searchSimilarChunks({
          question: question.trim(),
          courseId,
          userId: req.user.id,
          limit: 5,
          minSimilarity: 0,
        });


      if (similarChunks.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No relevant indexed course material was found. Make sure your documents have finished processing, then try again.",
        });
      }


      // --------------------------------------------------
      // BUILD TUTOR CONTEXT
      // --------------------------------------------------

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


      // ==================================================
      // CALL AI TUTOR
      // ==================================================

      console.log(
        "[CHAT] Calling BestTTutorAgent.answer()"
      );

      const answer = await tutor.answer({
        question: question.trim(),
        context: tutorContext,
      });

      // --------------------------------------------------
// SAVE ASSISTANT MESSAGE
// --------------------------------------------------

const assistantMessage =
  await prisma.chatMessage.create({
    data: {
      sessionId: chatSession.id,
      role: "ASSISTANT",
      content: answer,
    },
  });


      // ==================================================
      // AI RESPONSE COMPLETED
      // ==================================================

      console.log(
        "[CHAT] BestTTutorAgent.answer() completed",
        {
          answerLength: answer?.length,
        }
      );


      // ==================================================
      // SEND RESPONSE TO BROWSER
      // ==================================================

      console.log(
        "[CHAT] Sending 200 response"
      );

          return res.status(200).json({
        success: true,
        data: {
          sessionId: chatSession.id,
          messageId: assistantMessage.id,
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


    // ==================================================
    // LEGACY CONTEXT / URL PATH
    // ==================================================

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


    // ==================================================
    // PREPARE TUTOR CONTEXT
    // ==================================================

    let tutorContext = context;

    if (url) {
      const extracted = await extractUrlContent(url);

      tutorContext = extracted.content;

      if (
        tutorContext.length > MAX_CONTEXT_LENGTH
      ) {
        tutorContext =
          tutorContext.slice(
            0,
            MAX_CONTEXT_LENGTH
          );
      }
    }


    // ==================================================
    // CALL AI TUTOR
    // ==================================================

    console.log(
      "[CHAT] Calling BestTTutorAgent.answer()"
    );

    const answer = await tutor.answer({
      question: question.trim(),
      context: tutorContext ?? "",
    });


    // ==================================================
    // AI RESPONSE COMPLETED
    // ==================================================

    console.log(
      "[CHAT] BestTTutorAgent.answer() completed",
      {
        answerLength: answer?.length,
      }
    );


    // ==================================================
    // SEND RESPONSE TO BROWSER
    // ==================================================

    console.log(
      "[CHAT] Sending 200 response"
    );

    return res.status(200).json({
      success: true,
      data: {
        answer,
      },
    });

  } catch (error) {

    // ==================================================
    // ERROR HANDLING
    // ==================================================

    console.error(
      "========== CHAT ERROR =========="
    );

    if (error instanceof Error) {
      console.error("NAME:", error.name);
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    } else {
      console.error(
        "UNKNOWN ERROR:",
        error
      );
    }

    console.error(
      "================================"
    );


    return res.status(500).json({
      success: false,
      message:
        "Failed to generate tutor response.",
    });
  }
}