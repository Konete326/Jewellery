import { inquiryRepository } from './inquiry.repository.js';
import { sendInquiryReplyEmail } from '../../utils/mailer.js';
import { sendInquiryReceivedEmail } from './inquiry.mailer.js';
import { normalizePhoneToE164 } from '../../utils/phone.js';

export class InquiryService {
  constructor(repo = inquiryRepository) {
    this.repo = repo;
  }

  async listInquiries(pagination = { page: 1, limit: 50 }) {
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 50);
    const skip = (page - 1) * limit;

    const { items, total } = await this.repo.findAll({}, { skip, limit });
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  async submitInquiry(data) {
    const payload = { ...data };
    if (payload.phone) {
      payload.phone = normalizePhoneToE164(payload.phone);
    }
    const created = await this.repo.create(payload);
    if (created?.email) {
      sendInquiryReceivedEmail({
        to: created.email,
        customerName: created.customerName,
        subject: created.subject || created.jewelryType,
        inquiryId: created._id
      }).catch(() => {});
    }
    return created;
  }

  async updateInquiryStatus(id, status) {
    return this.repo.updateStatus(id, status);
  }

  async replyToInquiry(id, { subject, message, sentBy = 'Atelier Concierge' }) {
    const inquiry = await this.repo.findById(id);
    if (!inquiry) {
      const err = new Error('Inquiry not found');
      err.statusCode = 404;
      throw err;
    }

    let emailResult = null;
    try {
      emailResult = await sendInquiryReplyEmail({
        to: inquiry.email,
        customerName: inquiry.customerName,
        subject,
        message,
        originalMessage: inquiry.message
      });
    } catch (e) {
      emailResult = { error: e.message, sent: false };
    }

    const replyRecord = {
      subject,
      message,
      sentAt: new Date(),
      sentBy
    };

    const updated = await this.repo.addReply(id, replyRecord);
    return { inquiry: updated, emailResult };
  }

  async deleteInquiry(id) {
    return this.repo.deleteById(id);
  }
}

export const inquiryService = new InquiryService();
