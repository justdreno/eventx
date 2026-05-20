import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const controller = new AnnouncementController();

router.get('/', controller.getAll);
router.get('/event/:eventId', controller.getByEvent);
router.post('/', authenticate, authorize('admin', 'teacher'), controller.create);
router.delete('/:id', authenticate, authorize('admin'), controller.delete);

export default router;
