import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { galleryApi } from '@/api/galleryApi';
import { Button } from '@/components/ui/button';

export function AdminReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getRecentReviews(20);
      if (res?.data) {
        setReviews(res.data);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();

    const handleNewReview = () => loadReviews();
    window.addEventListener('khalil_review_added', handleNewReview);
    return () => window.removeEventListener('khalil_review_added', handleNewReview);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-serif text-base font-semibold text-foreground">
            Patron Appraisals & Ratings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time evaluations submitted by collectors on gallery masterpieces
          </p>
        </div>
        <Button
          onClick={loadReviews}
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground">
          Synchronizing archival appraisals...
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
          <MessageSquare className="size-6 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">No patron appraisals recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev, idx) => {
            const rating = Number(rev.rating) || 5;

            return (
              <div
                key={rev._id || idx}
                className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {rev.masterpieceImage && (
                    <img
                      src={rev.masterpieceImage}
                      alt={rev.masterpieceTitle}
                      className="size-12 rounded-lg object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-foreground truncate">
                        {rev.masterpieceTitle || 'Masterpiece'}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${
                              s <= rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      By <span className="text-foreground font-medium">{rev.userName}</span> ({rev.userEmail})
                    </p>
                    {rev.comment && (
                      <p className="text-xs text-foreground/80 italic mt-1 line-clamp-2">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground shrink-0 text-right">
                  <span className="flex items-center gap-1 text-emerald-600 justify-end mb-1">
                    <ShieldCheck className="size-3" />
                    <span>Verified</span>
                  </span>
                  <span>
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString()
                      : 'Recent'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
