import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
