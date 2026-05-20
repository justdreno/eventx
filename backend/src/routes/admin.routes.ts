import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const controller = new AdminController();

router.get('/stats', authenticate, authorize('admin', 'teacher'), controller.getStats);

export default router;
