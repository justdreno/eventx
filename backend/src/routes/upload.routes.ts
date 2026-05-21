import { Router } from 'express';
import { UploadController, upload } from '../controllers/upload.controller';
import { authenticate } from '../middlewares';

const router = Router();
const controller = new UploadController();

router.post('/', authenticate, upload.single('file'), controller.uploadFile);

export default router;
