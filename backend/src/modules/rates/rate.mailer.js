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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 16px;">
      <div style="text-align: center; border-bottom: 1px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 6px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>

      <div style="background-color: #ffffff; padding: 26px 24px; border-radius: 12px; border: 1px solid #e7e5e4; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
            Monthly Gold Appraisal
          </span>
          <span style="font-size: 11px; color: #a8a29e;">${dateStr}</span>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #1c1917; margin: 0 0 12px 0;">
          Dear ${clientName || 'Valued Client'},
        </p>

        <p style="font-size: 13px; line-height: 1.6; color: #57534e; margin: 0 0 20px 0;">
          Here is your monthly bullion appraisal from Murshid Sunaar Tower, Saddar. Whether you are planning bespoke bridal heirlooms or reviewing gold assets, our hallmark standards guarantee lifelong purity.
        </p>

        <div style="background-color: #fcfbf9; border: 1px solid #f0ede6; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <div style="border-bottom: 1px solid #ece8e1; padding-bottom: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 12px; color: #78716c; text-transform: uppercase; letter-spacing: 0.05em;">24K Pure Gold (1 Tola)</span>
            <span style="font-size: 18px; font-weight: 700; color: #1c1917;">${formatPkr(gold['24K']?.tola)}</span>
          </div>

          <div style="border-bottom: 1px solid #ece8e1; padding-bottom: 8px; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #78716c;">22K Bridal Gold (1 Tola)</span>
            <span style="font-size: 14px; font-weight: 600; color: #292524;">${formatPkr(gold['22K']?.tola)}</span>
          </div>

          <div style="border-bottom: 1px solid #ece8e1; padding-bottom: 8px; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #78716c;">21K Heritage Gold (1 Tola)</span>
            <span style="font-size: 14px; font-weight: 600; color: #292524;">${formatPkr(gold['21K']?.tola)}</span>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #78716c;">24K Pure Silver (1 Tola)</span>
            <span style="font-size: 14px; font-weight: 600; color: #292524;">${formatPkr(silver['24K']?.tola)}</span>
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0 16px 0;">
          <a href="${targetUrl}/rates" style="display: inline-block; background-color: #1c1917; color: #ffffff; padding: 12px 26px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">
            View Live Rates & Calculator &rarr;
          </a>
        </div>

        <p style="font-size: 12px; text-align: center; margin: 0; color: #78716c;">
          Explore custom bridal creations: <a href="${targetUrl}/gallery" style="color: #b45309; text-decoration: underline;">Browse Atelier Gallery</a>
        </p>
      </div>

      <div style="border-top: 1px solid #e7e5e4; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #a8a29e; letter-spacing: 0.05em;">
        Murshid Sunaar Tower, Saddar, Karachi • Tel: +92 314 2004245 • Certified Hallmarks
      </div>
    </div>
  `;

  const result = await transporter.sendMail({
    from,
    to,
    subject: `Today's Gold & Bullion Market Valuation | Khalil & Sons Jewellers`,
    text: `Today's 24K Gold Rate: ${formatPkr(gold['24K']?.tola)} / Tola. 22K Bridal Gold: ${formatPkr(gold['22K']?.tola)}. Visit ${targetUrl}/rates for live details.`,
    html
  });

  return { delivered: true, messageId: result.messageId };
};
