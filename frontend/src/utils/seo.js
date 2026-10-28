const DEFAULT_TITLE = 'Khalil & Sons Jewellers | Master Goldsmithing & Bridal Jewellery Karachi';
const DEFAULT_DESCRIPTION = 'Khalil & Sons Jewellers — Master goldsmiths since 1992 in Murshid Sunaar Tower, Saddar, Karachi. Specializing in certified 22K/24K gold, bespoke bridal jewellery heirlooms, uncut Polki diamonds, and lifetime hallmark guarantee.';
const DEFAULT_KEYWORDS = 'Khalil and Sons, Khalil and Sons Jewellers, jewellery in Karachi, gold jewellery Saddar, Murshid Sunaar Tower, best jewelers Karachi, 22K gold bridal jewelry, 24K gold bullion, polki diamonds, custom wedding jewellery, Karachi sarafa bazaar, Pakistani bridal jewellery, gold kada, jhumka, guluband';
const DEFAULT_IMAGE = 'https://khalilandsonsjewellers.com/assets/logo.png';
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

function setJsonLd(schemaData) {
  if (typeof document === 'undefined' || !schemaData) return;
  let script = document.getElementById('seo-json-ld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
}

export function updatePageSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema
} = {}) {
  if (typeof document === 'undefined') return;

  const fullTitle = title ? `${title} | Khalil & Sons Jewellers` : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  const fullImage = image?.startsWith('http') ? image : `${BASE_URL}${image || '/assets/logo.png'}`;

  document.title = fullTitle;

  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('meta[name="keywords"]', 'content', keywords);
  setCanonical(currentUrl);

  setMetaTag('meta[property="og:title"]', 'content', fullTitle);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:image"]', 'content', fullImage);
  setMetaTag('meta[property="og:url"]', 'content', currentUrl);
  setMetaTag('meta[property="og:type"]', 'content', type);
  setMetaTag('meta[property="og:site_name"]', 'content', 'Khalil & Sons Jewellers');

  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
  setMetaTag('meta[name="twitter:image"]', 'content', fullImage);

  if (schema) {
    setJsonLd(schema);
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Khalil & Sons Jewellers',
    image: `${BASE_URL}/assets/logo.png`,
    '@id': `${BASE_URL}/#store`,
    url: BASE_URL,
    telephone: '+922135670868',
    priceRange: '$$$$',
    currenciesAccepted: 'PKR, USD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
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
  };
}

export function getProductSchema(piece) {
  if (!piece) return null;
  const rating = Number(piece.averageRating || piece.rating || 5);
  const reviewCount = Math.max(1, piece.reviewCount || (piece.reviews?.length) || 1);
  const rawImg = piece.imageUrl?.startsWith('http')
    ? piece.imageUrl
    : `${BASE_URL}${piece.imageUrl || piece.src || '/assets/logo.png'}`;
  const imgUrl = optimizeCloudinaryUrl(rawImg);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: piece.title || 'Fine Gold Jewellery',
    image: [imgUrl],
    description: piece.description || 'Mastercrafted certified 22K gold jewellery by Khalil & Sons, Karachi.',
    sku: `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`,
    category: piece.category || 'Bridal Sets',
    brand: {
      '@type': 'Brand',
      name: 'Khalil & Sons Jewellers'
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/gallery/${piece._id || piece.id}`,
      priceCurrency: 'PKR',
      price: '0.00',
      priceValidUntil: '2030-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
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
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount
    }
  };
}
