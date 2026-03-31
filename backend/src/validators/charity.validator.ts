import { z } from 'zod';

export const charityCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    category: z.string().min(2).max(60).optional(),
    description: z.string().min(10),
    image: z.string().url(),
    website: z.string().url(),
    featured: z.boolean().default(false),
    location: z.string().min(2).max(120).optional(),
    upcomingEventTitle: z.string().min(2).max(120).optional(),
    upcomingEventDate: z.coerce.date().optional(),
    impactMetric: z.string().min(2).max(120).optional(),
    active: z.boolean().default(true)
  })
});

export const charityUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    category: z.string().min(2).max(60).optional(),
    description: z.string().min(10).optional(),
    image: z.string().url().optional(),
    website: z.string().url().optional(),
    featured: z.boolean().optional(),
    location: z.string().min(2).max(120).optional(),
    upcomingEventTitle: z.string().min(2).max(120).optional(),
    upcomingEventDate: z.coerce.date().optional(),
    impactMetric: z.string().min(2).max(120).optional(),
    active: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().cuid()
  })
});
