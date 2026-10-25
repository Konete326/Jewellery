import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gem, ShieldCheck, Truck } from 'lucide-react';
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
import { DEFAULT_SKIPER_IMAGES } from '../components/Skiper54';
import { PolaroidLineCarousel } from '@/components/ui/polaroid-line-carousel';
import { updatePageSEO, getProductSchema } from '@/utils/seo';

export function GalleryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [piece, setPiece] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [similarSlides, setSimilarSlides] = useState([]);

  useEffect(() => {
    const loadPiece = async () => {
      let found = DEFAULT_SKIPER_IMAGES.find(
        (img, idx) =>
          String(img._id) === String(id) ||
          String(idx + 1) === String(id) ||
          `default-${idx + 1}` === String(id)
      );

      let allItems = [...DEFAULT_SKIPER_IMAGES];

      try {
        const res = await galleryApi.getAll();
        if (res?.data && res.data.length > 0) {
          const dbItem = res.data.find(
            (item) => String(item._id) === String(id) || String(item.id) === String(id)
          );
          if (dbItem) {
            found = {
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
          }
          allItems = [...res.data, ...DEFAULT_SKIPER_IMAGES];
        }
      } catch {}

      if (!found) {
        found = DEFAULT_SKIPER_IMAGES[0];
      }

      setPiece(found);
      setReviewsList(found.reviews || []);

      updatePageSEO({
        title: found.title,
        description: found.description || `Discover ${found.title} - handcrafted certified 22K gold jewellery by Khalil & Sons Jewellers, Murshid Sunaar Tower, Saddar, Karachi.`,
        keywords: `${found.title}, ${found.category || 'Bridal Sets'}, gold jewellery Karachi, certified 22K gold, Pakistani jewellery, Khalil & Sons`,
        image: found.imageUrl || found.src,
        type: 'product',
        schema: getProductSchema(found)
      });

      const currentCat = (found.category || 'Bridal Sets').trim().toLowerCase();
      const currentId = String(found._id || found.id);

      const uniquePool = [];
      const seenIds = new Set([currentId]);

      for (const item of allItems) {
        const itemId = String(item._id || item.id);
        if (!seenIds.has(itemId)) {
          seenIds.add(itemId);
          uniquePool.push(item);
        }
      }

      const sameCategory = uniquePool.filter(
        (it) => it.category && it.category.trim().toLowerCase() === currentCat
      );
      const otherCategory = uniquePool.filter(
        (it) => !it.category || it.category.trim().toLowerCase() !== currentCat
      );

      const combinedSimilar = [...sameCategory, ...otherCategory].slice(0, 8);

      const formattedSlides = combinedSimilar.map((item) => ({
        id: item._id || item.id,
        image: item.imageUrl || item.src,
        title: item.title,
        caption: item.category || '22K Gold Masterpiece',
        category: item.category || 'Fine Jewellery',
        alt: item.title
      }));

      setSimilarSlides(formattedSlides);
    };

    loadPiece();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!piece) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-neutral-300 border-t-[#2d3435] animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={0}
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
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-700 hover:text-amber-800 transition-colors cursor-pointer group py-1"
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
        />

        <div className="w-full pt-10 pb-6 border-t border-neutral-200/80">
          {similarSlides.length > 0 && (
            <div className="w-full mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#5f5e5e] font-mono font-medium block mb-1">
                    Curated Collection • {piece.category || 'Fine Jewellery'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#2d3435]">
                    Similar Masterpieces
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Drag line or click to inspect
                </span>
              </div>

              <div className="w-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-gradient-to-b from-[#f5f2ea]/50 via-white to-transparent shadow-xs">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700">
                <Gem className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#2d3435]">Handmade Quality</h4>
                <p className="text-xs text-[#5a6061] font-light mt-1 leading-relaxed">
                  Each piece is handcrafted by master jewelers at Khalil & Sons, Karachi and comes with a certificate of authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#2d3435]">Lifetime Guarantee</h4>
                <p className="text-xs text-[#5a6061] font-light mt-1 leading-relaxed">
                  Free lifetime cleaning, gold polishing, and inspection for your jewellery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700">
                <Truck className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#2d3435]">Secure Insured Shipping</h4>
                <p className="text-xs text-[#5a6061] font-light mt-1 leading-relaxed">
                  Safe and fully insured worldwide delivery in our signature luxury gift box.
                </p>
              </div>
            </div>
          </div>
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
        items={[]}
      />
    </div>
  );
}
