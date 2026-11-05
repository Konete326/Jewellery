import { loadFeedProducts } from './feedProducts.service.js';
import { BASE_URL, escapeXml, escapeCsv } from './seo.utils.js';

export async function generateLocalInventoryXml() {
  const items = await loadFeedProducts();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml('Khalil & Sons Jewellers - Saddar Local Inventory')}</title>\n`;
  xml += `    <link>${BASE_URL}</link>\n`;

  for (const item of items) {
    const sku = escapeXml(item.sku);
    xml += '    <item>\n';
    xml += '      <g:store_code>SADDAR</g:store_code>\n';
    xml += `      <g:id>${sku}</g:id>\n`;
    xml += `      <g:price>${item.priceString}</g:price>\n`;
    xml += `      <g:availability>${item.availability}</g:availability>\n`;
    xml += '      <g:pickup_method>in_store</g:pickup_method>\n';
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';
  return xml;
}

export async function generateGoogleBusinessCsv() {
  const items = await loadFeedProducts();

  const header = ['Product name', 'Product category', 'Price', 'Product description', 'Photo URL', 'Landing page URL'];
  const rows = [header.join(',')];

  for (const item of items) {
    const title = escapeCsv(item.title);
    const cat = escapeCsv(item.category);
    const price = escapeCsv(item.formattedDecimal);
    const desc = escapeCsv(item.description);
    const imgUrl = escapeCsv(item.imageUrl);
    const link = escapeCsv(item.link);

    rows.push([title, cat, price, desc, imgUrl, link].join(','));
  }

  return rows.join('\r\n');
}
