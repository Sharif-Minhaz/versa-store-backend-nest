import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
  loginFor: z.string({ required_error: 'Login for is required' }),
});

export type LoginUserZodDto = z.TypeOf<typeof loginUserSchema>;
