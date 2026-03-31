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
  CLIENT_URLS: z.string().optional(),
  // Optional for now: keep backend booting even when payment gateway is not configured.
  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(''),
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
  CHARITY_MIN_PERCENTAGE: Number(parsed.data.CHARITY_MIN_PERCENTAGE),
  ALLOWED_ORIGINS: [
    parsed.data.CLIENT_URL,
    ...(parsed.data.CLIENT_URLS
      ? parsed.data.CLIENT_URLS.split(',').map((origin) => origin.trim()).filter(Boolean)
      : []),
    'http://localhost:3000',
    'http://localhost:3001'
  ]
};
