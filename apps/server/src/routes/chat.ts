import { Router } from "express";

import { chatWithTutor } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  chatWithTutor
);

export default router;