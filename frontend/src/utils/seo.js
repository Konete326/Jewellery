const DEFAULT_TITLE = 'Khalil & Sons Jewellers | Master Goldsmithing & Bridal Jewellery Karachi';
const DEFAULT_DESCRIPTION = 'Khalil & Sons Jewellers — Master goldsmiths since 1992 in Murshid Sunaar Tower, Saddar, Karachi. Specializing in certified 22K, 21K and 18K gold bridal jewellery heirlooms, uncut Polki diamonds, and lifetime hallmark guarantee.';
const DEFAULT_KEYWORDS = 'Khalil and Sons, Khalil and Sons Jewellers, jewellery in Karachi, gold jewellery Saddar, Murshid Sunaar Tower, best jewelers Karachi, 22K gold bridal jewelry, 24K gold bullion, polki diamonds, custom wedding jewellery, Karachi sarafa bazaar, Pakistani bridal jewellery, gold kada, jhumka, guluband';
const DEFAULT_IMAGE = 'https://khalilandsonsjewellers.com/og-image.jpg';
const BASE_URL = 'https://khalilandsonsjewellers.com';

const optimizeCloudinaryUrl = (url = '') => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
};

function setMetaTag(selector, attribute, value) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.startsWith('meta[name=')) {
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (name) element.setAttribute('name', name);
    } else if (selector.startsWith('meta[property=')) {
      const property = selector.match(/property="([^"]+)"/)?.[1];
      if (property) element.setAttribute('property', property);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function setCanonical(url) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function getStoreScript() {
  if (typeof document === 'undefined') return null;
  let script = document.getElementById('store-json-ld');
  if (!script) {
    const legacy = document.getElementById('seo-json-ld');
    if (legacy) {
      legacy.id = 'store-json-ld';
      script = legacy;
    }
  }
  return script;
}

function setStoreJsonLd(schemaData) {
  if (typeof document === 'undefined' || !schemaData) return;
  let script = getStoreScript();
  if (!script) {
    script = document.createElement('script');
    script.id = 'store-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
}

function setProductJsonLd(schemaData) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById('product-json-ld');
  if (!schemaData) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = 'product-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
}

export function removeProductJsonLd() {
  if (typeof document === 'undefined') return;
  const script = document.getElementById('product-json-ld');
  if (script) script.remove();
}

export function updatePageSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema,
  noIndex = false
} = {}) {
  if (typeof document === 'undefined') return;

  const fullTitle = title
    ? (title.includes('Khalil & Sons') ? title : `${title} | Khalil & Sons Jewellers`)
    : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  const fullImage = image?.startsWith('http') ? image : `${BASE_URL}${image || '/og-image.jpg'}`;

  document.title = fullTitle;

  setMetaTag('meta[name="robots"]', 'content', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('meta[name="keywords"]', 'content', keywords);
  setCanonical(currentUrl);

  setMetaTag('meta[property="og:title"]', 'content', fullTitle);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:image"]', 'content', fullImage);
  setMetaTag('meta[property="og:image:secure_url"]', 'content', fullImage);
  setMetaTag('meta[property="og:image:width"]', 'content', '1200');
  setMetaTag('meta[property="og:image:height"]', 'content', '630');
  setMetaTag('meta[property="og:url"]', 'content', currentUrl);
  setMetaTag('meta[property="og:type"]', 'content', type);
  setMetaTag('meta[property="og:site_name"]', 'content', 'Khalil & Sons Jewellers');

  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
  setMetaTag('meta[name="twitter:image"]', 'content', fullImage);

  if (schema) {
    if (schema['@type'] === 'Product') {
      setProductJsonLd(schema);
    } else if (schema['@type'] === 'JewelryStore' || schema['@graph']) {
      setStoreJsonLd(schema);
      setProductJsonLd(null);
    }
  } else if (type !== 'product') {
    setProductJsonLd(null);
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Khalil & Sons Jewellers',
        alternateName: ['Khalil and Sons', 'Khalil & Sons', 'Khalil & Sons Luxury Jewellers'],
        description: 'Exquisite 21K, 22K & 24K pure gold, bridal sets, polki, and heirloom jewellery handcrafted in Karachi since 1992.',
        publisher: { '@id': `${BASE_URL}/#store` },
        inLanguage: 'en-PK'
      },
      {
        '@type': 'JewelryStore',
        '@id': `${BASE_URL}/#store`,
        name: 'Khalil & Sons Jewellers',
        alternateName: 'Khalil & Sons',
        image: [
          `${BASE_URL}/assets/logo.png`,
          `${BASE_URL}/og-image.jpg`
        ],
        logo: `${BASE_URL}/assets/logo.png`,
        url: BASE_URL,
        telephone: '+922135670868',
        priceRange: '$$$$',
        currenciesAccepted: 'PKR, USD',
        paymentAccepted: 'Cash, Credit Card, Bank Transfer',
        foundingDate: '1992',
        founder: {
          '@type': 'Person',
          name: 'Muhammad Khalil'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road',
          addressLocality: 'Saddar, Karachi',
          addressRegion: 'Sindh',
          postalCode: '74400',
          addressCountry: 'PK'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.8595126,
          longitude: 67.0252029
        },
        hasMap: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '14:00',
            closes: '21:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Friday',
            opens: '15:30',
            closes: '21:30'
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '14:00',
            closes: '21:00'
          }
        ],
        sameAs: [
          'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
          'https://www.instagram.com/khalilandsons/',
          'https://www.facebook.com/thekhalilandsons/'
        ]
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${BASE_URL}/#navigation`,
        name: 'Main Navigation',
        hasPart: [
          { '@type': 'WebPage', 'name': 'Shop Pure Gold Jewellery', 'url': `${BASE_URL}/shop` },
          { '@type': 'WebPage', 'name': 'Living Archive & Bespoke Masterpieces', 'url': `${BASE_URL}/masterpieces` },
          { '@type': 'WebPage', 'name': 'Live Daily Gold Rates', 'url': `${BASE_URL}/rates` },
          { '@type': 'WebPage', 'name': 'Client Appraisals & Reviews', 'url': `${BASE_URL}/reviews` },
          { '@type': 'WebPage', 'name': 'Heritage & Goldsmithing Legacy', 'url': `${BASE_URL}/about` },
          { '@type': 'WebPage', 'name': 'Showroom Consultation & Contact', 'url': `${BASE_URL}/contact` },
          { '@type': 'WebPage', 'name': 'Track Atelier Order', 'url': `${BASE_URL}/track-order` }
        ]
      }
    ]
  };
}

