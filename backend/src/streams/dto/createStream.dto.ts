import { z } from 'zod';

export const createStreamSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
});

export type createStreamDto = z.infer<typeof createStreamSchema>;
