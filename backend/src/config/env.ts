import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().default('5001'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CLIENT_URL: z.string().url(),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  DRAW_POOL_PERCENTAGE: z.string().default('0.5'),
  CHARITY_MIN_PERCENTAGE: z.string().default('0.1')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = {
  ...parsed.data,
  PORT: Number(parsed.data.PORT),
  DRAW_POOL_PERCENTAGE: Number(parsed.data.DRAW_POOL_PERCENTAGE),
  CHARITY_MIN_PERCENTAGE: Number(parsed.data.CHARITY_MIN_PERCENTAGE)
};
