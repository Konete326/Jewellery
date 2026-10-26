import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Gem,
  Search,
  Filter,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { MasterpieceReviewModal } from '../components/MasterpieceReviewModal';
import InkHeadline from '@/components/ui/ink-headline';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import TestimonialSection2 from '@/components/ui/testimonial-section-2';
import { LumaSpin } from '@/components/ui/luma-spin';
import { galleryApi } from '@/api/galleryApi';
import { updatePageSEO } from '@/utils/seo';

const fallbackAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
];

export function ReviewsPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [reviewingPiece, setReviewingPiece] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    updatePageSEO({
      title: 'Client Reviews & Masterpiece Appraisals | Khalil & Sons Jewellers',
      description: 'Read authentic client evaluations and certified gold appraisals for bridal sets, bangles, and diamond jewelry from Khalil & Sons, Saddar, Karachi.',
      keywords: 'Khalil & Sons reviews, customer testimonials gold jewelry, bridal jewelry appraisals Karachi'
    });
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAllReviews();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setReviews(list);
    } catch {
      try {
        const fallback = await galleryApi.getRecentReviews(30);
        setReviews(fallback?.data || []);
      } catch {
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const heroTestimonials = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [
        {
          quote: "The bridal choker crafted by Khalil & Sons has the most exquisite 22K gold craftsmanship. Truly a family heirloom for generations.",
          name: "Ayesha Malik",
          designation: "5★ Appraisal • Karachi",
          src: fallbackAvatars[0],
          productTitle: "Royal Heritage Nizam Kundan Choker",
          productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
        },
        {
          quote: "Their transparency with gold hallmarks and certificate of authenticity gives unmatched peace of mind. Exceptional boutique service in Saddar.",
          name: "Dr. Farhan Siddiqui",
          designation: "5★ Appraisal • Diamond Collector",
          src: fallbackAvatars[1],
          productTitle: "Artisanal Solitaire Diamond Band",
          productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
        },
        {
          quote: "Our customized bridal bangles were delivered well ahead of the wedding date. The delicate meenakari detailing is mesmerizing.",
          name: "Zainab Raza",
          designation: "5★ Appraisal • Bridal Patron",
          src: fallbackAvatars[2],
          productTitle: "Mughal Polki Heritage Bangles",
          productImage: "https://images.unsplash.com/photo-1611591475878-a400f9152b12?auto=format&fit=crop&w=400&q=80"
        }
      ];
    }

    return reviews.slice(0, 10).map((r, idx) => ({
      quote: r.comment || "Exceptional gold purity and immaculate bespoke craftsmanship.",
      name: r.userName || "Verified Patron",
      designation: `${r.rating}★ Appraisal • ${r.masterpieceCategory || 'Heritage Jewelry'}`,
      src: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      productTitle: r.masterpieceTitle,
      productImage: r.masterpieceImage,
      productId: r.masterpieceId,
      rating: r.rating
    }));
  }, [reviews]);

  const marqueeTestimonials = useMemo(() => {
    if (!reviews || reviews.length < 6) return undefined;
    return reviews.map((r, idx) => ({
      id: r._id || String(idx),
      name: r.userName || "Patron",
      role: `${r.rating}★ • ${r.masterpieceTitle || 'Fine Jewelry'}`,
      image: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      quote: r.comment || "Timeless heirloom craftsmanship crafted with certified authenticity.",
      productTitle: r.masterpieceTitle,
      productImage: r.masterpieceImage,
      productId: r.masterpieceId
    }));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (rev.userName && rev.userName.toLowerCase().includes(q)) ||
        (rev.comment && rev.comment.toLowerCase().includes(q)) ||
        (rev.masterpieceTitle && rev.masterpieceTitle.toLowerCase().includes(q)) ||
        (rev.masterpieceCategory && rev.masterpieceCategory.toLowerCase().includes(q));

      const matchesRating =
        ratingFilter === 'All' || Number(rev.rating) === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const handleReviewThisPiece = (rev) => {
    if (rev.masterpieceId) {
      setReviewingPiece({
        _id: rev.masterpieceId,
        title: rev.masterpieceTitle,
        imageUrl: rev.masterpieceImage
      });
      setIsReviewModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={0}
      />

      <section className="relative z-10 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-mono tracking-widest uppercase mb-4">
            <Gem className="size-3.5 text-amber-600" />
            <span>Patron Evaluations</span>
          </div>
          <InkHeadline
            as="h1"
            by="word"
            trigger="inView"
            duration={1600}
            stagger={200}
            inkColor="#2d3435"
            className="font-headline text-3xl sm:text-5xl lg:text-6xl font-light text-[#2d3435] leading-tight mb-4"
          >
            Client Reviews & Appraisals
          </InkHeadline>
          <p className="text-sm sm:text-base text-[#5a6061] font-light max-w-xl mx-auto leading-relaxed">
            Discover firsthand reflections of trust, gold certification, and bridal artistry from patrons who wear Khalil & Sons creations.
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 border border-neutral-200/80 p-4 sm:p-8 backdrop-blur-xs shadow-xs mb-8">
          <CircularTestimonials
            testimonials={heroTestimonials}
            autoplay={true}
            colors={{
              name: "#1c1917",
              designation: "#b45309",
              testimony: "#44403c",
              arrowBackground: "#1c1917",
              arrowForeground: "#fef3c7",
              arrowHoverBackground: "#b45309"
            }}
          />
        </div>
      </section>

      <section className="w-full">
        <TestimonialSection2
          testimonials={marqueeTestimonials}
          title="The Wall of Patron Trust"
          subtitle="Click on any client capsule to explore their full testimonial and the exact jewellery piece reviewed."
        />
      </section>

      <main className="relative z-10 py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-700 block mb-1">
              Complete Archive
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2d3435]">
              Every Verified Evaluation ({reviews.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by patron or piece..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-full border border-neutral-300 bg-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs">
              {['All', '5', '4'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRatingFilter(val)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    ratingFilter === val
                      ? 'bg-white shadow-xs text-[#2d3435] font-medium'
                      : 'text-neutral-500 hover:text-[#2d3435]'
                  }`}
                >
                  {val === 'All' ? 'All Stars' : `${val} ★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <LumaSpin variant="amber" size={28} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 p-8 rounded-3xl bg-white border border-neutral-200 text-center max-w-md mx-auto flex flex-col items-center justify-center space-y-4 shadow-xs">
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <MessageSquare className="size-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-medium text-[#2d3435]">No Matching Reviews</h3>
              <p className="text-xs text-[#5a6061] font-light mt-1">
                Try searching for a different jewellery design or reset your filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev, idx) => {
              const rating = Number(rev.rating) || 5;

              return (
                <div
                  key={rev._id || idx}
                  className="rounded-2xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-lg transition-[box-shadow,border-color] duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                      {rev.masterpieceImage ? (
                        <img
                          src={rev.masterpieceImage}
                          alt={rev.masterpieceTitle || 'Masterpiece'}
                          className="size-16 rounded-xl object-cover border border-neutral-200 shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="size-16 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                          <Gem className="size-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block truncate">
                          {rev.masterpieceCategory || 'Jewellery Masterpiece'}
                        </span>
                        <h3 className="font-serif text-sm font-medium text-[#2d3435] truncate">
                          {rev.masterpieceTitle || 'Handcrafted Jewellery'}
                        </h3>
                        {rev.masterpieceId && (
                          <Link
                            to={`/gallery/${rev.masterpieceId}`}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-900 font-medium mt-0.5"
                          >
                            <span>Inspect Design</span>
                            <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-xs text-[#2d3435] block">
                          {rev.userName || 'Anonymous Patron'}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3.5 ${
                              s <= rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-[#5a6061] font-light leading-relaxed italic bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="p-3.5 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                      <ShieldCheck className="size-3.5" />
                      <span>Verified Atelier Review</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleReviewThisPiece(rev)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>Add Appraisal</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
        items={[]}
      />

      <MasterpieceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingPiece(null);
        }}
        piece={reviewingPiece}
        onReviewSubmitted={() => {
          loadReviews();
          setIsReviewModalOpen(false);
        }}
      />
    </div>
  );
}
