import { Response } from "express";
import { BestTTutorAgent } from "@bestt/ai";

import prisma from "../lib/prisma";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";
import { searchSimilarChunks } from "../services/embedding-search.service";

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

const QUESTION_COUNT = 10;

interface GeneratedQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

function parseGeneratedQuiz(text: string): GeneratedQuestion[] {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("AI response was not an array.");
  }

  if (parsed.length === 0) {
    throw new Error("AI generated no questions.");
  }

  return parsed.map((item, index) => {
    if (
      !item ||
      typeof item.question !== "string" ||
      !Array.isArray(item.options) ||
      typeof item.answer !== "string"
    ) {
      throw new Error(
        `Invalid question structure at index ${index}.`
      );
    }

    const options = item.options
      .filter(
        (option: unknown): option is string =>
          typeof option === "string"
      )
      .map((option: string) => option.trim())
      .filter(Boolean);

    if (options.length < 2) {
      throw new Error(
        `Question ${index + 1} has fewer than two options.`
      );
    }

    if (!options.includes(item.answer.trim())) {
      throw new Error(
        `Question ${index + 1} has an answer that is not one of its options.`
      );
    }

    return {
      question: item.question.trim(),
      options,
      answer: item.answer.trim(),
      explanation:
        typeof item.explanation === "string"
          ? item.explanation.trim()
          : undefined,
    };
  });
}


// =====================================================
// GENERATE QUIZ
// POST /api/quiz/:courseId/generate
// =====================================================

export async function generateQuiz(
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

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    console.log(
      `[QUIZ] Generating quiz for course: ${course.title}`
    );

    const similarChunks = await searchSimilarChunks({
      question:
        "Identify the most important concepts, definitions, principles, processes, and facts students should understand from this course material.",
      courseId,
      userId: req.user.id,
      limit: 10,
      minSimilarity: 0,
    });

    if (similarChunks.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No indexed course material was found. Make sure your documents have finished processing.",
      });
    }

    const context = similarChunks
      .map((chunk, index) =>
        [
          `SOURCE ${index + 1}`,
          `Document: ${chunk.documentName}`,
          `Chunk: ${chunk.chunkIndex}`,
          "",
          chunk.content,
        ].join("\n")
      )
      .join("\n\n====================\n\n");

    const prompt = `
Create a multiple-choice quiz from the provided course material.

Generate exactly ${QUESTION_COUNT} questions.

IMPORTANT:
- Every question must be answerable from the provided material.
- Do not use outside knowledge.
- Do not invent facts.
- Each question must have exactly 4 answer options.
- Only one option may be correct.
- The "answer" field must exactly match one of the options.
- Include a short explanation of why the correct answer is correct.
- Cover different important concepts rather than asking the same thing repeatedly.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not include code fences.

Return this exact structure:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Option B",
    "explanation": "Short explanation."
  }
]

Course title:
${course.title}

Course material:
${context}
`;

    console.log("[QUIZ] Calling BestTTutorAgent...");

    const rawResponse = await tutor.answer({
      question: prompt,
      context,
    });

    console.log(
      "[QUIZ] AI response received:",
      rawResponse.length
    );

    let questions: GeneratedQuestion[];

    try {
      questions = parseGeneratedQuiz(rawResponse);
    } catch (error) {
      console.error(
        "[QUIZ] Failed to parse AI response:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "The AI generated an invalid quiz format. Please try again.",
      });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: `${course.title} Quiz`,
        description:
          "A quiz generated from your course material.",
        courseId,
        questions: {
          create: questions.map((question) => ({
            question: question.question,
            options: question.options,
            answer: question.answer,
            explanation: question.explanation,
          })),
        },
      },
      include: {
        questions: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            question: true,
            options: true,
            explanation: true,
          },
        },
      },
    });

    console.log(
      `[QUIZ] Created quiz ${quiz.id} with ${quiz.questions.length} questions.`
    );

    return res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("[QUIZ] Generation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz.",
    });
  }
}


// =====================================================
// GET QUIZ
// GET /api/quiz/:courseId
// =====================================================

export async function getQuiz(
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

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        courseId,
      },
      include: {
        questions: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            question: true,
            options: true,
            explanation: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message:
          "No quiz has been created for this course yet.",
      });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("[QUIZ] Failed to load quiz:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load quiz.",
    });
  }
}


// =====================================================
// SUBMIT QUIZ
// POST /api/quiz/:quizId/submit
// =====================================================

export async function submitQuiz(
  req: AuthRequest,
  res: Response
) {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        course: {
          userId: req.user.id,
        },
      },
      include: {
        questions: {
          select: {
            id: true,
            answer: true,
            explanation: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    let score = 0;

    const results = quiz.questions.map((question) => {
      const selectedAnswer = answers[question.id];

      const correct =
        typeof selectedAnswer === "string" &&
        selectedAnswer.trim() ===
          question.answer.trim();

      if (correct) {
        score++;
      }

      return {
        questionId: question.id,
        selectedAnswer: selectedAnswer ?? null,
        correct,
        explanation: question.explanation,
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        score,
        totalQuestions: quiz.questions.length,
        answers,
        userId: req.user.id,
        quizId,
      },
    });

    const percentage =
      quiz.questions.length > 0
        ? Math.round(
            (score / quiz.questions.length) * 100
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt.id,
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        results,
      },
    });
  } catch (error) {
    console.error(
      "[QUIZ] Submission failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
    });
  }
}