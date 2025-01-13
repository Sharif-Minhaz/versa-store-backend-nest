import { z } from 'zod';

export const updateUserDtoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Full Name should be between 3 and 31 characters' })
    .max(31, { message: 'Full Name should be between 3 and 31 characters' })
    .optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' })
    .optional(),
  phone: z.string().trim().optional(),
  updateFor: z.string().optional(),
  shopName: z.string().trim().optional(),
  shopLicenseNo: z.string().trim().optional(),
  shopType: z.string().trim().optional(),
  shopAddress: z.string().trim().optional(),
});

export type UpdateUserZodDto = z.infer<typeof updateUserDtoSchema>;
