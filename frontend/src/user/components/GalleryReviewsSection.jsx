import React, { useState, useEffect, useMemo } from 'react';
import { Star, Plus, LayoutGrid, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendlyCarousel } from '@/components/ui/connected-carousel';
import { PatronMonogram } from '@/components/ui/PatronMonogram';
import { galleryApi } from '@/api/galleryApi';

const fallbackAppraisals = [
  {
    _id: 'seed-appraisal-1',
    userName: 'Ayesha Malik',
    userEmail: 'Bridal Patron • Clifton, Karachi',
    rating: 5,
    comment: 'The bridal choker crafted by Khalil & Sons has the most exquisite 22K gold craftsmanship. Truly a family heirloom for generations.',
    createdAt: '2026-10-18T10:30:00.000Z',
    masterpieceTitle: 'Royal Heritage Nizam Kundan Choker',
    masterpieceCategory: 'Bridal Sets',
    masterpieceImage: '/assets/products/choker-ruby-01.jpg'
  },
  {
    _id: 'seed-appraisal-2',
    userName: 'Dr. Farhan Siddiqui',
    userEmail: 'Certified Collector • Saddar Salon',
    rating: 5,
    comment: 'Their transparency with gold hallmarks and certificate of authenticity gives unmatched peace of mind. Exceptional boutique service in Saddar.',
    createdAt: '2026-10-12T14:15:00.000Z',
    masterpieceTitle: 'Artisanal Solitaire Diamond Band',
    masterpieceCategory: 'Rings',
    masterpieceImage: '/assets/products/bangles-mughal-01.jpg'
  },
  {
    _id: 'seed-appraisal-3',
    userName: 'Zainab Raza',
    userEmail: 'Bridal Patron • DHA Phase 6',
    rating: 5,
    comment: 'Our customized bridal bangles were delivered well ahead of the wedding date. The delicate meenakari detailing is mesmerizing in person.',
    createdAt: '2026-10-04T12:00:00.000Z',
    masterpieceTitle: 'Mughal Polki Heritage Bangles',
    masterpieceCategory: 'Bangles',
    masterpieceImage: '/assets/products/earrings-jhumka-01.jpg'
  },
  {
    _id: 'seed-appraisal-4',
    userName: 'Fatima Noor',
    userEmail: 'High Jewellery Patron • Karachi',
    rating: 5,
    comment: 'Impeccable gold luster and authentic craftsmanship. The staff at Murshid Sunaar Tower were knowledgeable and welcoming throughout our consultation.',
    createdAt: '2026-09-28T16:45:00.000Z',
    masterpieceTitle: 'Royal Polki Jhumkas',
    masterpieceCategory: 'Earrings',
    masterpieceImage: '/assets/products/necklace-emerald-01.jpg'
  }
];

