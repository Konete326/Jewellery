import { z } from 'zod';
import { SUPPLIED_CATEGORIES } from './supplier.model.js';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid supplier identifier format');

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Supplier name must be at least 2 characters').max(150),
    contactPerson: z.string().trim().max(100).optional().default(''),
    phone: z.string().trim().min(7, 'Phone number must be at least 7 characters').max(25),
    whatsapp: z.string().trim().max(25).optional().default(''),
    city: z.string().trim().min(2).max(50).optional().default('Karachi'),
    address: z.string().trim().max(250).optional().default(''),
    suppliedCategories: z
      .array(z.enum(SUPPLIED_CATEGORIES))
      .min(1, 'At least one category is required')
      .optional()
      .default(['Gold']),
    notes: z.string().trim().max(1000).optional().default(''),
    status: z.enum(['active', 'archived']).optional().default('active')
  })
});

export const updateSupplierSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(150).optional(),
      contactPerson: z.string().trim().max(100).optional(),
      phone: z.string().trim().min(7).max(25).optional(),
      whatsapp: z.string().trim().max(25).optional(),
      city: z.string().trim().min(2).max(50).optional(),
      address: z.string().trim().max(250).optional(),
      suppliedCategories: z.array(z.enum(SUPPLIED_CATEGORIES)).min(1).optional(),
      notes: z.string().trim().max(1000).optional(),
      status: z.enum(['active', 'archived']).optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});

export const supplierIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const listSuppliersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.enum(['active', 'archived', 'all']).optional().default('active'),
    sortBy: z.enum(['createdAt', 'name', 'city']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  })
});
