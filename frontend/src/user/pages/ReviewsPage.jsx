import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight, MessageSquare, Gem } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { galleryApi } from '@/api/galleryApi';

export function ReviewsPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await galleryApi.getRecentReviews(30);
        if (res?.data) {
          setReviews(res.data);
        }
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={0}
      />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1880px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Gem className="size-3.5 text-amber-600" />
            <span>Customer Reviews</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-light text-[#2d3435] leading-tight mb-4">
            Customer <span className="serif-italic">Reviews & Ratings</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5a6061] font-light max-w-xl mx-auto leading-relaxed">
            Real feedback and ratings from customers who purchased our handcrafted jewellery.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="size-8 rounded-full border-2 border-neutral-300 border-t-[#2d3435] animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 p-8 rounded-3xl bg-white border border-neutral-200/80 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4 shadow-xs">
            <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <MessageSquare className="size-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2d3435]">No Reviews Yet</h3>
              <p className="text-xs text-[#5a6061] font-light mt-1">
                Customer ratings and reviews will appear here once submitted.
              </p>
            </div>
            <button
              onClick={() => navigate('/gallery')}
              className="px-6 py-2.5 rounded-full bg-[#2d3435] text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => {
              const rating = Number(rev.rating) || 5;
              const showStars = rating >= 4;

              return (
                <div
                  key={rev._id || idx}
                  className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                      {rev.masterpieceImage && (
                        <img
                          src={rev.masterpieceImage}
                          alt={rev.masterpieceTitle || 'Masterpiece'}
                          className="size-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block">
                          Jewellery Piece
                        </span>
                        <h3 className="font-serif text-sm font-medium text-[#2d3435] truncate">
                          {rev.masterpieceTitle || 'Handmade Jewellery'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-[#2d3435]">
                        {rev.userName || 'Anonymous Customer'}
                      </span>
                      {showStars ? (
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
                      ) : null}
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-[#5a6061] font-light leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                      <ShieldCheck className="size-3.5" />
                      <span>Verified Customer</span>
                    </span>
                    {rev.masterpieceId && (
                      <button
                        onClick={() => navigate(`/gallery/${rev.masterpieceId}`)}
                        className="inline-flex items-center gap-1 text-xs text-[#2d3435] hover:text-amber-700 font-medium cursor-pointer"
                      >
                        <span>View Piece</span>
                        <ArrowRight className="size-3" />
                      </button>
                    )}
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
    </div>
  );
}
