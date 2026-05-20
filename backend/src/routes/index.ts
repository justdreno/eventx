import { Router } from 'express';
import eventRoutes from './event.routes';
import authRoutes from './auth.routes';
import announcementRoutes from './announcement.routes';
import registrationRoutes from './registration.routes';
import liveUpdateRoutes from './live-update.routes';

const router = Router();

router.use('/events', eventRoutes);
router.use('/auth', authRoutes);
router.use('/announcements', announcementRoutes);
router.use('/registrations', registrationRoutes);
router.use('/live-updates', liveUpdateRoutes);

export default router;