export function getFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question || faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a
      }
    }))
  };
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

export function getProductSchema(piece) {
  if (!piece) return null;
  const imageSources = Array.isArray(piece.images) && piece.images.length > 0
    ? piece.images
    : [piece.imageUrl || piece.src || '/assets/logo.png'];

  const allImages = imageSources.map((raw) => {
    const full = raw.startsWith('http') ? raw : `${BASE_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
    return optimizeCloudinaryUrl(full);
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: piece.title || 'Fine Gold Jewellery',
    image: allImages,
    description: piece.description || 'Mastercrafted certified 22K gold jewellery by Khalil & Sons, Karachi.',
    sku: `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`,
    category: piece.category || 'Bridal Sets',
    brand: {
      '@type': 'Brand',
      name: 'Khalil & Sons Jewellers'
    }
  };

  const rawPrice = piece.calculatedPrice ?? piece.numericPrice ?? piece.price;
  const numPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) : Number(rawPrice);
  if (Number.isFinite(numPrice) && numPrice > 0) {
    const availability = resolveSchemaAvailability(piece);
    const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const offer = {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${piece._id || piece.id}`,
      priceCurrency: 'PKR',
      price: numPrice.toFixed(2),
      priceValidUntil: nextDay,
      itemCondition: 'https://schema.org/NewCondition',
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
      },
      availableAtOrFrom: {
        '@type': 'JewelryStore',
        '@id': `${BASE_URL}/#store`,
        name: 'Khalil & Sons Jewellers',
        telephone: '+922135670868',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road',
          addressLocality: 'Saddar, Karachi',
          addressRegion: 'Sindh',
          postalCode: '74400',
          addressCountry: 'PK'
        }
      },
      seller: {
        '@type': 'JewelryStore',
        '@id': `${BASE_URL}/#store`,
        name: 'Khalil & Sons Jewellers',
        telephone: '+922135670868'
      }
    };
    if (availability) {
      offer.availability = availability;
    }
    schema.offers = offer;
  }

  const realReviewCount = Number(piece.reviewCount || (Array.isArray(piece.reviews) ? piece.reviews.length : 0)) || 0;
  const realRating = Number(piece.averageRating || piece.rating) || 0;
  if (realReviewCount > 0 && realRating > 0 && Number.isFinite(realRating)) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.min(5, Math.max(1, realRating)).toFixed(1),
      reviewCount: realReviewCount
    };
  }

  return schema;
}
