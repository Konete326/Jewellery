import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150),
    slug: z.string().min(2).max(160),
    category: z.enum(['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Bespoke']),
    metal: z.enum(['24K Gold', '22K Gold', '18K White Gold', '18K Rose Gold', 'Platinum']),
    price: z.number().positive(),
    stock: z.number().int().nonnegative().default(1),
    isFeatured: z.boolean().optional().default(false),
    description: z.string().min(10),
    images: z.array(z.string().url()).optional().default([])
  })
});

export const queryProductSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    metal: z.string().optional(),
    limit: z.coerce.number().positive().max(100).optional().default(20),
    page: z.coerce.number().positive().optional().default(1)
  })
});
