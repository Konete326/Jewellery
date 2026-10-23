import { Router } from 'express';
import { getInquiries, createInquiry } from './inquiry.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createInquirySchema } from './inquiry.validation.js';

const router = Router();

router.get('/', getInquiries);
router.post('/', validateRequest(createInquirySchema), createInquiry);

export default router;
