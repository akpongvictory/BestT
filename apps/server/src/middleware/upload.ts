import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "src/uploads");
  },

  filename(_req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});