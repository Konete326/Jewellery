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
import { PolaroidLineCarousel } from '@/components/ui/polaroid-line-carousel';
import { updatePageSEO, getProductSchema } from '@/utils/seo';
import { LuxuryButton } from '../components/LuxuryButton';
import { LumaSpin } from '@/components/ui/luma-spin';
import { broadcastCartUpdate, subscribeToTabSync } from '@/utils/tabSync';
import { getEstimatedPiecePrice, sanitizeQuantity } from '@/utils/pricing';
import { toast } from 'sonner';

export function GalleryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('khalil_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [piece, setPiece] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [similarSlides, setSimilarSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPiece = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await galleryApi.getAll();
        if (!isMounted) return;

        const allItems = Array.isArray(res?.data) ? res.data : [];
        const dbItem = allItems.find(
          (item) => String(item._id) === String(id) || String(item.id) === String(id)
        );

        if (dbItem) {
          const itemPayload = {
            _id: dbItem._id,
            id: dbItem._id,
            title: dbItem.title,
            category: dbItem.category || 'Bridal Sets',
            description: dbItem.description,
            imageUrl: dbItem.imageUrl,
            averageRating: dbItem.averageRating || 0,
            reviewCount: dbItem.reviewCount || 0,
            reviews: dbItem.reviews || []
          };

          setPiece(itemPayload);
          setReviewsList(itemPayload.reviews);

          updatePageSEO({
            title: itemPayload.title,
            description: itemPayload.description || `Discover ${itemPayload.title} - handcrafted certified 22K, 21K and 18K gold jewellery by Khalil & Sons Jewellers, Murshid Sunaar Tower, Saddar, Karachi.`,
            keywords: `${itemPayload.title}, ${itemPayload.category || 'Bridal Sets'}, gold jewellery Karachi, certified 22K 21K 18K gold, Pakistani jewellery, Khalil & Sons`,
            image: itemPayload.imageUrl,
            type: 'product',
            schema: getProductSchema(itemPayload)
          });

          const currentCat = (itemPayload.category || 'Bridal Sets').trim().toLowerCase();
          const currentId = String(itemPayload._id || itemPayload.id);

          const otherItems = allItems.filter(
            (it) => String(it._id || it.id) !== currentId && (it.imageUrl || it.src)
          );

          const sameCategory = otherItems.filter(
            (it) => it.category && it.category.trim().toLowerCase() === currentCat
          );
          const diffCategory = otherItems.filter(
            (it) => !it.category || it.category.trim().toLowerCase() !== currentCat
          );

          const combined = [...sameCategory, ...diffCategory].slice(0, 8);
          const formattedSlides = combined.map((item) => ({
            id: item._id || item.id,
            image: item.imageUrl || item.src,
            title: item.title,
            caption: item.category || '22K Gold Masterpiece',
            category: item.category || 'Fine Jewellery',
            alt: item.title
          }));

          setSimilarSlides(formattedSlides);
        } else {
          setPiece(null);
          setNotFound(true);
        }
      } catch {
        if (isMounted) {
          setPiece(null);
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPiece();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleReviewSubmitted = (newReview) => {
    setReviewsList((prev) => [newReview, ...prev]);
    setPiece((prev) => {
      if (!prev) return prev;
      const updatedReviews = [newReview, ...(prev.reviews || [])];
      const newCount = updatedReviews.length;
      const totalScore = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
      const newAverage = Number((totalScore / newCount).toFixed(1));
      return {
        ...prev,
        reviews: updatedReviews,
        reviewCount: newCount,
        averageRating: newAverage
      };
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems));
      const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      broadcastCartUpdate(count, cartItems);
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        setCartItems(data.items);
      }
    });
    return unsubscribe;
  }, []);

  const handleAddToCart = (itemToAdd = piece) => {
    if (!itemToAdd) return;
    const pieceId = itemToAdd._id || itemToAdd.id;
    const pricing = getEstimatedPiecePrice(itemToAdd);

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(pieceId));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(pieceId) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: pieceId,
          name: itemToAdd.title || 'Fine Jewellery Piece',
          category: itemToAdd.category || 'Fine Jewellery',
          image: itemToAdd.imageUrl || itemToAdd.src || '/assets/products/choker-ruby-01.jpg',
          numericPrice: pricing.numericPrice,
          price: pricing.formattedPrice,
          quantity: 1,
          material: pricing.purity
        }
      ];
    });

    toast.success(`${itemToAdd.title || 'Masterpiece'} added to your bag`, {
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
          <h2 className="font-headline text-3xl font-light mb-3">Piece Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
            The requested jewellery masterpiece is no longer in our active exhibition or has been updated in the atelier.
          </p>
          <LuxuryButton onClick={() => navigate('/gallery')} variant="dark">
            Return to Gallery
          </LuxuryButton>
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
            <Link to="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[220px] sm:max-w-xs">{piece.title}</span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/gallery');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer group py-1"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Collection</span>
          </button>
        </div>

        <GalleryMasterpieceHero
          piece={piece}
          onOpenLightbox={() => setIsLightboxOpen(true)}
          onOpenReview={() => setIsReviewModalOpen(true)}
          onOpenInquiry={() => setIsInquiryModalOpen(true)}
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
                    Similar Masterpieces
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Drag line or click to inspect
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

        <GalleryReviewsSection
          piece={piece}
          reviews={reviewsList}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />
      </main>

      <Footer />

      <MasterpieceLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={piece.imageUrl || piece.src}
        title={piece.title}
        description={piece.description}
      />

      <MasterpieceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        piece={piece}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <MasterpieceInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        piece={piece}
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
