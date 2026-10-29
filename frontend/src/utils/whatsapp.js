import { STORE_INFO } from '@/constants/storeInfo';
import { getAuthUser } from '@/lib/auth';

export function getWhatsAppUrl(message = '', phone) {
  const targetPhone = phone || STORE_INFO?.whatsapp?.clean || STORE_INFO?.phone?.mobileRaw || '923333213613';
  const cleanPhone = String(targetPhone).replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message || 'Hello Khalil & Sons Jewellers, I would like to inquire about fine jewellery.');
  
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

export function openWhatsAppChat(message = '', phone) {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== 'undefined') {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  }
}

export function getPersonalizedWhatsAppInquiry({ piece, customMessage } = {}) {
  const user = getAuthUser();
  const userName = user?.name?.trim();
  const userEmail = user?.email?.trim();

  const greeting = userName
    ? `Hello Khalil & Sons, I am *${userName}*${userEmail ? ` (${userEmail})` : ''}.`
    : `Hello Khalil & Sons,`;

  if (piece) {
    const title = piece.title || 'Fine Jewellery Piece';
    const category = piece.category || 'Bridal Jewellery';
    const id = piece._id || piece.id || '';
    const refCode = id ? `KS-${String(id).slice(-6).toUpperCase()}` : 'KS-ATELIER';
    const productUrl = id
      ? `https://khalilandsonsjewellers.com/gallery/${id}`
      : 'https://khalilandsonsjewellers.com/gallery';
    const rawImg = piece.imageUrl || piece.src || '';
    const photoUrl = rawImg.startsWith('http')
      ? rawImg
      : `https://khalilandsonsjewellers.com${rawImg}`;

    const text = `${greeting}\n\nI would like to inquire about this jewellery piece:\n\n💎 *${title}*\n🏷️ Category: ${category}\n🔖 Ref Code: ${refCode}\n🔗 Product Link: ${productUrl}\n📷 Photo: ${photoUrl}\n\nPlease share price estimate, gold purity, and appointment availability at your Saddar boutique.`;
    return getWhatsAppUrl(text);
  }

  const baseText =
    customMessage ||
    'I would like to inquire about bespoke bridal jewellery, gold rates, and booking a private appointment at your Saddar boutique.';
  const text = `${greeting}\n\n${baseText}`;
  return getWhatsAppUrl(text);
}
