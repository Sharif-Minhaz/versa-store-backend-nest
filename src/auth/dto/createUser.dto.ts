import { z } from 'zod';

export const createUserDtoSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Full Name is required' })
      .trim()
      .min(3, { message: 'Full Name should be between 3 and 31 characters' })
      .max(31, { message: 'Full Name should be between 3 and 31 characters' }),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(6, { message: 'Password should be at least 6 characters long' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?:=&-])[A-Za-z\d@$!%*#?:=&-]+$/,
        {
          message:
            'Password should be at least 6 characters long, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        },
      ),
    registerFor: z.string({ required_error: 'Register for is required' }),
    shopName: z.string().trim().optional(),
    shopLicenseNo: z.string().trim().optional(),
    shopType: z.string().trim().optional(),
    shopAddress: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.registerFor === 'vendor') {
      if (!data.shopName) {
        ctx.addIssue({
          path: ['shopName'],
          code: z.ZodIssueCode.custom,
          message: 'Shop name is required for vendors',
        });
      }
      if (!data.shopLicenseNo) {
        ctx.addIssue({
          path: ['shopLicenseNo'],
          code: z.ZodIssueCode.custom,
          message: 'Shop license number is required for vendors',
        });
      }
      if (!data.shopType) {
        ctx.addIssue({
          path: ['shopType'],
          code: z.ZodIssueCode.custom,
          message: 'Shop type is required for vendors',
        });
      }
      if (!data.shopAddress) {
        ctx.addIssue({
          path: ['shopAddress'],
          code: z.ZodIssueCode.custom,
          message: 'Shop address is required for vendors',
        });
      }
    }
  });

export type CreateUserZodDto = z.infer<typeof createUserDtoSchema>;
