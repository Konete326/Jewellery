import { BASE_URL } from './seo.utils.js';

export function serializeJsonLd(data) {
  if (!data) return '';
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function resolveSchemaAvailability(record) {
  const status = String(record?.availability || '').trim().toLowerCase();
  const rawStock = record?.stock ?? record?.stockQuantity ?? record?.inventoryQuantity;
  const numStock = (rawStock !== undefined && rawStock !== null && rawStock !== '') ? Number(rawStock) : null;
  const hasValidStock = typeof numStock === 'number' && Number.isFinite(numStock);

  if (status === 'out of stock' || (hasValidStock && numStock <= 0)) {
    return 'https://schema.org/OutOfStock';
  }
  if (status === 'made to order') {
    return 'https://schema.org/BackOrder';
  }
  if ((hasValidStock && numStock > 0) || status === 'in stock') {
    return 'https://schema.org/InStock';
  }
  return null;
}

export function getNextDayIsoDate() {
  return new Date(Date.now() + 86400000).toISOString().split('T')[0];
}

export function buildProductJsonLd(record, canonicalUrl, imageUrlOrImages) {
  const images = Array.isArray(imageUrlOrImages) ? imageUrlOrImages : [imageUrlOrImages];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: record.title || 'Fine Gold Jewellery',
    image: images,
    description: record.description || `Mastercrafted certified ${record.purity} gold jewellery by Khalil & Sons, Karachi.`,
    sku: `KS-${String(record.id).slice(-6).toUpperCase()}`,
    category: record.category || 'Bridal Sets',
    brand: { '@type': 'Brand', name: 'Khalil & Sons Jewellers' }
  };

  if (typeof record.price === 'number' && Number.isFinite(record.price) && record.price > 0) {
    const availability = resolveSchemaAvailability(record);
    const offer = {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'PKR',
      price: record.price.toFixed(2),
      priceValidUntil: getNextDayIsoDate(),
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'JewelryStore', '@id': `${BASE_URL}/#store`, name: 'Khalil & Sons Jewellers' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'PKR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK', addressRegion: 'SD' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 3, unitCode: 'DAY' }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnInStore',
        returnFees: 'https://schema.org/FreeReturn'
      }
    };
    if (availability) {
      offer.availability = availability;
    }
    schema.offers = offer;
  }

  const reviewCount = Number(record.reviewCount) || 0, rating = Number(record.rating) || 0;
  if (reviewCount > 0 && rating > 0 && Number.isFinite(rating)) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.min(5, Math.max(1, rating)).toFixed(1),
      reviewCount
    };
  }
  return schema;
}
