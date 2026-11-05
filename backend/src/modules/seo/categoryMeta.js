import { BASE_URL } from './seo.utils.js';

const CATEGORY_DEFINITIONS = {
  'bridal-sets': {
    canonicalSlug: 'Bridal-Sets',
    title: 'Bridal Sets Collection | Khalil & Sons Jewellers',
    description: 'Explore handcrafted certified 22K gold bridal sets, wedding necklaces, and heirloom jewellery by Khalil & Sons Jewellers, Saddar, Karachi.'
  },
  'rings': {
    canonicalSlug: 'Rings',
    title: 'Gold Rings Collection | Khalil & Sons Jewellers',
    description: 'Discover solitaires, engagement rings, and artisanal 21K and 22K gold rings handcrafted by master goldsmiths at Khalil & Sons Jewellers, Karachi.'
  },
  'bangles': {
    canonicalSlug: 'Bangles',
    title: 'Gold Bangles & Kadas Collection | Khalil & Sons Jewellers',
    description: 'Shop certified 22K gold bangles, traditional kadas, and structured bracelets crafted by master goldsmiths at Khalil & Sons Jewellers, Karachi.'
  },
  'chains': {
    canonicalSlug: 'gold-chains',
    title: 'Gold Chains Collection | Khalil & Sons Jewellers',
    description: 'Classic and modern solid 22K gold chain links crafted for everyday grace by Khalil & Sons Jewellers, Saddar, Karachi.'
  },
  'bracelets': {
    canonicalSlug: 'gold-bracelets',
    title: 'Gold Bracelets Collection | Khalil & Sons Jewellers',
    description: 'Exquisite flexible and structured 22K gold bracelets with certified hallmark purity by Khalil & Sons Jewellers, Karachi.'
  },
  'earrings': {
    canonicalSlug: 'gold-earrings',
    title: 'Gold Earrings Collection | Khalil & Sons Jewellers',
    description: 'Elegantly proportioned 22K gold earrings from daily studs to chandelier drops by Khalil & Sons Jewellers, Karachi.'
  },
  'necklaces': {
    canonicalSlug: 'gold-necklaces',
    title: 'Gold Necklaces Collection | Khalil & Sons Jewellers',
    description: 'Statement 22K gold necklaces reflecting heritage Mughal filigree and modern luxury by Khalil & Sons Jewellers, Karachi.'
  },
  'sets': {
    canonicalSlug: 'Bridal-Sets',
    title: 'Bridal Sets Collection | Khalil & Sons Jewellers',
    description: 'Explore handcrafted certified 22K gold bridal sets, wedding necklaces, and heirloom jewellery by Khalil & Sons Jewellers, Saddar, Karachi.'
  },
  'coins-bars': {
    canonicalSlug: 'gold-coins-bars',
    title: 'Gold Coins & Minted Bars | Khalil & Sons Jewellers',
    description: 'Investment grade 24K pure gold bullion coins and minted bars with hallmark certification from Khalil & Sons Jewellers, Karachi.'
  }
};

const CATEGORY_ALIASES = {
  'bridal-sets': 'bridal-sets',
  'bridal-set': 'bridal-sets',
  'bridalsets': 'bridal-sets',
  'rings': 'rings',
  'gold-rings': 'rings',
  'ring': 'rings',
  'bangles': 'bangles',
  'gold-bangles': 'bangles',
  'kadas': 'bangles',
  'bangle': 'bangles',
  'chains': 'chains',
  'gold-chains': 'chains',
  'chain': 'chains',
  'bracelets': 'bracelets',
  'gold-bracelets': 'bracelets',
  'bracelet': 'bracelets',
  'earrings': 'earrings',
  'gold-earrings': 'earrings',
  'earring': 'earrings',
  'necklaces': 'necklaces',
  'gold-necklaces': 'necklaces',
  'necklace': 'necklaces',
  'sets': 'bridal-sets',
  'gold-sets': 'bridal-sets',
  'goldsets': 'bridal-sets',
  'coins-bars': 'coins-bars',
  'gold-coins-bars': 'coins-bars',
  'gold-coins': 'coins-bars',
  'coins': 'coins-bars',
  'bars': 'coins-bars'
};

export function resolveCategoryMeta(rawCategory) {
  if (!rawCategory || typeof rawCategory !== 'string') return null;
  const normalized = rawCategory.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const targetKey = CATEGORY_ALIASES[normalized];
  if (!targetKey) return null;

  const def = CATEGORY_DEFINITIONS[targetKey];
  if (!def) return null;

  return {
    title: def.title,
    description: def.description,
    canonicalSlug: def.canonicalSlug,
    canonicalUrl: `${BASE_URL}/collections/${def.canonicalSlug}`
  };
}
