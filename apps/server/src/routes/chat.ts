import { Router } from "express";
import { chatWithTutor } from "../controllers/chat.controller";

const router = Router();

router.post("/", chatWithTutor);

export default router;