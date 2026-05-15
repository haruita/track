import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

const uploadsDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination(_, _file, cb) {
    cb(null, uploadsDir);
  },
  filename(_, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const upload = multer({ storage });
