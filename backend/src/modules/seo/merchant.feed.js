import { Gallery } from '../gallery/gallery.model.js';
import { BASE_URL, escapeXml, optimizeCloudinaryUrl } from './seo.utils.js';

export async function generateGoogleMerchantXml() {
  const items = await Gallery.find({ isActive: true })
    .select('_id title description category imageUrl updatedAt')
    .sort({ order: 1, updatedAt: -1 })
    .lean();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml('Khalil & Sons Jewellers - Product Feed')}</title>\n`;
  xml += `    <link>${BASE_URL}</link>\n`;
  xml += `    <description>${escapeXml('Certified 22K/24K gold bespoke bridal jewellery and heirlooms handcrafted in Karachi since 1992.')}</description>\n`;

  for (const item of items) {
    const id = item._id.toString();
    const sku = `KS-${id.slice(-6).toUpperCase()}`;
    const title = escapeXml(item.title || 'Fine Gold Jewellery');
    const desc = escapeXml(
      item.description ||
        `Handcrafted bespoke ${item.category || 'jewellery'} piece by Khalil & Sons Jewellers, Karachi.`
    );
    const link = `${BASE_URL}/gallery/${id}`;
    const rawImg = item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `${BASE_URL}${item.imageUrl}`;
    const imgUrl = escapeXml(optimizeCloudinaryUrl(rawImg));
    const cat = escapeXml(item.category || 'Bridal Sets');

    xml += '    <item>\n';
    xml += `      <g:id>${sku}</g:id>\n`;
    xml += `      <g:title>${title}</g:title>\n`;
    xml += `      <g:description>${desc}</g:description>\n`;
    xml += `      <g:link>${link}</g:link>\n`;
    xml += `      <g:mobile_link>${link}</g:mobile_link>\n`;
    xml += `      <g:image_link>${imgUrl}</g:image_link>\n`;
    xml += '      <g:condition>new</g:condition>\n';
    xml += '      <g:availability>in_stock</g:availability>\n';
    xml += '      <g:price>0.00 PKR</g:price>\n';
    xml += `      <g:brand>${escapeXml('Khalil & Sons Jewellers')}</g:brand>\n`;
    xml += '      <g:google_product_category>188</g:google_product_category>\n';
    xml += `      <g:product_type>${escapeXml(`Apparel & Accessories > Jewelry > ${cat}`)}</g:product_type>\n`;
    xml += '      <g:pickup_method>in_store</g:pickup_method>\n';
    xml += '      <g:pickup_sla>same_day</g:pickup_sla>\n';
    xml += '      <g:identifier_exists>no</g:identifier_exists>\n';
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';
  return xml;
}
