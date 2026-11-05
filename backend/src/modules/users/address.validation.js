import { z } from 'zod';

export function normalizePakistaniPhone(input) {
  if (typeof input !== 'string') return null;
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.startsWith('0092')) {
    const local = digitsOnly.slice(4);
    if (/^[2-9]\d{8,9}$/.test(local)) return `+92${local}`;
  } else if (digitsOnly.startsWith('92')) {
    const local = digitsOnly.slice(2);
    if (/^[2-9]\d{8,9}$/.test(local)) return `+92${local}`;
  } else if (digitsOnly.startsWith('0')) {
    const local = digitsOnly.slice(1);
    if (/^[2-9]\d{8,9}$/.test(local)) return `+92${local}`;
  } else if (/^[2-9]\d{8,9}$/.test(digitsOnly)) {
    return `+92${digitsOnly}`;
  }

  return null;
}

const pakistaniPhoneSchema = z
  .string()
  .min(7, 'Phone number is required')
  .max(25, 'Phone number is too long')
  .transform((val, ctx) => {
    const normalized = normalizePakistaniPhone(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide a valid Pakistani phone number (e.g. 03001234567 or +923001234567)'
      });
      return z.NEVER;
    }
    return normalized;
  });

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid address identifier format');

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().trim().max(50).optional().default('Home'),
    recipientName: z.string().trim().min(2, 'Recipient name must be at least 2 characters').max(100),
    phone: pakistaniPhoneSchema,
    addressLine: z.string().trim().min(3, 'Address line must be at least 3 characters').max(250),
    area: z.string().trim().max(100).optional().default(''),
    city: z.string().trim().max(50).optional().default('Karachi'),
    postalCode: z.string().trim().max(10).optional().default(''),
    isDefault: z.boolean().optional().default(false)
  })
});

export const updateAddressSchema = z.object({
  params: z.object({
    addressId: objectIdSchema
  }),
  body: z
    .object({
      label: z.string().trim().max(50).optional(),
      recipientName: z.string().trim().min(2, 'Recipient name must be at least 2 characters').max(100).optional(),
      phone: pakistaniPhoneSchema.optional(),
      addressLine: z.string().trim().min(3, 'Address line must be at least 3 characters').max(250).optional(),
      area: z.string().trim().max(100).optional(),
      city: z.string().trim().max(50).optional(),
      postalCode: z.string().trim().max(10).optional(),
      isDefault: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});

export const addressParamSchema = z.object({
  params: z.object({
    addressId: objectIdSchema
  })
});
