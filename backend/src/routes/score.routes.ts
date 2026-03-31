import { Router } from 'express';
import { createScore, listScores } from '../controllers/score.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createScoreSchema } from '../validators/score.validator';

const router = Router();

router.post('/', protect, validateRequest(createScoreSchema), createScore);
router.get('/', protect, listScores);

export default router;
