import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (!user || !pass) {
    return {
      sendMail: async () => ({ messageId: 'dev-mode-simulated', simulated: true })
    };
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export const sendGoldDigestEmail = async ({ to, clientName, rates, websiteUrl }) => {
  if (!to) {
    const error = new Error('Recipient email is required');
    error.statusCode = 400;
    throw error;
  }

  const from = process.env.SMTP_FROM || 'Khalil & Sons Jewellers <khalilandsonsjewellers@gmail.com>';
  const targetUrl = websiteUrl || process.env.CLIENT_URL || 'https://khalilandsonsjewellers.com';
  const transporter = createTransporter();

  const gold = rates?.gold || {};
  const silver = rates?.silver || {};
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 16px;">
      <div style="text-align: center; border-bottom: 1px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 6px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>

      <div style="background-color: #ffffff; padding: 26px 24px; border-radius: 12px; border: 1px solid #e7e5e4;">
        <p style="font-size: 14px; color: #1c1917; font-weight: 500;">Dear ${clientName || 'Valued Collector'},</p>
        <p style="font-size: 13px; color: #57534e;">Karachi Sarafa Bullion Market rates for ${dateStr}:</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f5f5f4;">
            <td style="padding: 10px 0; font-weight: 600;">24K Pure Gold (Tola)</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700;">${formatPkr(gold['24K']?.tola)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f5f5f4;">
            <td style="padding: 10px 0; font-weight: 600;">22K Artisan Gold (Tola)</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700;">${formatPkr(gold['22K']?.tola)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f5f5f4;">
            <td style="padding: 10px 0; font-weight: 600;">21K Fine Jewellery (Tola)</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700;">${formatPkr(gold['21K']?.tola)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600;">Silver / Chandi (Tola)</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700;">${formatPkr(silver?.tola)}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${targetUrl}/rates" style="display: inline-block; padding: 12px 28px; background-color: #1c1917; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 12px; text-transform: uppercase;">View Live Bullion Board</a>
        </div>
      </div>
    </div>
  `;

  return await transporter.sendMail({
    from,
    to,
    subject: `Daily Bullion Rates: 24K Gold at ${formatPkr(gold['24K']?.tola)} / Tola`,
    html
  });
};
