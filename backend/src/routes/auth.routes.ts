import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);

export default router;
