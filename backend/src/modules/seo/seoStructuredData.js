import { getPublicSiteUrl } from './publicSiteUrl.js';

const PUBLIC_BASE_URL = getPublicSiteUrl();

export const SSR_NAVIGATION_HTML = `
  <nav class="sr-only" aria-label="Main Navigation">
    <ul>
      <li><a href="/">Home - Khalil &amp; Sons Jewellers</a></li>
      <li><a href="/shop">Shop Gold Jewellery - Ready to Ship</a></li>
      <li><a href="/gallery">Living Archive Masterpieces &amp; Bespoke Gallery</a></li>
      <li><a href="/rates">Live Daily Gold Rates Pakistan</a></li>
      <li><a href="/reviews">Client Appraisals &amp; Reviews</a></li>
      <li><a href="/about">Heritage &amp; Craftsmanship Since 1992</a></li>
      <li><a href="/contact">Showroom Appointment &amp; Bespoke Consultation</a></li>
      <li><a href="/track-order">Track Atelier Order</a></li>
      <li><a href="/collections/Bridal-Sets">Bridal Jewellery Sets</a></li>
      <li><a href="/collections/Necklaces">Handcrafted Gold Necklaces</a></li>
      <li><a href="/collections/Earrings">Pure Gold Earrings &amp; Jhumkas</a></li>
      <li><a href="/collections/Bangles">21K &amp; 22K Gold Bangles &amp; Kadas</a></li>
      <li><a href="/collections/Rings">Fine Gold Rings &amp; Solitaires</a></li>
      <li><a href="/collections/Chains">Pure Gold Chains &amp; Chokers</a></li>
    </ul>
  </nav>
`;

export function buildPublicPageGraph(cleanPath, pageMeta = {}) {
  const currentUrl = `${PUBLIC_BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
  const title = pageMeta.title || 'Khalil & Sons Jewellers | Pure Gold & Diamond Jewellery';
  const description = pageMeta.description || 'Pakistan\'s premier bespoke goldsmith and luxury jewellers since 1992.';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${PUBLIC_BASE_URL}/#website`,
        url: PUBLIC_BASE_URL,
        name: 'Khalil & Sons Jewellers',
        alternateName: ['Khalil and Sons', 'Khalil & Sons', 'Khalil & Sons Luxury Jewellers'],
        description: 'Exquisite 21K, 22K & 24K pure gold, bridal sets, polki, and heirloom jewellery handcrafted in Pakistan since 1992.',
        publisher: { '@id': `${PUBLIC_BASE_URL}/#store` },
        inLanguage: 'en-PK'
      },
      {
        '@type': 'JewelryStore',
        '@id': `${PUBLIC_BASE_URL}/#store`,
        name: 'Khalil & Sons Jewellers',
        alternateName: 'Khalil & Sons',
        image: [
          `${PUBLIC_BASE_URL}/assets/showroom/showroom-facade.jpg`,
          `${PUBLIC_BASE_URL}/assets/logo.png`
        ],
        logo: `${PUBLIC_BASE_URL}/assets/logo.png`,
        url: PUBLIC_BASE_URL,
        telephone: '+92 314 2004245',
        priceRange: 'PKR 10,000 - 5,000,000+',
        currenciesAccepted: 'PKR',
        paymentAccepted: 'Cash, Credit Card, Bank Transfer',
        foundingDate: '1992',
        founder: {
          '@type': 'Person',
          name: 'Muhammad Khalil'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop No 1, Main Sarafa Bazar, Moti Bazar',
          addressLocality: 'Rawalpindi',
          addressRegion: 'Punjab',
          postalCode: '46000',
          addressCountry: 'PK'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 33.6007,
          longitude: 73.0551
        },
        hasMap: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '11:00',
            closes: '21:00'
          }
        ],
        sameAs: [
          'https://www.instagram.com/khalilandsonsjewellers',
          'https://www.facebook.com/khalilandsonsjewellers',
          'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7'
        ]
      },
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