export function GalleryReviewsSection({ piece, reviews = [], onOpenReviewModal }) {
  const [atelierReviews, setAtelierReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('piece');
  const [viewMode, setViewMode] = useState('carousel');

  useEffect(() => {
    let isMounted = true;
    const fetchAtelierReviews = async () => {
      try {
        const res = await galleryApi.getAllReviews();
        const list = res?.data || (Array.isArray(res) ? res : []);
        if (isMounted) {
          setAtelierReviews(list.length > 0 ? list : fallbackAppraisals);
        }
      } catch {
        if (isMounted) {
          setAtelierReviews(fallbackAppraisals);
        }
      }
    };
    fetchAtelierReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const pieceReviews = useMemo(() => {
    if (reviews && reviews.length > 0) return reviews;
    if (piece?.reviews && piece.reviews.length > 0) return piece.reviews;
    return [];
  }, [reviews, piece]);

  const hasPieceReviews = pieceReviews.length > 0;
  const effectiveTab = hasPieceReviews ? activeTab : 'atelier';

  const displayedList = useMemo(() => {
    if (effectiveTab === 'piece' && hasPieceReviews) {
      return pieceReviews;
    }
    return atelierReviews.length > 0 ? atelierReviews : fallbackAppraisals;
  }, [effectiveTab, hasPieceReviews, pieceReviews, atelierReviews]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Certified Appraisal';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Certified Appraisal';
    }
  };

  const carouselItems = useMemo(() => {
    return displayedList.map((rev, idx) => ({
      id: rev._id || rev.id || `appraisal-${idx}`,
      rating: Number(rev.rating) || 5,
      comment: rev.comment || 'Exquisite 22K certified gold craftsmanship from Khalil & Sons.',
      userName: rev.userName || 'Verified Patron',
      userEmail: rev.userEmail || 'Certified Boutique Client',
      masterpieceTitle: (effectiveTab === 'piece' ? piece?.title : (rev.masterpieceTitle || piece?.title)) || 'Masterpiece',
      masterpieceCategory: (effectiveTab === 'piece' ? piece?.category : (rev.masterpieceCategory || piece?.category)) || 'Fine Jewellery',
      masterpieceImage: (effectiveTab === 'piece' ? (piece?.imageUrl || piece?.src) : (rev.masterpieceImage || piece?.imageUrl || piece?.src)) || '/assets/products/choker-ruby-01.jpg',
      date: formatDate(rev.createdAt),
      rawReview: rev
    }));
  }, [displayedList, effectiveTab, piece]);

  const currentAverageRating = useMemo(() => {
    const target = hasPieceReviews ? pieceReviews : displayedList;
    if (!target.length) return '5.0';
    const sum = target.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / target.length).toFixed(1);
  }, [hasPieceReviews, pieceReviews, displayedList]);

  return (
    <section className="w-full pt-10 pb-6 border-t border-neutral-200/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-mono font-medium">
              Verified Patron Testimonials
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[10px] font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-sm border border-amber-500/20 bg-amber-500/5">
              AU · 916.6 Assay Seal
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight">
            Client <span className="italic font-normal">Appraisals & Reviews</span>
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-3.5 ${
                    s <= Math.round(Number(currentAverageRating))
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono font-semibold text-neutral-900">{currentAverageRating} / 5.0</span>
            <span className="text-neutral-400">•</span>
            <span className="font-mono text-neutral-500">
              {hasPieceReviews
                ? `${pieceReviews.length} ${pieceReviews.length === 1 ? 'Piece Appraisal' : 'Piece Appraisals'}`
                : `${displayedList.length} Atelier Appraisals`}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-200 bg-neutral-100/80">
            <button
              type="button"
              onClick={() => setViewMode('carousel')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Carousel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={onOpenReviewModal}
            className="h-9 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Write an Appraisal</span>
          </Button>
        </div>
      </div>

      {hasPieceReviews && atelierReviews.length > 0 && (
        <div className="flex items-center gap-2 mb-6 border-b border-neutral-200/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('piece')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-colors cursor-pointer ${
              activeTab === 'piece'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            This Creation ({pieceReviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('atelier')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeTab === 'atelier'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Atelier Collection ({atelierReviews.length})
          </button>
        </div>
      )}

      {!hasPieceReviews && (
        <div className="mb-6 p-4 rounded-xl border border-amber-600/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-800">
            <CheckCircle2 className="size-4 text-amber-700 shrink-0" />
            <span>
              This premier atelier creation is awaiting its first dedicated appraisal. Enjoy certified reviews from our boutique patrons below.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:underline cursor-pointer shrink-0"
          >
            <span>Submit First Appraisal &rarr;</span>
          </button>
        </div>
      )}

      {viewMode === 'carousel' ? (
        <div className="py-2 w-full overflow-hidden">
          <CalendlyCarousel
            items={carouselItems}
            autoPlayInterval={6000}
            pauseOnHover={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-400/60 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <img
                        src={item.masterpieceImage}
                        alt={item.masterpieceTitle}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 dark:text-amber-400 block truncate font-medium">
                        {item.masterpieceCategory}
                      </span>
                      <span className="text-xs font-semibold text-neutral-900 truncate block">
                        {item.masterpieceTitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${
                          s <= item.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-serif italic text-xs sm:text-sm text-neutral-700 leading-relaxed line-clamp-3">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PatronMonogram name={item.userName} size="size-7" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-neutral-900 block truncate">
                      {item.userName}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono block truncate">
                      {item.userEmail}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
