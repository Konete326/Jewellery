import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { ProductHero } from '../components/ProductHero';
import { GalleryReviewsSection } from '../components/GalleryReviewsSection';
import { MasterpieceLightboxModal } from '../components/MasterpieceLightboxModal';
import { MasterpieceReviewModal } from '../components/MasterpieceReviewModal';
import { BespokeAppointmentModal } from '../components/BespokeAppointmentModal';
import { fetchProductById, fetchProducts } from '@/api/productApi';
import { PolaroidLineCarousel } from '@/components/ui/polaroid-line-carousel';
import { updatePageSEO, getProductSchema, removeProductJsonLd } from '@/utils/seo';
import { LumaSpin } from '@/components/ui/luma-spin';
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync';
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage';
import { toast } from 'sonner';

function sanitizeRating(totalScore, count) {
  return count > 0 ? Number((totalScore / count).toFixed(1)) : 0;
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getLocalCart());

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const [piece, setPiece] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [similarSlides, setSimilarSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const prodRes = await fetchProductById(id, { signal: controller.signal });
        if (!isMounted || controller.signal.aborted) return;
        const p = prodRes?.data || prodRes?.item || prodRes;

        if (p && (p._id || p.id)) {
          const pReviews = Array.isArray(p.reviews) ? p.reviews : [];
          const validReviews = pReviews.filter((r) => Number(r.rating) > 0);
          const totalScore = validReviews.reduce((sum, r) => sum + Number(r.rating), 0);
          const calculatedAvg = sanitizeRating(totalScore, validReviews.length);

          const itemData = {
            ...p,
            _id: p._id || p.id,
            id: p._id || p.id,
            isProduct: true,
            imageUrl: p.imageUrl || (Array.isArray(p.images) && p.images[0]) || '/assets/products/choker-ruby-01.jpg',
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
            averageRating: calculatedAvg || p.averageRating || 5.0,
            reviewCount: validReviews.length
          };

          setPiece(itemData);
          setReviewsList(validReviews);

          updatePageSEO({
            title: `${itemData.title} | Pure Gold Jewellery | Khalil & Sons`,
            description: itemData.description || `Certified ${itemData.purity} gold ${itemData.category} handcrafted by master goldsmiths at Khalil & Sons, Karachi.`,
            canonical: `https://khalilandsonsjewellers.com/product/${itemData._id}`,
            schema: getProductSchema(itemData)
          });
        } else {
          setNotFound(true);
        }
      } catch {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
      controller.abort();
      removeProductJsonLd();
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    if (!piece) return;

    fetchProducts({ limit: 12, isPublished: true })
      .then((res) => {
        if (!isMounted) return;
        const items = res?.data?.items || res?.data || [];
        const currentId = String(piece._id || piece.id);
        const filtered = items
          .filter((item) => String(item._id || item.id) !== currentId)
          .slice(0, 8);

        const slides = filtered.map((item) => ({
          id: item._id || item.id,
          title: item.title,
          category: item.category || 'Fine Jewellery',
          purity: item.purity || '22K',
          price: item.calculatedPrice || item.price,
          imageUrl: item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg'
        }));
        setSimilarSlides(slides);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [piece]);

  useEffect(() => {
    saveLocalCart(cartItems);
    const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    broadcastCartUpdate(count, cartItems);
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        const currentKey = getCartStorageKey();
        if (!data.cartKey || data.cartKey === currentKey) {
          setCartItems(data.items);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleAddToCart = (product, selectedSize) => {
    const sizeLabel = selectedSize ? ` [Size: ${selectedSize}]` : '';
    const cartTitle = `${product.title}${sizeLabel}`;
    const cartId = selectedSize ? `${product._id || product.id}-${selectedSize}` : (product._id || product.id);

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(cartId));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(cartId)
            ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartId,
          productId: product._id || product.id,
          title: cartTitle,
          price: Number(product.calculatedPrice) || Number(product.price) || 0,
          purity: product.purity || '22K',
          size: selectedSize || '',
          quantity: 1,
          imageUrl: product.imageUrl || (Array.isArray(product.images) && product.images[0]) || '/assets/products/choker-ruby-01.jpg',
          category: product.category || 'Fine Jewellery'
        }
      ];
    });

    toast.success('Piece Added to Atelier Bag', {
      description: `${cartTitle} added. Settle online or reserve for showroom visit.`
    });
    setIsCartOpen(true);
  };

  const handleReviewSubmitted = (savedReview) => {
    if (!savedReview) return;
    setReviewsList((prev) => {
      const updated = [savedReview, ...prev];
      const valid = updated.filter((r) => Number(r.rating) > 0);
      const total = valid.reduce((sum, r) => sum + Number(r.rating), 0);
      const newAvg = sanitizeRating(total, valid.length);
      setPiece((curr) => curr ? { ...curr, averageRating: newAvg, reviewCount: valid.length } : curr);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          {piece?.category && (
            <>
              <span>/</span>
              <Link to={`/collections/${encodeURIComponent(piece.category)}`} className="hover:text-foreground transition-colors">
                {piece.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] font-medium">{piece?.title || 'Product'}</span>
        </div>

        {loading ? (
          <div className="min-h-[500px] flex items-center justify-center">
            <LumaSpin variant="amber" size={36} />
          </div>
        ) : notFound || !piece ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase tracking-widest">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>ATELIER REGISTRY</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Product Not Found</h2>
            <p className="text-xs text-muted-foreground">
              This jewellery piece may have been reserved or relocated in our catalogue.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Explore Active Collection</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            <ProductHero
              piece={piece}
              onOpenLightbox={(img) => {
                setLightboxImage(img);
                setIsLightboxOpen(true);
              }}
              onOpenReview={() => setIsReviewModalOpen(true)}
              onOpenAppointment={() => setIsAppointmentModalOpen(true)}
              onAddToCart={handleAddToCart}
            />

            <GalleryReviewsSection
              reviews={reviewsList}
              averageRating={piece.averageRating}
              reviewCount={piece.reviewCount}
              onWriteReview={() => setIsReviewModalOpen(true)}
            />

            {similarSlides.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-border/80">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-300 block mb-1">
                      Curated By Master Goldsmiths
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                      Complementary Heirlooms
                    </h3>
                  </div>
                  <Link
                    to="/shop"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View All Designs →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {similarSlides.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-foreground/40 transition-colors shadow-2xs"
                    >
                      <div className="aspect-square w-full overflow-hidden bg-muted/20">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                          {item.purity} Gold
                        </span>
                        <p className="font-serif text-xs font-semibold text-foreground truncate group-hover:underline">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={(id) => setCartItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))}
        onDecrement={(id) => setCartItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0))}
        onRemove={(id) => setCartItems((p) => p.filter((i) => i.id !== id))}
        onUpdateQuantity={(id, qty) => setCartItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)))}
        onClearCart={() => setCartItems([])}
      />

      <MasterpieceLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={lightboxImage}
        title={piece?.title}
      />

      <MasterpieceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        pieceId={piece?._id || piece?.id}
        pieceTitle={piece?.title}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <BespokeAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        piece={piece}
      />
    </div>
  );
}

export default ProductDetailPage;