import { Router } from 'express';
import { getInquiries, createInquiry, updateInquiryStatus, replyInquiry, deleteInquiry } from './inquiry.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createInquirySchema, replyInquirySchema } from './inquiry.validation.js';

const router = Router();

router.get('/', getInquiries);
router.post('/', validateRequest(createInquirySchema), createInquiry);
router.patch('/:id/status', updateInquiryStatus);
router.post('/:id/reply', validateRequest(replyInquirySchema), replyInquiry);
router.delete('/:id', deleteInquiry);

export default router;

