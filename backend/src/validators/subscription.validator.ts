import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    planType: z.enum(['MONTHLY', 'YEARLY']),
    charityPercentage: z.number().min(0.1).max(0.9),
    simulateSuccess: z.boolean().default(true)
  })
});

export const webhookSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
    paymentId: z.string().min(1),
    signature: z.string().min(1),
    status: z.enum(['SUCCESS', 'FAILED'])
  })
});
