import { STORE_INFO } from '@/constants/storeInfo';
import { getAuthUser } from '@/lib/auth';

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
    return STORE_INFO.whatsapp.inquiryUrl(text);
  }

  const baseText =
    customMessage ||
    'I would like to inquire about bespoke bridal jewellery, gold rates, and booking a private appointment at your Saddar boutique.';
  const text = `${greeting}\n\n${baseText}`;
  return STORE_INFO.whatsapp.inquiryUrl(text);
}
