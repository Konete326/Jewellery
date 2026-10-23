import { z } from 'zod';

export const createInquirySchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(20),
    jewelryType: z.enum(['Bridal Set', 'Custom Ring', 'Diamond Necklace', 'Bespoke Bracelet', 'Other']),
    preferredMetal: z.enum(['24K Yellow Gold', '22K Gold', '18K White Gold', '18K Rose Gold', 'Platinum']),
    estimatedBudget: z.string().min(2).max(50),
    message: z.string().min(10).max(1000)
  })
});
