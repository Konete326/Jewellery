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
