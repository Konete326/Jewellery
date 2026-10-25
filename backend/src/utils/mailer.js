import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

export const sendInquiryReplyEmail = async ({ to, customerName, subject, message, originalMessage }) => {
  const from = process.env.SMTP_FROM || 'Khalil & Sons <concierge@khalilsons.com>';
  const transporter = createTransporter();

  const html = `
    <div style="font-family: 'Newsreader', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 1px solid #d6d3d1; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a8a29e; margin-top: 4px;">Haute Joaillerie Atelier • Florence</p>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Dear ${customerName || 'Valued Client'},</p>
      <div style="font-size: 15px; line-height: 1.7; color: #292524; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e7e5e4; margin: 20px 0; white-space: pre-wrap;">
${message}
      </div>
      ${
        originalMessage
          ? `<div style="border-left: 2px solid #d97706; padding-left: 14px; margin-top: 24px; color: #78716c; font-size: 13px;">
              <p style="margin: 0 0 6px 0; font-weight: 600;">Your Original Inquiry:</p>
              <p style="margin: 0; font-style: italic;">"${originalMessage}"</p>
            </div>`
          : ''
      }
      <div style="border-top: 1px solid #d6d3d1; margin-top: 32px; padding-top: 18px; text-align: center; font-size: 11px; color: #a8a29e; letter-spacing: 0.1em; text-transform: uppercase;">
        Via de' Tornabuoni, Florence • Private Commission Atelier
      </div>
    </div>
  `;

  if (!transporter) {
    return { delivered: false, simulated: true };
  }

  const result = await transporter.sendMail({
    from,
    to,
    subject: `Re: ${subject}`,
    text: message,
    html
  });

  return { delivered: true, messageId: result.messageId };
};
