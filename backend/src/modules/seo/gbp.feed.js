import { Gallery } from '../gallery/gallery.model.js';
import { BASE_URL, escapeXml, optimizeCloudinaryUrl } from './seo.utils.js';

export async function generateLocalInventoryXml() {
  const items = await Gallery.find({ isActive: true })
    .select('_id updatedAt')
    .sort({ order: 1, updatedAt: -1 })
    .lean();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml('Khalil & Sons Jewellers - Saddar Local Inventory')}</title>\n`;
  xml += `    <link>${BASE_URL}</link>\n`;

  for (const item of items) {
    const sku = `KS-${item._id.toString().slice(-6).toUpperCase()}`;
    xml += '    <item>\n';
    xml += '      <g:store_code>SADDAR</g:store_code>\n';
    xml += `      <g:id>${sku}</g:id>\n`;
    xml += '      <g:price>0.00 PKR</g:price>\n';
    xml += '      <g:availability>in_stock</g:availability>\n';
    xml += '      <g:pickup_method>in_store</g:pickup_method>\n';
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';
  return xml;
}

export async function generateGoogleBusinessCsv() {
  const items = await Gallery.find({ isActive: true })
    .select('_id title description category imageUrl')
    .sort({ order: 1, updatedAt: -1 })
    .lean();

  const header = ['Product name', 'Product category', 'Price', 'Product description', 'Photo URL', 'Landing page URL'];
  const rows = [header.join(',')];

  for (const item of items) {
    const id = item._id.toString();
    const title = `"${(item.title || 'Fine Gold Jewellery').replace(/"/g, '""')}"`;
    const cat = `"${(item.category || 'Jewellery').replace(/"/g, '""')}"`;
    const price = '"0.00"';
    const desc = `"${(item.description || 'Mastercrafted gold jewellery by Khalil & Sons Jewellers, Saddar, Karachi.').replace(/"/g, '""')}"`;
    const rawImg = item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `${BASE_URL}${item.imageUrl}`;
    const imgUrl = `"${optimizeCloudinaryUrl(rawImg)}"`;
    const link = `"${BASE_URL}/gallery/${id}"`;

    rows.push([title, cat, price, desc, imgUrl, link].join(','));
  }

  return rows.join('\r\n');
}
