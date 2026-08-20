import { Router } from "express";

import {
  generateQuiz,
  getQuiz,
  submitQuiz,
} from "../controllers/quiz.controller";

import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/:courseId/generate",
  authenticate,
  generateQuiz
);

router.get(
  "/:courseId",
  authenticate,
  getQuiz
);

router.post(
  "/:quizId/submit",
  authenticate,
  submitQuiz
);

export default router;