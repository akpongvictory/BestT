import { Router } from "express";

import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  uploadDocument,
  removeDocument,
} from "../controllers/document.controller";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadDocument
);

router.delete(
  "/:documentId",
  authenticate,
  removeDocument
);

export default router;