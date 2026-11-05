import { loadFeedProducts } from './feedProducts.service.js';
import { BASE_URL, escapeXml } from './seo.utils.js';

export async function generateGoogleMerchantXml() {
  const items = await loadFeedProducts();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml('Khalil & Sons Jewellers - Product Feed')}</title>\n`;
  xml += `    <link>${BASE_URL}</link>\n`;
  xml += `    <description>${escapeXml('Certified 22K/24K gold bespoke bridal jewellery and heirlooms handcrafted in Karachi since 1992.')}</description>\n`;

  for (const item of items) {
    const sku = escapeXml(item.sku);
    const title = escapeXml(item.title);
    const desc = escapeXml(item.description);
    const link = escapeXml(item.link);
    const imgUrl = escapeXml(item.imageUrl);
    const cat = escapeXml(item.category);

    xml += '    <item>\n';
    xml += `      <g:id>${sku}</g:id>\n`;
    xml += `      <g:title>${title}</g:title>\n`;
    xml += `      <g:description>${desc}</g:description>\n`;
    xml += `      <g:link>${link}</g:link>\n`;
    xml += `      <g:mobile_link>${link}</g:mobile_link>\n`;
    xml += `      <g:image_link>${imgUrl}</g:image_link>\n`;
    xml += '      <g:condition>new</g:condition>\n';
    xml += `      <g:availability>${item.availability}</g:availability>\n`;
    xml += `      <g:price>${item.priceString}</g:price>\n`;
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
