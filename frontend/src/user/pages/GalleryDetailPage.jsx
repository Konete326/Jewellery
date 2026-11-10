import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gem } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { GalleryMasterpieceHero } from '../components/GalleryMasterpieceHero';
import { GalleryReviewsSection } from '../components/GalleryReviewsSection';
import { MasterpieceLightboxModal } from '../components/MasterpieceLightboxModal';
import { MasterpieceReviewModal } from '../components/MasterpieceReviewModal';
import { MasterpieceInquiryModal } from '../components/MasterpieceInquiryModal';
import { BespokeAppointmentModal } from '../components/BespokeAppointmentModal';
import { galleryApi } from '@/api/galleryApi';
import { fetchProductById, fetchProducts } from '@/api/productApi';
import { PolaroidLineCarousel } from '@/components/ui/polaroid-line-carousel';
import { updatePageSEO, getProductSchema, removeProductJsonLd } from '@/utils/seo';
import { LuxuryButton } from '../components/LuxuryButton';
import { LumaSpin } from '@/components/ui/luma-spin';
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync';
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage';
import { getEstimatedPiecePrice, sanitizeQuantity } from '@/utils/pricing';
import { toast } from 'sonner';

export function GalleryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getLocalCart());

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryImage, setInquiryImage] = useState(null);
  const [inquiryImageIndex, setInquiryImageIndex] = useState(0);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [piece, setPiece] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [similarSlides, setSimilarSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadPiece = async () => {
      setLoading(true);
      setNotFound(false);
      setApiError(false);

      let itemData = null;
      let isProduct = false;

      try {
        const res = await galleryApi.getById(id, { signal: controller.signal });
        if (!isMounted || controller.signal.aborted) return;
        if (res && res.data) {
          itemData = res.data;
          isProduct = false;
        }
      } catch (err) {
        if (!isMounted || controller.signal.aborted) return;
      }

      if (!itemData) {
        try {
          const prodRes = await fetchProductById(id, { signal: controller.signal });
          if (!isMounted || controller.signal.aborted) return;
          const p = prodRes?.data || prodRes?.item || prodRes;
          if (p && (p._id || p.id)) {
            itemData = {
              _id: p._id || p.id,
              id: p._id || p.id,
              title: p.title || p.name || 'Fine Jewellery Piece',
              sku: p.sku || '',
              slug: p.slug || '',
              category: p.category || 'Bridal Sets',
              description: p.description || '',
              imageUrl: p.imageUrl || (Array.isArray(p.images) && p.images[0]) || '/assets/products/choker-ruby-01.jpg',
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
              purity: p.purity || '22K',
              grossWeight: p.grossWeight,
              netWeight: p.netWeight,
              makingCharges: p.makingCharges,
              stoneCharges: p.stoneCharges,
              wastagePercent: p.wastagePercent,
              price: p.price,
              calculatedPrice: p.calculatedPrice || p.price,
              minAdvanceToLock: p.minAdvanceToLock,
              liveRatePerGram: p.liveRatePerGram,
              pureGoldCost: p.pureGoldCost,
              stock: (p.stock !== undefined && p.stock !== null) ? p.stock : (p.stockQuantity ?? null),
              stockQuantity: p.stockQuantity ?? p.stock ?? null,
              availability: p.availability || 'In Stock',
              isPublished: p.isPublished,
              averageRating: Number(p.averageRating) || 0,
              reviewCount: Number(p.reviewCount) || (Array.isArray(p.reviews) ? p.reviews.length : 0),
              reviews: Array.isArray(p.reviews) ? p.reviews : []
            };
            isProduct = true;
          }
        } catch (err) {
          if (!isMounted || controller.signal.aborted) return;
          if (err?.status !== 404) {
            setApiError(true);
            setLoading(false);
            return;
          }
        }
      }

      if (!isMounted || controller.signal.aborted) return;

      if (!itemData) {
        setPiece(null);
        setNotFound(true);
        setLoading(false);
        return;
      }

      const itemPayload = {
        _id: itemData._id || itemData.id,
        id: itemData._id || itemData.id,
        title: itemData.title || itemData.name || 'Fine Jewellery Piece',
        sku: itemData.sku || '',
        slug: itemData.slug || '',
        category: itemData.category || 'Bridal Sets',
        description: itemData.description || '',
        imageUrl: itemData.imageUrl || (Array.isArray(itemData.images) && itemData.images[0]) || '/assets/products/choker-ruby-01.jpg',
        images: Array.isArray(itemData.images) && itemData.images.length > 0 ? itemData.images : (itemData.imageUrl ? [itemData.imageUrl] : []),
        purity: itemData.purity || '22K',
        grossWeight: itemData.grossWeight,
        netWeight: itemData.netWeight,
        makingCharges: itemData.makingCharges,
        stoneCharges: itemData.stoneCharges,
        wastage: itemData.wastage,
        wastagePercent: itemData.wastagePercent,
        price: itemData.price,
        calculatedPrice: itemData.calculatedPrice || itemData.price,
        minAdvanceToLock: itemData.minAdvanceToLock,
        liveRatePerGram: itemData.liveRatePerGram,
        pureGoldCost: itemData.pureGoldCost,
        stock: (itemData.stock !== undefined && itemData.stock !== null) ? itemData.stock : (itemData.stockQuantity ?? itemData.inventoryQuantity ?? null),
        stockQuantity: itemData.stockQuantity ?? itemData.stock ?? itemData.inventoryQuantity ?? null,
        availability: itemData.availability || null,
        isPublished: itemData.isPublished,
        averageRating: Number(itemData.averageRating) || 0,
        reviewCount: Number(itemData.reviewCount) || (Array.isArray(itemData.reviews) ? itemData.reviews.length : 0),
        reviews: Array.isArray(itemData.reviews) ? itemData.reviews : [],
        isProduct
      };

      setPiece(itemPayload);
      setReviewsList(itemPayload.reviews);
      setLoading(false);

      updatePageSEO({
        title: itemPayload.title,
        description: itemPayload.description || `Discover ${itemPayload.title} - handcrafted certified 22K, 21K and 18K gold jewellery by Khalil & Sons Jewellers, Murshid Sunaar Tower, Saddar, Karachi.`,
        keywords: `${itemPayload.title}, ${itemPayload.category || 'Bridal Sets'}, gold jewellery Karachi, certified 22K 21K 18K gold, Pakistani jewellery, Khalil & Sons`,
        image: itemPayload.imageUrl,
        type: 'product',
        schema: getProductSchema(itemPayload)
      });

      try {
        if (isProduct) {
          const similarRes = await fetchProducts({ limit: 8, isPublished: true });
          if (!isMounted || controller.signal.aborted) return;
          const rawItems = similarRes?.data?.items || similarRes?.data || [];
          const list = Array.isArray(rawItems) ? rawItems : [];
          const currentId = String(itemPayload._id || itemPayload.id);
          const filtered = list.filter((it) => String(it._id || it.id) !== currentId);
          const formattedSlides = filtered.map((item) => ({
            id: item._id || item.id,
            image: item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg',
            title: item.title,
            caption: item.category || '22K Gold Masterpiece',
            category: item.category || 'Fine Jewellery',
            alt: item.title
          }));
          setSimilarSlides(formattedSlides);
        } else {
          const similarRes = await galleryApi.getAll({ limit: 8, page: 1 });
          if (!isMounted || controller.signal.aborted) return;
          const list = Array.isArray(similarRes?.data) ? similarRes.data : (Array.isArray(similarRes) ? similarRes : []);
          const currentId = String(itemPayload._id || itemPayload.id);
          const filtered = list.filter((it) => String(it._id || it.id) !== currentId && (it.imageUrl || it.src));
          const formattedSlides = filtered.map((item) => ({
            id: item._id || item.id,
            image: item.imageUrl || item.src,
            title: item.title,
            caption: item.category || '22K Gold Masterpiece',
            category: item.category || 'Fine Jewellery',
            alt: item.title
          }));
          setSimilarSlides(formattedSlides);
        }
      } catch {}
    };

    loadPiece();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
      controller.abort();
      removeProductJsonLd();
    };
  }, [id, retryCount]);

  const handleReviewSubmitted = (newReview) => {
    setReviewsList((prev) => [newReview, ...prev]);
    setPiece((prev) => {
      if (!prev) return prev;
      const updatedReviews = [newReview, ...(prev.reviews || [])];
      const validReviews = updatedReviews.filter((r) => Number(r.rating) > 0);
      const newCount = updatedReviews.length;
      const totalScore = validReviews.reduce((sum, r) => sum + Number(r.rating), 0);
      const newAverage = validReviews.length > 0 ? Number((totalScore / validReviews.length).toFixed(1)) : 0;
      return {
        ...prev,
        reviews: updatedReviews,
        reviewCount: newCount,
        averageRating: newAverage
      };
    });
  };

  useEffect(() => {
    saveLocalCart(cartItems);
    const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    broadcastCartUpdate(count, cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const nextUser = e?.detail ?? null;
      setCartItems(getLocalCart(nextUser));
    };
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange);
  }, []);

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

  const handleAddToCart = (itemToAdd = piece, size = null) => {
    if (!itemToAdd) return;
    const pieceId = itemToAdd._id || itemToAdd.id;
    const cleanSize = size ? String(size).trim() : '';
    const cartItemId = cleanSize ? `${pieceId}-${cleanSize}` : String(pieceId);
    const pricing = getEstimatedPiecePrice(itemToAdd);
    const purityVal = itemToAdd.purity || pricing.purity || '';
    const images = Array.isArray(itemToAdd.images) ? itemToAdd.images : [];
    const imageSrc = itemToAdd.imageUrl || itemToAdd.src || images[0] || '/assets/products/choker-ruby-01.jpg';

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(cartItemId));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(cartItemId) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: String(pieceId),
          name: itemToAdd.title || itemToAdd.name || 'Fine Jewellery Piece',
          title: itemToAdd.title || itemToAdd.name || 'Fine Jewellery Piece',
          category: itemToAdd.category || 'Fine Jewellery',
          image: imageSrc,
          imageUrl: imageSrc,
          numericPrice: pricing.numericPrice,
          price: pricing.formattedPrice,
          quantity: 1,
          material: purityVal,
          purity: purityVal,
          isEstimated: Boolean(pricing.isEstimated),
          hasConfirmedPrice: Boolean(pricing.hasConfirmedPrice),
          pricingSource: pricing.pricingSource || 'estimate',
          calculatedPrice: itemToAdd.calculatedPrice || undefined,
          netWeight: itemToAdd.netWeight || undefined,
          grossWeight: itemToAdd.grossWeight || undefined,
          makingCharges: itemToAdd.makingCharges || undefined,
          size: cleanSize || undefined
        }
      ];
    });

    const sizeMsg = cleanSize ? ` (Size: ${cleanSize})` : '';
    toast.success(`${itemToAdd.title || 'Masterpiece'}${sizeMsg} added to your bag`, {
      action: {
        label: 'View Bag',
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const handleUpdateQuantity = (cartItemId, newQty) => {
    const clean = sanitizeQuantity(newQty);
    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(cartItemId) ? { ...item, quantity: clean } : item))
    );
  };

  const handleIncrement = (cartItemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(cartItemId) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
      )
    );
  };

  const handleDecrement = (cartItemId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(cartItemId) ? { ...item, quantity: (Number(item.quantity) || 1) - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(cartItemId)));
    toast.info('Item removed from bag');
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Shopping bag cleared');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LumaSpin size={28} />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={0}
        />
        <div className="max-w-md mx-auto text-center px-6 py-24">
          <Gem className="size-10 text-neutral-600 dark:text-neutral-400 mx-auto mb-4" />
          <h2 className="font-headline text-3xl font-light mb-3">Unable to Load Item</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
            Could not connect to our jewellery catalog. Please check your connection and try again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <LuxuryButton onClick={() => setRetryCount((prev) => prev + 1)} variant="dark">
              Try Again
            </LuxuryButton>
            <LuxuryButton onClick={() => navigate('/gallery')} variant="outline">
              Return to Gallery
            </LuxuryButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !piece) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={0}
        />
        <div className="max-w-md mx-auto text-center px-6 py-24">
          <Gem className="size-10 text-neutral-600 dark:text-neutral-400 mx-auto mb-4" />
          <h2 className="font-headline text-3xl font-light mb-3">Item Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
            This jewellery item is currently unavailable or has been removed from our catalog.
          </p>
          <div className="flex items-center justify-center gap-3">
            <LuxuryButton onClick={() => navigate('/shop')} variant="dark">
              Explore Shop
            </LuxuryButton>
            <LuxuryButton onClick={() => navigate('/gallery')} variant="outline">
              Return to Gallery
            </LuxuryButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="relative z-10 pt-24 md:pt-28 pb-16 w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <nav className="flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={piece.isProduct ? "/shop" : "/gallery"} className="hover:text-foreground transition-colors">
              {piece.isProduct ? "Shop" : "Gallery"}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[220px] sm:max-w-xs">{piece.title}</span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(piece.isProduct ? '/shop' : '/gallery');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer group py-1"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{piece.isProduct ? 'Back to Shop' : 'Back to Gallery'}</span>
          </button>
        </div>

        <GalleryMasterpieceHero
          piece={piece}
          onOpenLightbox={(img) => {
            setLightboxImage(img || piece.imageUrl || piece.src);
            setIsLightboxOpen(true);
          }}
          onOpenReview={() => setIsReviewModalOpen(true)}
          onOpenInquiry={(imgUrl, imgIdx) => {
            setInquiryImage(imgUrl || piece.imageUrl || piece.src);
            setInquiryImageIndex(typeof imgIdx === 'number' ? imgIdx : 0);
            setIsInquiryModalOpen(true);
          }}
          onOpenAppointment={() => setIsAppointmentModalOpen(true)}
          onAddToCart={handleAddToCart}
        />

        <div className="w-full pt-10 pb-6 border-t border-border/60">
          {similarSlides.length > 0 && (
            <div className="w-full mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono font-medium block mb-1">
                    Curated Collection • {piece.category || 'Fine Jewellery'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground">
                    Similar Jewellery
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Swipe or click to view
                </span>
              </div>

              <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-card/40 shadow-xs">
                <PolaroidLineCarousel
                  slides={similarSlides}
                  height="440px"
                  cardWidth={260}
                  onSlideClick={(slide) => {
                    if (slide.id) {
                      navigate(`/gallery/${slide.id}`);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {piece.isProduct && (
          <GalleryReviewsSection
            piece={piece}
            reviews={reviewsList}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}
      </main>

      <Footer />

      <MasterpieceLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => {
          setIsLightboxOpen(false);
          setLightboxImage(null);
        }}
        imageUrl={lightboxImage || piece.imageUrl || piece.src}
        title={piece.title}
        description={piece.description}
      />

      {piece.isProduct && (
        <MasterpieceReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          piece={piece}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      <MasterpieceInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          setInquiryImage(null);
        }}
        piece={piece}
        activeImageUrl={inquiryImage}
        activeImageIndex={inquiryImageIndex}
      />

      <BespokeAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
