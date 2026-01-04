import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
});

export type createCatergoryDto = z.infer<typeof createCategorySchema>;
