import { z } from 'zod';

export const runDrawSchema = z.object({
  body: z.object({
    mode: z.enum(['RANDOM', 'WEIGHTED']),
    simulation: z.boolean().default(true)
  })
});
