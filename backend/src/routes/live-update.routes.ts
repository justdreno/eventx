import { Router } from 'express';
import { LiveUpdateController } from '../controllers/live-update.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const controller = new LiveUpdateController();

router.get('/:eventId', controller.getByEvent);
router.post('/', authenticate, authorize('admin', 'teacher'), controller.create);

export default router;
