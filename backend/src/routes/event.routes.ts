import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const controller = new EventController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('admin', 'teacher'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'teacher'), controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.delete);

export default router;
