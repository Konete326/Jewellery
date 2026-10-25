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

export const sendInquiryReplyEmail = async ({ to, customerName, subject, message, originalMessage }) => {
  if (!to) {
    const error = new Error('Recipient email address is required');
    error.statusCode = 400;
    throw error;
  }

  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const transporter = createTransporter();

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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
            Atelier Consultation Response
          </span>
          <span style="font-size: 11px; color: #a8a29e;">${formattedDate}</span>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #1c1917; margin: 0 0 16px 0; font-weight: 500;">
          Dear ${customerName || 'Valued Client'},
        </p>

        <div style="font-size: 14px; line-height: 1.7; color: #292524; background-color: #fcfbf9; padding: 18px; border-radius: 8px; border: 1px solid #f0ede6; margin: 16px 0; white-space: pre-wrap;">${message}</div>

        ${
          originalMessage
            ? `<div style="border-left: 3px solid #d97706; padding: 10px 14px; margin-top: 20px; background-color: #fffbeb; border-radius: 0 6px 6px 0;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e;">Your Original Inquiry:</p>
                <p style="margin: 0; font-size: 13px; color: #78350f; font-style: italic;">"${originalMessage}"</p>
              </div>`
            : ''
        }

        <div style="border-top: 1px solid #f5f5f4; padding-top: 18px; margin-top: 22px;">
          <p style="font-size: 12px; line-height: 1.5; color: #78716c; margin: 0;">
            For urgent consultations or appointment bookings at our boutique, contact us directly at <a href="mailto:khalilandsonsjewellers@gmail.com" style="color: #b45309; text-decoration: none; font-weight: 500;">khalilandsonsjewellers@gmail.com</a> or call <a href="tel:+923142004245" style="color: #b45309; text-decoration: none; font-weight: 500;">+92 314 2004245</a>.
          </p>
        </div>
      </div>

      <div style="border-top: 1px solid #d6d3d1; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 11px; color: #a8a29e; letter-spacing: 0.1em; text-transform: uppercase;">
        Murshid Sunaar Tower, Saddar, Karachi • Certified 22K/24K Pure Gold
      </div>
    </div>
  `;

  const result = await transporter.sendMail({
    from,
    to,
    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
    text: message,
    html
  });

  return { delivered: true, messageId: result.messageId };
};
