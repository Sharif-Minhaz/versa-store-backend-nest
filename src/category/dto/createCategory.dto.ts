import { z } from 'zod';

export const createCategoryDtoSchema = z.object({
  name: z.string(),
  imageKey: z.string().optional(),
});

export type CreateCategoryZodDto = z.infer<typeof createCategoryDtoSchema>;
