import { Router } from 'express';
import {
  cancelSubscriptionController,
  createSubscriptionController,
  getSubscriptionStatusController,
  webhookSimulationController
} from '../controllers/subscription.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createSubscriptionSchema, webhookSchema } from '../validators/subscription.validator';

const router = Router();

router.post('/create', protect, validateRequest(createSubscriptionSchema), createSubscriptionController);
router.get('/status', protect, getSubscriptionStatusController);
router.patch('/cancel', protect, cancelSubscriptionController);
router.post('/webhook/simulate', validateRequest(webhookSchema), webhookSimulationController);

export default router;
