import { Request, Response } from "express";
import { BestTTutorAgent } from "@bestt/ai";
import { env } from "../config/env";
import { extractUrlContent } from "../services/content.service";

const tutor = new BestTTutorAgent({
  apiKey: env.geminiApiKey,
  modelName: env.geminiModel,
});

export async function chatWithTutor(
  req: Request,
  res: Response
) {
  try {
    const { question, context, url } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

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

    if (!context && !url) {
      return res.status(400).json({
        success: false,
        message: "Context or URL is required.",
      });
    }

    let tutorContext = context;

    if (url) {
      const extracted = await extractUrlContent(url);
      tutorContext = extracted.content;
    }

    const answer = await tutor.answer({
      question,
      context: tutorContext,
    });

    return res.status(200).json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("========== CHAT ERROR ==========");
    console.error(error);
    console.error("================================");

    return res.status(500).json({
      success: false,
      message: "Failed to generate tutor response.",
    });
  }
}