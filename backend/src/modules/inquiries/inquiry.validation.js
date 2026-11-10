import { z } from 'zod';

export const createInquirySchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().max(30).optional().default(''),
    subject: z.string().max(150).optional().default('Atelier Inquiry'),
    jewelryType: z.string().optional().default('Other'),
    preferredMetal: z.string().optional().default('22K Gold'),
    estimatedBudget: z.string().optional().default('Consultation'),
    message: z.string().min(5).max(3000),
    requestType: z.enum(['Inquiry', 'Appointment']).optional().default('Inquiry'),
    appointmentDate: z.string().optional().default(''),
    appointmentSlot: z.string().optional().default(''),
    consultationMode: z.enum(['In-Store Showroom', 'WhatsApp Video Call']).optional().default('In-Store Showroom'),
    pieceId: z.string().optional().default(''),
    pieceTitle: z.string().optional().default('')
  })
});

export const replyInquirySchema = z.object({
  body: z.object({
    subject: z.string().min(2).max(200),
    message: z.string().min(5).max(5000),
    sentBy: z.string().max(100).optional().default('Atelier Director')
  })
});
