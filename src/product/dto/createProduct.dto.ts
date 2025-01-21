import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  price: z
    .string({ required_error: 'Price is required' })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Price must be a positive number',
      },
    )
    .transform((val) => parseInt(val, 10)),
  description: z.string({ required_error: 'Description is required' }).trim(),
  category: z
    .string({ required_error: 'Category is required' })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Category id must be a number',
      },
    )
    .transform((val) => parseInt(val, 10)),
  discount: z
    .string({ required_error: 'Discount is required' })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      {
        message: 'Discount must be a number between 0 and 100',
      },
    )
    .transform((val) => parseInt(val, 10)),
  brand: z.string({ required_error: 'Brand is required' }).trim(),
  stock: z
    .string({ required_error: 'Stock is required' })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Stock must be a positive number',
      },
    )
    .transform((val) => parseInt(val, 10)),
  sold: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Sold must be a positive number',
      },
    )
    .transform((val) => parseInt(val, 10))
    .optional(),
  defaultType: z.string({ required_error: 'Default type is required' }).trim(),
  deliveryCharge: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Delivery charge must be a positive number',
      },
    )
    .transform((val) => parseInt(val, 10))
    .optional(),
  variant: z.string().optional(),
});

export type CreateProductZodDto = z.infer<typeof createProductSchema>;
