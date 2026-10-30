import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(1),
      email: z.string().optional(),
      phone: z.string().min(5),
      shippingAddress: z.string().optional(),
      city: z.string().optional()
    }),
    fulfillmentType: z.enum(['Delivery', 'Showroom Pickup']).optional(),
    items: z.array(
      z.object({
        productId: z.string().optional(),
        title: z.string(),
        category: z.string().optional(),
        purity: z.string().optional(),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
        imageUrl: z.string().optional()
      })
    ).min(1),
    totalAmount: z.number().nonnegative(),
    advancePaid: z.number().nonnegative().optional(),
    customerNote: z.string().optional(),
    paymentDetails: z.object({
      method: z.string().optional(),
      transactionRef: z.string().optional(),
      bankName: z.string().optional()
    }).optional()
  })
});
