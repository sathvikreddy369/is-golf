import { Router } from 'express';
import {
  createCharityController,
  deleteCharityController,
  listCharities,
  updateCharityController
} from '../controllers/charity.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { charityCreateSchema, charityUpdateSchema } from '../validators/charity.validator';

const router = Router();

router.get('/', listCharities);
router.post('/', protect, restrictTo('ADMIN'), validateRequest(charityCreateSchema), createCharityController);
router.put(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  validateRequest(charityUpdateSchema),
  updateCharityController
);
router.delete('/:id', protect, restrictTo('ADMIN'), deleteCharityController);

export default router;
