import { Router } from "express";

import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  uploadDocument,
  removeDocument,
} from "../controllers/document.controller";
import { addSource } from "../controllers/source.controller";
const router = Router();

router.post(
  "/source",
  authenticate,
  addSource
);

router.delete(
  "/:documentId",
  authenticate,
  removeDocument
);



export default router;