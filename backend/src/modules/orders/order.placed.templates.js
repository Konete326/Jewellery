function emailShell(title, badgeText, contentHtml) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px 20px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 1px solid #d6d3d1; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="font-size: 18px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL &amp; SONS</h1>
        <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 4px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e7e5e4;">
        <div style="display: inline-block; padding: 3px 8px; border-radius: 14px; background-color: #fef3c7; color: #92400e; font-size: 10px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px;">
          ${badgeText}
        </div>
        <h2 style="font-size: 16px; color: #1c1917; margin: 0 0 10px 0; font-weight: 600;">${title}</h2>
        ${contentHtml}
        <div style="border-top: 1px solid #f5f5f4; padding-top: 14px; margin-top: 18px;">
          <p style="font-size: 11px; line-height: 1.5; color: #78716c; margin: 0;">
            Showroom: Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Support: <a href="mailto:khalilandsonsjewellers@gmail.com" style="color: #b45309; text-decoration: none;">khalilandsonsjewellers@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderOrderPlacedCustomerHtml({ order, payment }) {
  const customerName = order.customer?.name || 'Valued Patron';
  const hasPayment = Boolean(payment && payment.amount > 0);
  const paymentDetails = hasPayment ? `
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin: 12px 0; font-size: 12.5px;">
      <p style="margin: 0 0 4px 0; font-weight: 600; color: #166534;">Submitted Bank Deposit (Awaiting Verification)</p>
      <p style="margin: 0; color: #15803d;">Amount: PKR ${Number(payment.amount).toLocaleString()} &nbsp;|&nbsp; Ref: ${payment.paymentReference || 'N/A'}</p>
    </div>` : `
    <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 12px; margin: 12px 0; font-size: 12.5px; color: #854d0e;">
      <strong>Showroom Settlement:</strong> Your pieces are reserved for direct payment and inspection at our Saddar showroom.
    </div>`;

  const rateLock = order.goldRateLock?.isLocked ? `
    <p style="font-size: 12px; color: #15803d; margin: 4px 0;"><strong>Gold Rate Locked:</strong> PKR ${Number(order.goldRateLock.lockedRate).toLocaleString()} / tola (${order.goldRateLock.karat})</p>` : '';

  const content = `
    <p style="font-size: 13.5px; line-height: 1.5; color: #44403c; margin: 0 0 12px 0;">
      Dear ${customerName}, your reservation for Order <strong>${order.orderNumber}</strong> has been received by our atelier.
    </p>
    <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 10px 0;">
      <tr><td style="padding: 4px 0; color: #78716c;">Order Valuation:</td><td style="padding: 4px 0; font-weight: 600;">PKR ${Number(order.totalAmount).toLocaleString()}</td></tr>
      <tr><td style="padding: 4px 0; color: #78716c;">Advance Deposit:</td><td style="padding: 4px 0; font-weight: 600;">PKR ${Number(order.advancePaid || payment?.amount || 0).toLocaleString()}</td></tr>
      <tr><td style="padding: 4px 0; color: #78716c;">Balance Due:</td><td style="padding: 4px 0; font-weight: 600;">PKR ${Number(order.balanceDue).toLocaleString()}</td></tr>
    </table>
    ${rateLock}
    ${paymentDetails}
    <p style="font-size: 12px; color: #57534e; margin: 10px 0 0 0;">
      Our concierge will verify your reservation and send an official confirmation once ready.
    </p>
  `;
  return emailShell('Order Received — Awaiting Verification', 'Reservation Logged', content);
}

export function renderOrderPlacedAdminHtml({ order, payment }) {
  const customer = order.customer || {};
  const hasPayment = Boolean(payment && payment.amount > 0);
  const itemsList = Array.isArray(order.items)
    ? order.items.map((i) => `<li>${i.title} (Qty: ${i.quantity}, Price: PKR ${Number(i.price).toLocaleString()})</li>`).join('')
    : '<li>Custom Jewellery</li>';

  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
      <h2 style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a;">New Order Placed [${order.orderNumber}]</h2>
      <p style="font-size: 13px; margin: 4px 0;"><strong>Customer:</strong> ${customer.name || 'Patron'} (${customer.phone || 'N/A'}, ${customer.email || 'N/A'})</p>
      <p style="font-size: 13px; margin: 4px 0;"><strong>Total Valuation:</strong> PKR ${Number(order.totalAmount).toLocaleString()}</p>
      <p style="font-size: 13px; margin: 4px 0;"><strong>Fulfillment:</strong> ${order.fulfillmentType || 'Showroom Pickup'}</p>
      ${hasPayment ? `<p style="font-size: 13px; margin: 4px 0; color: #15803d;"><strong>Bank Deposit Submitted:</strong> PKR ${Number(payment.amount).toLocaleString()} (Ref: ${payment.paymentReference || 'N/A'})</p>` : '<p style="font-size: 13px; margin: 4px 0; color: #854d0e;"><strong>Settlement:</strong> Direct Showroom Visit</p>'}
      <h4 style="font-size: 13px; margin: 12px 0 6px 0;">Items:</h4>
      <ul style="font-size: 12.5px; margin: 0; padding-left: 20px; color: #334155;">${itemsList}</ul>
    </div>
  `;
}