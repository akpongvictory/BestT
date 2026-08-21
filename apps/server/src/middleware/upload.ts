import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDirectory);
  },

  filename(_req, file, cb) {
    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  fileFilter(_req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error(
          "Only PDF files are supported."
        )
      );
    }

    cb(null, true);
  },
});