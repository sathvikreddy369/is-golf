import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(80).optional(),
    charityId: z.string().cuid().optional(),
    emailNotifications: z.boolean().optional()
  })
});
