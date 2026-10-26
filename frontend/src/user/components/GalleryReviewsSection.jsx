import React from 'react';
import { Star, ShieldCheck, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GalleryReviewsSection({ piece, reviews = [], onOpenReviewModal }) {
  const displayReviews = (reviews && reviews.length > 0)
    ? reviews
    : (piece?.reviews && piece.reviews.length > 0)
      ? piece.reviews
      : [];

  return (
    <section className="w-full pt-10 pb-6 border-t border-neutral-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#5f5e5e] font-medium block mb-1">
            Customer Reviews
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl text-[#2d3435] font-light">
            Customer <span className="serif-italic">Reviews & Ratings</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenReviewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-amber-600/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs uppercase tracking-wider font-medium text-amber-900 dark:text-amber-300 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {displayReviews.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/70 border border-neutral-200/80 text-center flex flex-col items-center justify-center space-y-3">
          <div className="size-12 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-900 text-xs font-serif font-medium mb-2">
              <Sparkles className="size-3 text-amber-600" />
              <span>Awaiting First Appraisal</span>
            </div>
            <h4 className="font-serif text-base font-medium text-[#2d3435]">Atelier Premier Creation</h4>
            <p className="text-xs text-[#5a6061] font-light mt-1 max-w-md">
              This handcrafted masterpiece has recently been unveiled from our Saddar atelier. Be the first patron to share your certified appraisal.
            </p>
          </div>
          <Button
            onClick={onOpenReviewModal}
            size="sm"
            className="text-xs uppercase tracking-wider font-medium mt-2 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
          >
            Submit First Appraisal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayReviews.map((rev, idx) => {
            const revRating = Number(rev.rating) || 5;
            const showStars = revRating >= 4;

            return (
              <div
                key={rev._id || idx}
                className="p-5 rounded-2xl bg-white border border-neutral-200/70 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-medium text-[#2d3435]">
                      {rev.userName || 'Verified Customer'}
                    </span>
                    {showStars ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${
                              s <= revRating
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

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="size-3" />
                    <span>Verified Buyer</span>
                  </span>
                  <span>
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Customer Review'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
