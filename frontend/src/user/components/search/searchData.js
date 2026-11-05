export const BOUTIQUE_PAGES = [
  {
    id: 'page-rates',
    title: 'Live Gold & Silver Rates',
    path: '/rates',
    description: 'Current Karachi Sarafa Market benchmark rates for 24K, 22K, 21K, 18K gold and silver.',
    category: 'Rates',
    keywords: ['gold', 'silver', 'rates', 'price', 'sarafa', 'karachi', 'tola', 'gram', '24k', '22k', 'chandi', 'calculator', 'bullion']
  },
  {
    id: 'page-gallery',
    title: 'Jewellery Gallery',
    path: '/gallery',
    description: 'Handcrafted 22K bridal sets, gold bangles, and polki jewellery.',
    category: 'Gallery',
    keywords: ['gallery', 'collection', 'masterpiece', 'jewellery', 'jewelry', 'bridal', 'necklace', 'choker', 'bangles', 'kadas', 'rings']
  },
  {
    id: 'page-reviews',
    title: 'Customer Reviews',
    path: '/reviews',
    description: 'Real reviews and ratings from verified Khalil & Sons customers.',
    category: 'Reviews',
    keywords: ['reviews', 'testimonials', 'appraisals', 'feedback', 'ratings', 'customer', 'google', 'stars']
  },
  {
    id: 'page-about',
    title: 'Our Heritage & Story',
    path: '/about',
    description: 'Over three decades of fine gold jewellery crafting since 1992 in Saddar, Karachi.',
    category: 'About',
    keywords: ['about', 'story', 'history', 'legacy', 'heritage', 'craftsmanship', 'saddar', 'murshid', 'khalil', 'artisan']
  },
  {
    id: 'page-contact',
    title: 'Contact Showroom',
    path: '/contact',
    description: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Phone and showroom directions.',
    category: 'Contact',
    keywords: ['contact', 'visit', 'showroom', 'outlet', 'address', 'directions', 'phone', 'whatsapp', 'timing', 'hours', 'location', 'saddar']
  },
  {
    id: 'page-auth',
    title: 'Account & Saved Items',
    path: '/auth',
    description: 'Sign in to view saved jewellery items, order tracking, and account details.',
    category: 'Account',
    keywords: ['account', 'login', 'signin', 'signup', 'register', 'vault', 'wishlist', 'profile']
  },
  {
    id: 'page-bespoke',
    title: 'Custom Jewellery Design',
    path: '/#atelier',
    description: 'Preview 3D designs before crafting your custom gold jewellery.',
    category: 'Custom Design',
    keywords: ['bespoke', 'custom', 'cad', '3d', 'commission', 'design', 'casting', 'appointment']
  },
  {
    id: 'page-heritage',
    title: 'Gold Purity & Hallmarks',
    path: '/#heritage',
    description: 'Guaranteed 22K (.916) and 24K pure gold with verified assay hallmarks and fair buy-back policies.',
    category: 'Purity',
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
