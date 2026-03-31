import { Router } from 'express';
import {
	getUserHistoryController,
	getUserProfile,
	getUserWinningsController,
	updateUserProfile
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateRequest(updateProfileSchema), updateUserProfile);
router.get('/history', protect, getUserHistoryController);
router.get('/winnings', protect, getUserWinningsController);

export default router;
