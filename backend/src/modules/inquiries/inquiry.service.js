import { inquiryRepository } from './inquiry.repository.js';

export class InquiryService {
  constructor(repo = inquiryRepository) {
    this.repo = repo;
  }

  async listInquiries(pagination = { page: 1, limit: 20 }) {
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 20);
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
    return this.repo.create(data);
  }
}

export const inquiryService = new InquiryService();
