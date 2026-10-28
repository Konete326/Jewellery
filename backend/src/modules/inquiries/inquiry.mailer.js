import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || 'khalilandsonsjewellers@gmail.com';
  const pass = process.env.SMTP_PASS || 'fogdwvnovnrtbolo';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

export const sendInquiryReceivedEmail = async ({ to, customerName, subject, inquiryId }) => {
  if (!to) return { delivered: false };
  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const transporter = createTransporter();
  const refCode = inquiryId ? `KS-${String(inquiryId).slice(-6).toUpperCase()}` : 'KS-INQUIRY';
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 14px;">
      <div style="text-align: center; border-bottom: 1px solid #d6d3d1; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 5px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>

      <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #e7e5e4; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
            Inquiry Registered • ${refCode}
          </span>
          <span style="font-size: 11px; color: #a8a29e; float: right;">${formattedDate}</span>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #1c1917; margin: 0 0 14px 0; font-weight: 500;">
          Dear ${customerName || 'Valued Patron'},
        </p>

        <p style="font-size: 13.5px; line-height: 1.7; color: #44403c; margin: 0 0 16px 0;">
          Thank you for contacting Khalil & Sons Jewellers. Your inquiry regarding <strong>"${subject || 'Bespoke Fine Jewellery'}"</strong> has been safely recorded.
        </p>

        <div style="background-color: #fcfbf9; padding: 16px; border-radius: 8px; border: 1px solid #f0ede6; margin: 16px 0;">
          <p style="margin: 0; font-size: 12.5px; line-height: 1.6; color: #57534e;">
            Our atelier concierge will review your requirements and respond directly to this email address within 24 business hours.
          </p>
        </div>

        <div style="border-top: 1px solid #f5f5f4; padding-top: 18px; margin-top: 22px;">
          <p style="font-size: 12px; line-height: 1.5; color: #78716c; margin: 0;">
            For urgent appointments or private consultations at our Saddar boutique, please contact us at <a href="mailto:khalilandsonsjewellers@gmail.com" style="color: #b45309; text-decoration: none; font-weight: 500;">khalilandsonsjewellers@gmail.com</a> or WhatsApp <a href="https://wa.me/923333213613" style="color: #b45309; text-decoration: none; font-weight: 500;">+92 333 3213613</a>.
          </p>
        </div>
      </div>

      <div style="border-top: 1px solid #d6d3d1; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 11px; color: #a8a29e; letter-spacing: 0.1em; text-transform: uppercase;">
        Murshid Sunaar Tower, Saddar, Karachi • Certified 22K/24K Pure Gold
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject: `Inquiry Confirmation [${refCode}] - Khalil & Sons Jewellers`,
      text: `Dear ${customerName || 'Valued Patron'},\n\nThank you for reaching out to Khalil & Sons Jewellers. We have received your inquiry (${refCode}) and our atelier concierge will reply shortly.\n\nWarm regards,\nKhalil & Sons Jewellers`,
      html
    });
    return { delivered: true, messageId: result.messageId };
  } catch (err) {
    return { delivered: false, error: err.message };
  }
};

