import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7),
      shippingAddress: z.string().min(10)
    }),
    items: z.array(
      z.object({
        productId: z.string(),
        title: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive()
      })
    ).min(1),
    totalAmount: z.number().positive()
  })
});
