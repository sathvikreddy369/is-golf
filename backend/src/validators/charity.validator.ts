import { z } from 'zod';

export const charityCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10),
    image: z.string().url(),
    website: z.string().url(),
    active: z.boolean().default(true)
  })
});

export const charityUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).optional(),
    image: z.string().url().optional(),
    website: z.string().url().optional(),
    active: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});
