import { Router } from 'express';
import { getInquiries, createInquiry, updateInquiryStatus, replyInquiry, deleteInquiry, getBookedSlots } from './inquiry.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createInquirySchema, replyInquirySchema } from './inquiry.validation.js';
import { verifyAuth, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get('/booked-slots', getBookedSlots);
router.get('/', verifyAuth, requireAdmin, getInquiries);
router.post('/', validateRequest(createInquirySchema), createInquiry);
router.patch('/:id/status', verifyAuth, requireAdmin, updateInquiryStatus);
router.post('/:id/reply', verifyAuth, requireAdmin, validateRequest(replyInquirySchema), replyInquiry);
router.delete('/:id', verifyAuth, requireAdmin, deleteInquiry);

export default router;
