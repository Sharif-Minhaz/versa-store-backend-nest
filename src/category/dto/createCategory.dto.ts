import { z } from 'zod';

export const createCategoryDtoSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  imageKey: z.string().optional(),
});

export type CreateCategoryZodDto = z.infer<typeof createCategoryDtoSchema>;
