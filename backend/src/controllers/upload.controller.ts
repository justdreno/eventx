import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { sendSuccess, sendError } from '../utils';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed'));
  },
});

export class UploadController {
  uploadFile(req: Request, res: Response, _next: NextFunction) {
    try {
      if (!req.file) return sendError(res, 'No file uploaded', 400);
      const url = `/uploads/${req.file.filename}`;
      return sendSuccess(res, { url }, 'File uploaded successfully');
    } catch (err) {
      return sendError(res, (err as Error).message);
    }
  }
}
