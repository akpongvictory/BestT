import { Router } from "express";

import {
  chatWithTutor,
  getChatHistory,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  chatWithTutor
);

router.get(
  "/history/:courseId",
  authenticate,
  getChatHistory
);

router.get("/test", (_req, res) => {
  res.json({
    success: true,
    message: "Chat router is working",
  });
});

export default router;