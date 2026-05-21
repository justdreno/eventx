import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const controller = new AdminController();

router.get('/stats', authenticate, authorize('admin', 'teacher'), controller.getStats);
router.get('/events', authenticate, authorize('admin', 'teacher'), controller.getEvents);
router.get('/users', authenticate, authorize('admin', 'teacher'), controller.getUsers);
router.put('/users/:id', authenticate, authorize('admin'), controller.updateUser);
router.delete('/users/:id', authenticate, authorize('admin'), controller.deleteUser);
router.get('/registrations', authenticate, authorize('admin', 'teacher'), controller.getRegistrations);
router.put('/registrations/:id/checkin', authenticate, authorize('admin', 'teacher'), controller.checkInRegistration);
router.get('/live-updates', authenticate, authorize('admin', 'teacher'), controller.getLiveUpdates);
router.delete('/live-updates/:id', authenticate, authorize('admin', 'teacher'), controller.deleteLiveUpdate);

export default router;
