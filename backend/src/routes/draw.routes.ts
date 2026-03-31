import { Router } from 'express';
import { latestDrawController, runDrawController } from '../controllers/draw.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { runDrawSchema } from '../validators/draw.validator';

const router = Router();

router.post('/run', protect, restrictTo('ADMIN'), validateRequest(runDrawSchema), runDrawController);
router.get('/latest', latestDrawController);

export default router;
