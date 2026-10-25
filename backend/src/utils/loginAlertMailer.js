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

export const sendLoginAlertEmail = async ({ to, userName, role, ip = 'Unknown' }) => {
  if (!to) return { delivered: false };
  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const transporter = createTransporter();

  const timeFormatted = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const accessLabel = role === 'admin' ? 'Atelier Director / Admin Access' : 'Boutique Client Account';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 14px;">
      <div style="text-align: center; border-bottom: 1px solid #d6d3d1; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 5px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>

      <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #e7e5e4; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px;">
          Security Notification
        </div>

        <h2 style="font-size: 18px; color: #1c1917; margin: 0 0 12px 0; font-weight: 600;">
          Successful Account Sign-In
        </h2>

        <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 18px 0;">
          Hello ${userName || 'Valued Collector'}, your Khalil & Sons Jewellers account was successfully signed into.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 18px 0;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; width: 120px;">Account:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 600;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c;">Date & Time:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${timeFormatted} (PKT)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c;">Access Type:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${accessLabel}</td>
          </tr>
          ${ip !== 'Unknown' ? `<tr><td style="padding: 8px 0; color: #78716c;">IP Address:</td><td style="padding: 8px 0; color: #1c1917; font-family: monospace;">${ip}</td></tr>` : ''}
        </table>

        <div style="border-top: 1px solid #f5f5f4; padding-top: 16px; margin-top: 14px;">
          <p style="font-size: 12px; line-height: 1.5; color: #78716c; margin: 0;">
            If you signed into your account, no further action is required. If you did not initiate this sign-in, please reach out to our Karachi boutique immediately at <a href="mailto:info@khalilandsonsjewellers.com" style="color: #b45309; text-decoration: none;">info@khalilandsonsjewellers.com</a> or phone <a href="tel:+923142004245" style="color: #b45309; text-decoration: none;">+92 314 2004245</a>.
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
      subject: `Security Alert: Successful Sign-In to Your Khalil & Sons Account`,
      text: `Hello ${userName || 'Valued Collector'}, your Khalil & Sons account (${to}) was signed into on ${timeFormatted} PKT. If this was not you, please contact us immediately.`,
      html
    });
    return { delivered: true, messageId: result.messageId };
  } catch (err) {
    return { delivered: false, error: err.message };
  }
};
