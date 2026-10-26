export const BOUTIQUE_PAGES = [
  {
    id: 'page-rates',
    title: 'Live Gold & Silver Rates',
    path: '/rates',
    description: 'Current Karachi Sarafa Market benchmark rates for 24K, 22K, 21K, 18K gold and silver.',
    category: 'Market Benchmark',
    keywords: ['gold', 'silver', 'rates', 'price', 'sarafa', 'karachi', 'tola', 'gram', '24k', '22k', 'chandi', 'calculator', 'bullion']
  },
  {
    id: 'page-gallery',
    title: 'Atelier Masterpiece Gallery',
    path: '/gallery',
    description: 'Curated collection of handcrafted 22K bridal sets, gold kadas, and jadau polki heirlooms.',
    category: 'Collection',
    keywords: ['gallery', 'collection', 'masterpiece', 'jewellery', 'jewelry', 'bridal', 'necklace', 'choker', 'bangles', 'kadas', 'rings']
  },
  {
    id: 'page-reviews',
    title: 'Client Reviews & Appraisals',
    path: '/reviews',
    description: 'Verified appraisals and reflections from patrons who commissioned Khalil & Sons heirlooms.',
    category: 'Heritage Trust',
    keywords: ['reviews', 'testimonials', 'appraisals', 'feedback', 'ratings', 'customer', 'google', 'stars']
  },
  {
    id: 'page-about',
    title: 'Brand Heritage & Goldsmithing Legacy',
    path: '/about',
    description: 'Over three decades of master goldsmithing since 1992 in Murshid Bazaar, Saddar, Karachi.',
    category: 'Heritage',
    keywords: ['about', 'story', 'history', 'legacy', 'heritage', 'craftsmanship', 'saddar', 'murshid', 'khalil', 'artisan']
  },
  {
    id: 'page-contact',
    title: 'Boutique Contact & Showroom Visit',
    path: '/contact',
    description: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Phone and driving directions.',
    category: 'Concierge',
    keywords: ['contact', 'visit', 'showroom', 'address', 'directions', 'phone', 'whatsapp', 'timing', 'hours', 'location', 'saddar']
  },
  {
    id: 'page-auth',
    title: 'Patron Account & Atelier Vault',
    path: '/auth',
    description: 'Sign in to access saved bridal heirlooms, inquiry history, and personalized appraisals.',
    category: 'Account',
    keywords: ['account', 'login', 'signin', 'signup', 'register', 'vault', 'wishlist', 'profile']
  },
  {
    id: 'page-bespoke',
    title: 'Bespoke 3D CAD Commissioning',
    path: '/#atelier',
    description: 'Preview photorealistic 3D computer-aided designs before molten 22K gold casting.',
    category: 'Artisan Service',
    keywords: ['bespoke', 'custom', 'cad', '3d', 'commission', 'design', 'casting', 'appointment']
  },
  {
    id: 'page-heritage',
    title: 'Certified Purity & Hallmark Guarantee',
    path: '/#heritage',
    description: 'Guaranteed 22K (.916) and 24K pure gold with verified assay hallmarks and buy-back transparency.',
    category: 'Hallmark',
    keywords: ['purity', 'hallmark', 'certificate', 'quality', '22k', '24k', 'guarantee', 'buyback', 'assay']
  }
];

export function filterPages(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return BOUTIQUE_PAGES.filter((page) => {
    return (
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.category.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.includes(q))
    );
  });
}
