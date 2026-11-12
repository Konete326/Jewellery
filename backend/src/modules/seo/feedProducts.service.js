import { Product } from '../products/product.model.js';
import { rateService } from '../rates/rate.service.js';
import { calculateProductPricing } from '../products/product.pricing.js';
import { BASE_URL, resolveImageUrl } from './seo.utils.js';

export async function loadFeedProducts() {
  const [rates, products] = await Promise.all([
    rateService.getCurrentRates().catch(() => null),
    Product.find({ isPublished: true })
      .select('_id title sku slug category purity grossWeight netWeight makingCharges wastagePercent stoneCharges price stock availability description images updatedAt')
      .sort({ updatedAt: -1 })
      .lean()
  ]);

  const pricedProducts = [];

  for (const product of products) {
    const pricing = calculateProductPricing(product, rates);
    const numericPrice = Math.round(Number(pricing?.calculatedPrice || product.price) || 0);
    if (numericPrice <= 0) continue;

    let availability = 'in_stock';
    const isOutOfStock = product.availability === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0);
    if (isOutOfStock) {
      availability = 'out_of_stock';
    } else if (product.availability === 'Made to Order') {
      availability = 'backorder';
    }

    const id = String(product._id);
    const sku = (product.sku && product.sku.trim()) || `KS-${id.slice(-6).toUpperCase()}`;
    const rawImg = (Array.isArray(product.images) && product.images[0]) || '';
    const imageUrl = resolveImageUrl(rawImg);
    const additionalImages = Array.isArray(product.images) && product.images.length > 1
      ? product.images.slice(1).map(resolveImageUrl).filter(Boolean)
      : [];

    pricedProducts.push({
      id,
      sku,
      title: product.title || 'Fine Gold Jewellery',
      description: product.description || `Certified 22K/24K handcrafted ${product.category || 'jewellery'} piece by Khalil & Sons Jewellers, Karachi.`,
      category: product.category || 'Fine Jewellery',
      price: numericPrice,
      priceString: `${numericPrice}.00 PKR`,
      formattedDecimal: `${numericPrice}.00`,
      availability,
      imageUrl,
      additionalImages,
      link: `${BASE_URL}/product/${id}`,
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
  }

  return pricedProducts;
}

