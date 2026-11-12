import { BASE_URL } from './seo.utils.js';

const PUBLIC_BASE_URL = BASE_URL;

export const SSR_NAVIGATION_HTML = `<nav class="sr-only" aria-label="Primary Site Directory"><ul><li><a href="/">Home</a></li><li><a href="/shop">Shop</a></li><li><a href="/gallery">Gallery</a></li><li><a href="/rates">Rates</a></li><li><a href="/reviews">Reviews</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/track-order">Track Order</a></li><li><a href="/collections/Bridal-Sets">Bridal Sets</a></li><li><a href="/collections/gold-necklaces">Necklaces</a></li><li><a href="/collections/gold-earrings">Earrings</a></li><li><a href="/collections/Bangles">Bangles</a></li><li><a href="/collections/Rings">Rings</a></li><li><a href="/collections/gold-chains">Chains</a></li><li><a href="/collections/gold-bracelets">Bracelets</a></li><li><a href="/collections/gold-coins-bars">Bullion &amp; Coins</a></li></ul></nav>`;

const SITE_ENTITY = {
  '@type': 'WebSite',
  '@id': `${PUBLIC_BASE_URL}/#website`,
  url: PUBLIC_BASE_URL,
  name: 'Khalil & Sons Jewellers',
  alternateName: ['Khalil and Sons', 'Khalil & Sons', 'Khalil & Sons Karachi', 'Khalil and Sons Jewellers'],
  description: 'Exquisite 21K, 22K & 24K pure gold, bridal sets, polki, and heirloom jewellery handcrafted in Karachi since 1992.',
  publisher: { '@id': `${PUBLIC_BASE_URL}/#store` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${PUBLIC_BASE_URL}/shop?q={search_term_string}` },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'en-PK'
};

const STORE_ENTITY = {
  '@type': 'JewelryStore',
  '@id': `${PUBLIC_BASE_URL}/#store`,
  name: 'Khalil & Sons Jewellers',
  legalName: 'Khalil & Sons Jewellers',
  alternateName: 'Khalil & Sons',
  image: [`${PUBLIC_BASE_URL}/assets/logo.png`, `${PUBLIC_BASE_URL}/og-image.jpg`],
  logo: `${PUBLIC_BASE_URL}/assets/logo.png`,
  url: PUBLIC_BASE_URL,
  telephone: '+922135670868',
  contactPoint: { '@type': 'ContactPoint', telephone: '+923333213613', contactType: 'sales & consultation', areaServed: 'PK', availableLanguage: ['en', 'ur'] },
  priceRange: '$$$$',
  currenciesAccepted: 'PKR, USD',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  foundingDate: '1992',
  founder: { '@type': 'Person', name: 'Mr. Khalil Ahmed' },
  address: { '@type': 'PostalAddress', streetAddress: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road', addressLocality: 'Saddar, Karachi', addressRegion: 'Sindh', postalCode: '74400', addressCountry: 'PK' },
  geo: { '@type': 'GeoCoordinates', latitude: 24.8595126, longitude: 67.0252029 },
  hasMap: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '14:00', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '15:30', closes: '21:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '14:00', closes: '21:00' }
  ],
  sameAs: ['https://maps.app.goo.gl/49w2MCbeJfqTc8hT7', 'https://www.instagram.com/khalilandsons/', 'https://www.facebook.com/thekhalilandsons/']
};

const NAV_ENTITY = {
  '@type': 'SiteNavigationElement',
  '@id': `${PUBLIC_BASE_URL}/#navigation`,
  name: 'Main Navigation',
  hasPart: [
    { '@type': 'WebPage', name: 'Shop Pure Gold Jewellery', url: `${PUBLIC_BASE_URL}/shop` },
    { '@type': 'WebPage', name: 'Masterpiece Living Archive', url: `${PUBLIC_BASE_URL}/masterpieces` },
    { '@type': 'WebPage', name: 'Live Daily Gold Rates', url: `${PUBLIC_BASE_URL}/rates` },
    { '@type': 'WebPage', name: 'Client Appraisals & Reviews', url: `${PUBLIC_BASE_URL}/reviews` },
    { '@type': 'WebPage', name: 'Heritage & Goldsmithing Legacy', url: `${PUBLIC_BASE_URL}/about` },
    { '@type': 'WebPage', name: 'Showroom Consultation & Contact', url: `${PUBLIC_BASE_URL}/contact` },
    { '@type': 'WebPage', name: 'Track Atelier Order', url: `${PUBLIC_BASE_URL}/track-order` }
  ]
};

const FAQ_ENTITY = {
  '@type': 'FAQPage',
  '@id': `${PUBLIC_BASE_URL}/#faq`,
  mainEntity: [
    { '@type': 'Question', name: 'Where is Khalil & Sons Jewellers located?', acceptedAnswer: { '@type': 'Answer', text: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Map: https://maps.app.goo.gl/49w2MCbeJfqTc8hT7' } },
    { '@type': 'Question', name: 'Are all gold pieces hallmarked?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, every piece is hallmarked (AU · 916.6 for 22K, AU · 875.0 for 21K, AU · 999.0 for 24K) with lifetime certification.' } },
    { '@type': 'Question', name: 'How are jewellery prices calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Prices calculate dynamically using live Karachi Sarafa Market gold rates based on net gold weight, purity, making, and stone charges.' } },
    { '@type': 'Question', name: 'How do I track my jewellery order?', acceptedAnswer: { '@type': 'Answer', text: 'Track real-time crafting stages, hallmarking, and delivery readiness at https://khalilandsonsjewellers.com/track-order.' } }
  ]
};

export function buildPublicPageGraph(cleanPath, pageMeta = {}) {
  const currentUrl = `${PUBLIC_BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
  const title = pageMeta.title || 'Khalil & Sons Jewellers | Master Goldsmithing & Bridal Jewellery Karachi';
  const description = pageMeta.description || 'Master goldsmiths since 1992 in Murshid Sunaar Tower, Saddar, Karachi.';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      SITE_ENTITY,
      STORE_ENTITY,
      NAV_ENTITY,
      FAQ_ENTITY,
      {
        '@type': 'WebPage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: title,
        description: description,
        isPartOf: { '@id': `${PUBLIC_BASE_URL}/#website` },
        about: { '@id': `${PUBLIC_BASE_URL}/#store` },
        inLanguage: 'en-PK'
      }
    ]
  };
}
