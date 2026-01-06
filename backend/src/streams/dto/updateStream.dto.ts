import { z } from 'zod';

export const updateStreamSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type UpdateStreamDto = z.infer<typeof updateStreamSchema>;
