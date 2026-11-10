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
        size: z.string().optional(),
        netWeight: z.number().nonnegative().optional(),
        grossWeight: z.number().nonnegative().optional(),
        stoneWeight: z.number().nonnegative().optional(),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
        imageUrl: z.string().optional()
      })
    ).min(1),
    totalAmount: z.number().nonnegative(),
    advancePaid: z.number().nonnegative().optional(),
    customerNote: z.string().optional(),
    paymentMode: z.enum(['Bank Transfer', 'Showroom Payment']).optional(),
    initialPayment: z.object({
      bankAccountId: z.string().optional(),
      amount: z.number().nonnegative().optional(),
      paymentReference: z.string().optional(),
      paymentType: z.string().optional(),
      notes: z.string().optional()
    }).optional(),
    paymentDetails: z.object({
      method: z.string().optional(),
      transactionRef: z.string().optional(),
      bankName: z.string().optional()
    }).optional()
  })
});

export const updateOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(1).optional(),
      email: z.string().optional(),
      phone: z.string().min(5).optional(),
      shippingAddress: z.string().optional(),
      city: z.string().optional()
    }).optional(),
    fulfillmentType: z.enum(['Delivery', 'Showroom Pickup']).optional(),
    items: z.array(
      z.object({
        productId: z.string().optional(),
        title: z.string().optional(),
        category: z.string().optional(),
        purity: z.string().optional(),
        size: z.string().optional(),
        netWeight: z.number().nonnegative().optional(),
        grossWeight: z.number().nonnegative().optional(),
        stoneWeight: z.number().nonnegative().optional(),
        quantity: z.number().int().positive().optional(),
        price: z.number().nonnegative().optional(),
        imageUrl: z.string().optional()
      })
    ).optional(),
    totalAmount: z.number().nonnegative().optional(),
    advancePaid: z.number().nonnegative().optional(),
    balanceDue: z.number().nonnegative().optional(),
    orderStatus: z.enum(['Pending', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled']).optional(),
    paymentStatus: z.enum(['Unpaid', 'Partial', 'Paid', 'Refunded']).optional(),
    isAvailabilityVerified: z.boolean().optional(),
    goldRateLock: z.object({
      isLocked: z.boolean().optional(),
      lockedRate: z.number().optional(),
      karat: z.string().optional(),
      lockedAt: z.union([z.string(), z.date()]).optional()
    }).optional(),
    paymentDetails: z.object({
      method: z.string().optional(),
      transactionRef: z.string().optional(),
      bankName: z.string().optional()
    }).optional(),
    customerNote: z.string().optional(),
    internalNotes: z.string().optional(),
    collectionRecord: z.object({
      collectedAt: z.union([z.string(), z.date()]).optional(),
      collectedBy: z.string().optional(),
      verifiedBy: z.string().optional(),
      notes: z.string().optional()
    }).optional(),
    tracking: z.object({
      courier: z.string().optional(),
      trackingNumber: z.string().optional()
    }).optional()
  })
});
