import { Inquiry } from './inquiry.model.js';

export class InquiryRepository {
  async findAll(filter = {}, pagination = { skip: 0, limit: 20 }) {
    const items = await Inquiry.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Inquiry.countDocuments(filter);
    return { items, total };
  }

  async findById(id) {
    return Inquiry.findById(id).lean();
  }

  async create(data) {
    const inquiry = new Inquiry(data);
    return inquiry.save();
  }

  async updateStatus(id, status) {
    return Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
}

export const inquiryRepository = new InquiryRepository();
