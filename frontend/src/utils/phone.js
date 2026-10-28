export function normalizePhoneToE164(phone, defaultCountryCode = '92') {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  if (cleaned.startsWith('00')) {
    return `+${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith('0')) {
    return `+${defaultCountryCode}${cleaned.slice(1)}`;
  }

  if (cleaned.startsWith(defaultCountryCode)) {
    return `+${cleaned}`;
  }

  return `+${cleaned}`;
}

export function formatE164ForWhatsApp(phone) {
  if (!phone) return '';
  const e164 = normalizePhoneToE164(phone);
  return e164.replace(/[^0-9]/g, '');
}

export function createWhatsAppInquiryUrl(phone, customerName = '', context = '', status = '') {
  const digits = formatE164ForWhatsApp(phone);
  if (!digits) return '';

  const normalizedStatus = String(status || '').trim().toLowerCase();
  const isCompletedOrDelivered =
    normalizedStatus === 'completed' ||
    normalizedStatus === 'delivered' ||
    normalizedStatus === 'resolved';

  const greeting = customerName ? `Hello ${customerName}, ` : 'Hello, ';

  let message = '';
  if (isCompletedOrDelivered) {
    const topic = context ? ` regarding your completed bespoke piece: "${context}"` : '';
    message = `${greeting}thank you for choosing Khalil & Sons Jewellers, Saddar, Karachi${topic}. We hope you cherished our artisanal craftsmanship. If you appreciated our creations, please consider sharing your valuable 5-star review on Google:\nhttps://maps.app.goo.gl/49w2MCbeJfqTc8hT7\n\nThank you for trusting Khalil & Sons!`;
  } else {
    const topic = context ? ` regarding your inquiry: "${context}"` : '';
    message = `${greeting}we are contacting you from Khalil & Sons Jewellers Saddar Karachi${topic}. How may we assist you with our bespoke creations today?`;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const e164 = normalizePhoneToE164(phone);
  if (e164.startsWith('+92') && e164.length === 13) {
    return `+92 ${e164.slice(3, 6)} ${e164.slice(6)}`;
  }
  return e164 || phone;
}
