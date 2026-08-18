import multer from "multer";

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
    files: 1,
  },

  fileFilter(_req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF files are supported.")
      );
    }

    cb(null, true);
  },
});