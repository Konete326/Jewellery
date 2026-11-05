import mongoose from 'mongoose';
import { Gallery } from '../gallery/gallery.model.js';
import { Product } from '../products/product.model.js';
import { rateService } from '../rates/rate.service.js';
import { calculateProductPricing } from '../products/product.pricing.js';
import { BASE_URL } from './seo.utils.js';
import { escapeHtml, resolveAbsoluteImageUrl } from './galleryPreview.utils.js';
import { buildProductJsonLd } from './productSchema.js';

export async function resolvePublicRecord(id) {
  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) return null;

  const galleryItem = await Gallery.findOne({ _id: id, isActive: true }).lean();
  if (galleryItem) {
    return {
      recordType: 'gallery',
      id: String(galleryItem._id),
      title: galleryItem.title || 'Haute Joaillerie Masterpiece',
      description: galleryItem.description || '',
      category: galleryItem.category || 'Bridal Sets',
      image: galleryItem.imageUrl || '/og-image.jpg',
      purity: '22K',
      price: null,
      rating: Number(galleryItem.averageRating) || 0,
      reviewCount: Number(galleryItem.reviewCount) || (Array.isArray(galleryItem.reviews) ? galleryItem.reviews.length : 0),
      availability: galleryItem.availability || null,
      stock: (galleryItem.stock !== undefined && galleryItem.stock !== null) ? galleryItem.stock : null
    };
  }

  const product = await Product.findOne({ _id: id, isPublished: true }).lean();
  if (!product) return null;

  let price = null;
  try {
    const rates = await rateService.getCurrentRates().catch(() => null);
    const priced = calculateProductPricing(product, rates);
    if (priced?.calculatedPrice > 0) {
      price = priced.calculatedPrice;
    } else if (Number(product.price) > 0) {
      price = Number(product.price);
    }
  } catch {
    if (Number(product.price) > 0) price = Number(product.price);
  }

  const rawImage = (Array.isArray(product.images) && product.images[0]) || product.imageUrl || '/og-image.jpg';

  return {
    recordType: 'product',
    id: String(product._id),
    title: product.title || 'Fine Gold Jewellery',
    description: product.description || '',
    category: product.category || 'Fine Jewellery',
    image: rawImage,
    purity: product.purity || '22K',
    price,
    availability: product.availability || null,
    stock: (product.stock !== undefined && product.stock !== null) ? product.stock : null,
    rating: Number(product.averageRating) || 0,
    reviewCount: Number(product.reviewCount) || (Array.isArray(product.reviews) ? product.reviews.length : 0)
  };
}

export async function getPreviewMetadata(id) {
  const record = await resolvePublicRecord(id);
  if (!record) return null;

  const canonicalUrl = `${BASE_URL}/gallery/${record.id}`;
  const escapedCanonicalUrl = escapeHtml(canonicalUrl);
  const escapedTitle = escapeHtml(record.title);
  const escapedFullTitle = escapeHtml(`${record.title} | Khalil & Sons Jewellers`);

  let desc = record.description.trim();
  if (!desc) {
    desc = `Discover ${record.title} - handcrafted certified ${record.purity} gold jewellery by Khalil & Sons Jewellers, Murshid Sunaar Tower, Saddar, Karachi.`;
  }
  if (typeof record.price === 'number' && record.price > 0) {
    const formattedPrice = 'PKR ' + Math.round(record.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    desc = `${desc} | Price: ${formattedPrice}`;
  }

  const rawImageUrl = resolveAbsoluteImageUrl(record.image);
  const escapedImageUrl = escapeHtml(rawImageUrl);
  const jsonLd = buildProductJsonLd(record, canonicalUrl, rawImageUrl);

  return {
    id: record.id,
    title: record.title,
    escapedTitle,
    escapedFullTitle,
    escapedDescription: escapeHtml(desc),
    canonicalUrl,
    escapedCanonicalUrl,
    imageUrl: rawImageUrl,
    escapedImageUrl,
    ogType: record.price !== null ? 'product' : 'article',
    price: record.price,
    jsonLd
  };
}
