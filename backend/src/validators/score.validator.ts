import { z } from 'zod';

export const createScoreSchema = z.object({
  body: z.object({
    value: z.number().int().min(1).max(45),
    date: z.string().datetime()
  })
});
