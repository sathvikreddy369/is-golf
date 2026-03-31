import { Router } from 'express';
import {
  listUsersController,
  reportsController,
  updateUserStatusController,
  verifyWinnerController
} from '../controllers/admin.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateUserStatusSchema, winnerVerificationSchema } from '../validators/admin.validator';

const router = Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/users', listUsersController);
router.patch('/users/:id/status', validateRequest(updateUserStatusSchema), updateUserStatusController);
router.patch('/winners/:id/verify', validateRequest(winnerVerificationSchema), verifyWinnerController);
router.get('/reports', reportsController);

export default router;
