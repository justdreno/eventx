import { Router } from 'express';
import { RegistrationController } from '../controllers/registration.controller';
import { authenticate } from '../middlewares';

const router = Router();
const controller = new RegistrationController();

router.post('/', authenticate, controller.create);
router.get('/mine', authenticate, controller.getMyRegistrations);
router.put('/:id/checkin', authenticate, controller.checkIn);
router.put('/qr/:qrCode/checkin', authenticate, controller.checkInByQr);

export default router;
