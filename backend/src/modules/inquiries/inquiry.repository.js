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

  async findConflictSlot(appointmentDate, appointmentSlot) {
    if (!appointmentDate || !appointmentSlot) return null;
    return Inquiry.findOne({
      requestType: 'Appointment',
      appointmentDate,
      appointmentSlot,
      status: { $nin: ['Cancelled', 'Closed'] }
    }).lean();
  }

  async findBookedSlotsByDate(appointmentDate) {
    if (!appointmentDate) return [];
    return Inquiry.find({
      requestType: 'Appointment',
      appointmentDate,
      status: { $nin: ['Cancelled', 'Closed'] }
    }).select('appointmentSlot status').lean();
  }

  async create(data) {
    const inquiry = new Inquiry(data);
    return inquiry.save();
  }

  async updateStatus(id, status) {
    return Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }

  async addReply(id, reply) {
    return Inquiry.findByIdAndUpdate(
      id,
      {
        $push: { replies: reply },
        $set: { status: 'Replied' }
      },
      { new: true }
    ).lean();
  }

  async deleteById(id) {
    return Inquiry.findByIdAndDelete(id).lean();
  }
}

export const inquiryRepository = new InquiryRepository();
