import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});

export const winnerVerificationSchema = z.object({
  body: z.object({
    proofImage: z.string().url().optional(),
    verificationStatus: z.enum(['APPROVED', 'REJECTED']),
    payoutStatus: z.enum(['PENDING', 'PAID']).optional()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});
