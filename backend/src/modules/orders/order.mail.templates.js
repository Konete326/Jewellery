function emailShell(title, badgeText, contentHtml) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #faf9f6; color: #1c1917; border: 1px solid #e7e5e4; border-radius: 14px;">
      <div style="text-align: center; border-bottom: 1px solid #d6d3d1; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; color: #78350f;">KHALIL & SONS</h1>
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #78716c; margin-top: 5px;">Master Goldsmithing • Saddar, Karachi • Est. 1992</p>
      </div>
      <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #e7e5e4;">
        <div style="display: inline-block; padding: 4px 10px; border-radius: 20px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 14px;">
          ${badgeText}
        </div>
        <h2 style="font-size: 18px; color: #1c1917; margin: 0 0 12px 0; font-weight: 600;">${title}</h2>
        ${contentHtml}
        <div style="border-top: 1px solid #f5f5f4; padding-top: 18px; margin-top: 22px;">
          <p style="font-size: 11px; line-height: 1.5; color: #78716c; margin: 0;">
            Showroom: Saddar, Karachi. For assistance, contact us at <a href="mailto:khalilandsonsjewellers@gmail.com" style="color: #b45309; text-decoration: none;">khalilandsonsjewellers@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderPaymentApprovedHtml({ order, payment }) {
  const customerName = order.customer?.name || 'Valued Patron';
  const rateLockText = order.goldRateLock?.isLocked
    ? `<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin: 16px 0; font-size: 13px; color: #166534;">
        <strong>Gold Rate Locked:</strong> PKR ${Number(order.goldRateLock.lockedRate).toLocaleString()} per tola (${order.goldRateLock.karat}) frozen at order creation snapshot.
       </div>`
    : '';

  const content = `
    <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 16px 0;">
      Dear ${customerName}, your payment of <strong>PKR ${Number(payment.amount).toLocaleString()}</strong> for Order <strong>${order.orderNumber}</strong> has been approved.
    </p>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #78716c;">Receipt Number:</td><td style="padding: 6px 0; font-weight: 600;">${payment.receiptNumber || 'N/A'}</td></tr>
      <tr><td style="padding: 6px 0; color: #78716c;">Bank Account:</td><td style="padding: 6px 0; font-weight: 600;">${payment.bankAccountSnapshot?.bankName || 'Bank Transfer'}</td></tr>
      <tr><td style="padding: 6px 0; color: #78716c;">Advance Paid:</td><td style="padding: 6px 0; font-weight: 600;">PKR ${Number(order.advancePaid).toLocaleString()}</td></tr>
      <tr><td style="padding: 6px 0; color: #78716c;">Balance Due:</td><td style="padding: 6px 0; font-weight: 600;">PKR ${Number(order.balanceDue).toLocaleString()}</td></tr>
    </table>
    ${rateLockText}
    <div style="background-color: #fefce8; border-left: 3px solid #ca8a04; padding: 10px 14px; margin-top: 14px; font-size: 12px; color: #854d0e;">
      <strong>Showroom Collection:</strong> Bespoke jewellery orders are for showroom pickup only at our Saddar, Karachi outlet. No courier or delivery is offered.
    </div>
  `;
  return emailShell('Payment Approved & Confirmed', 'Payment Verified', content);
}

export function renderPaymentRejectedHtml({ order, payment }) {
  const customerName = order.customer?.name || 'Valued Patron';
  const content = `
    <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 16px 0;">
      Dear ${customerName}, we were unable to verify your submitted payment of <strong>PKR ${Number(payment.amount).toLocaleString()}</strong> for Order <strong>${order.orderNumber}</strong> against our bank records.
    </p>
    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; padding: 12px; border-radius: 8px; margin: 16px 0; font-size: 13px; color: #9f1239;">
      <strong>Notice:</strong> Your payment reference could not be matched with bank statements. Please verify transfer details and resubmit or visit our showroom.
    </div>
    <div style="background-color: #fefce8; border-left: 3px solid #ca8a04; padding: 10px 14px; font-size: 12px; color: #854d0e;">
      <strong>Assistance:</strong> For verification support, please visit our Saddar Karachi showroom or reply with proof of payment.
    </div>
  `;
  return emailShell('Payment Verification Update', 'Payment Unverified', content);
}

export function renderOrderStatusHtml({ order, status }) {
  const customerName = order.customer?.name || 'Valued Patron';
  let title = 'Order Update';
  let badge = 'Status Notification';
  let message = `Your order ${order.orderNumber} status is now ${status}.`;

  if (status === 'Confirmed') {
    title = 'Order Confirmed';
    badge = 'Order Confirmed';
    message = `Your bespoke jewellery order ${order.orderNumber} is confirmed and queued for crafting.`;
  } else if (status === 'Processing') {
    title = 'Jewellery Crafting in Progress';
    badge = 'Atelier Progress';
    message = `Master goldsmiths at our atelier have commenced the handcrafted preparation of your jewellery for Order ${order.orderNumber}.`;
  } else if (status === 'Ready') {
    title = 'Ready for Showroom Collection';
    badge = 'Ready for Collection';
    message = `Your fine jewellery for Order ${order.orderNumber} is complete and ready for pickup at our Saddar Karachi outlet.`;
  } else if (status === 'Delivered') {
    title = 'Order Collected';
    badge = 'Showroom Pickup Complete';
    message = `Thank you for visiting our Saddar Karachi showroom and collecting your jewellery for Order ${order.orderNumber}.`;
  } else if (status === 'Cancelled') {
    title = 'Order Cancelled';
    badge = 'Order Cancelled';
    message = `Your bespoke jewellery order ${order.orderNumber} has been cancelled. For inquiries or assistance, please contact our showroom.`;
  }

  const pickupNotice = `
    <div style="background-color: #fefce8; border-left: 3px solid #ca8a04; padding: 10px 14px; margin-top: 14px; font-size: 12px; color: #854d0e;">
      <strong>Showroom Collection:</strong> Bespoke jewellery must be personally collected from our Saddar Karachi outlet. No courier or delivery service is provided. Please bring your original CNIC and order reference.
    </div>
  `;

  const content = `
    <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 16px 0;">Dear ${customerName},</p>
    <p style="font-size: 14px; line-height: 1.6; color: #1c1917; margin: 0 0 16px 0;">${message}</p>
    ${pickupNotice}
  `;
  return emailShell(title, badge, content);
}
