import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (!user || !pass) return { sendMail: async () => ({ messageId: 'simulated', simulated: true }) };
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
};

export const sendInquiryReceivedEmail = async (inquiry) => {
  const to = inquiry?.email || inquiry?.to;
  if (!to) return { delivered: false };
  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const transporter = createTransporter();
  const isApt = inquiry.requestType === 'Appointment' || Boolean(inquiry.appointmentDate);
  const refCode = inquiry._id || inquiry.id ? `KS-${String(inquiry._id || inquiry.id).slice(-6).toUpperCase()}` : 'KS-ATELIER';
  const subjectLine = isApt
    ? `Showroom Appointment Confirmed: ${inquiry.appointmentDate || 'Upcoming'} (${refCode})`
    : `Inquiry Received: ${inquiry.subject || 'Fine Jewellery'} (${refCode})`;

  const appointmentDetailsHtml = isApt ? `
    <div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:14px;margin:16px 0;">
      <p style="margin:0 0 6px 0;font-size:12px;font-weight:600;color:#854d0e;text-transform:uppercase;">Scheduled Showroom Visit</p>
      <p style="margin:0;font-size:13px;color:#1c1917;"><strong>Date:</strong> ${inquiry.appointmentDate} &nbsp;|&nbsp; <strong>Slot:</strong> ${inquiry.appointmentSlot || 'Consultation'}</p>
      <p style="margin:4px 0 0 0;font-size:12px;color:#713f12;"><strong>Mode:</strong> ${inquiry.consultationMode || 'In-Store Showroom'} &nbsp;|&nbsp; <strong>Location:</strong> Shop #2, Murshid Sunaar Tower, Saddar, Karachi</p>
    </div>` : '';

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#faf9f6;color:#1c1917;border:1px solid #e7e5e4;border-radius:12px;">
      <div style="text-align:center;border-bottom:1px solid #d6d3d1;padding-bottom:14px;margin-bottom:18px;">
        <h1 style="font-size:18px;letter-spacing:0.2em;text-transform:uppercase;margin:0;color:#78350f;">KHALIL &amp; SONS</h1>
        <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#78716c;margin:4px 0 0 0;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>
      <div style="background:#ffffff;padding:20px;border-radius:8px;border:1px solid #e7e5e4;">
        <span style="display:inline-block;padding:3px 8px;border-radius:12px;background:#fef3c7;color:#92400e;font-size:10px;font-weight:600;text-transform:uppercase;">${refCode}</span>
        <p style="font-size:14px;margin:12px 0 8px 0;font-weight:600;">Dear ${inquiry.customerName || 'Valued Patron'},</p>
        <p style="font-size:13px;line-height:1.6;color:#44403c;margin:0 0 12px 0;">Thank you for reaching out to Khalil &amp; Sons Jewellers. We have safely recorded your ${isApt ? 'appointment booking' : 'inquiry'}.</p>
        ${appointmentDetailsHtml}
        <p style="font-size:12.5px;line-height:1.6;color:#57534e;margin:12px 0 0 0;">Our master jewellery concierge will connect with you via WhatsApp or call to ensure a memorable bespoke experience.</p>
      </div>
    </div>`;

  try {
    const res = await transporter.sendMail({ from, to, subject: subjectLine, html });
    return { delivered: true, messageId: res.messageId };
  } catch { return { delivered: false }; }
};

export const sendAdminInquiryNotificationEmail = async (inquiry) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'khalilandsonsjewellers@gmail.com';
  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const transporter = createTransporter();
  const isApt = inquiry.requestType === 'Appointment' || Boolean(inquiry.appointmentDate);
  const refCode = inquiry._id || inquiry.id ? `KS-${String(inquiry._id || inquiry.id).slice(-6).toUpperCase()}` : 'KS-APT';
  const subject = isApt
    ? `New Showroom Appointment: ${inquiry.customerName} (${inquiry.appointmentDate} ${inquiry.appointmentSlot || ''})`
    : `New Client Inquiry: ${inquiry.customerName} - ${inquiry.subject || 'General'}`;

  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;">
      <h2 style="font-size:16px;color:#0f172a;margin:0 0 12px 0;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">${isApt ? 'Showroom Appointment Request' : 'New Atelier Inquiry'} [${refCode}]</h2>
      <p style="font-size:13px;margin:4px 0;"><strong>Client Name:</strong> ${inquiry.customerName}</p>
      <p style="font-size:13px;margin:4px 0;"><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
      <p style="font-size:13px;margin:4px 0;"><strong>Phone/WhatsApp:</strong> <a href="https://wa.me/${String(inquiry.phone || '').replace(/[^0-9]/g, '')}">${inquiry.phone || 'N/A'}</a></p>
      ${isApt ? `<p style="font-size:13px;margin:4px 0;color:#92400e;"><strong>Appointment:</strong> ${inquiry.appointmentDate} | Slot: ${inquiry.appointmentSlot} (${inquiry.consultationMode || 'In-Store'})</p>` : ''}
      ${inquiry.pieceTitle ? `<p style="font-size:13px;margin:4px 0;"><strong>Piece:</strong> ${inquiry.pieceTitle}</p>` : ''}
      <p style="font-size:13px;margin:4px 0;"><strong>Jewellery Type:</strong> ${inquiry.jewelryType || 'Bridal Sets'} | Metal: ${inquiry.preferredMetal || '22K Gold'}</p>
      <p style="font-size:13px;margin:4px 0;"><strong>Budget:</strong> ${inquiry.estimatedBudget || 'Consultation'}</p>
      <div style="margin-top:12px;padding:12px;background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;font-size:12.5px;color:#334155;white-space:pre-wrap;">${inquiry.message || 'No additional note.'}</div>
    </div>`;

  try {
    const res = await transporter.sendMail({ from, to: adminEmail, subject, html });
    return { delivered: true, messageId: res.messageId };
  } catch { return { delivered: false }; }
};
