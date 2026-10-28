import React, { useState, useEffect } from 'react';
import { X, Star, Trash2, RefreshCw, MessageSquare, Gem, CheckCircle2 } from 'lucide-react';
import { galleryApi } from '@/api/galleryApi';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Button } from '@/components/ui/button';
import { PatronMonogram } from '@/components/ui/PatronMonogram';
import { toast } from 'sonner';

export function ProductReviewsModal({ isOpen, onClose, item, onReviewUpdated }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const pieceId = item?._id || item?.id;

  const loadProductReviews = async () => {
    if (!pieceId) return;
    setLoading(true);
    try {
      const res = await galleryApi.getById(pieceId);
      const pieceData = res?.data;
      if (pieceData && Array.isArray(pieceData.reviews)) {
        setReviews(pieceData.reviews);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews(item?.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && pieceId) {
      loadProductReviews();
    }
  }, [isOpen, pieceId]);

  if (!isOpen || !item) return null;

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId || !pieceId) return;
    setDeletingId(reviewId);
    try {
      await galleryApi.deleteReview(pieceId, reviewId);
      toast.success('Review removed successfully');
      const updated = reviews.filter((r) => String(r._id) !== String(reviewId));
      setReviews(updated);
      if (onReviewUpdated) {
        onReviewUpdated(pieceId, updated);
      }
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
      : '0.0';

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/80">
          <div className="flex items-center gap-3 min-w-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="size-12 rounded-xl object-cover border border-border/80 shrink-0"
              />
            ) : (
              <div className="size-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border/80 flex items-center justify-center text-foreground shrink-0">
                <Gem className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                {item.category || 'Fine Jewellery'}
              </span>
              <h3 className="font-serif text-base font-semibold text-foreground truncate mt-1">
                {item.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadProductReviews}
              disabled={loading}
              className="text-xs h-8 px-2.5 gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 bg-muted/20 border-b border-border/80">
          <div className="p-3 rounded-xl bg-background border border-border/70 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Average Rating
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Star className="size-4 fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100" />
              <span className="text-lg font-serif font-bold text-foreground">
                {averageRating}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background border border-border/70 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Verified Appraisals
            </span>
            <span className="text-lg font-serif font-bold text-foreground mt-1 block">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="py-14 flex items-center justify-center">
              <LumaSpin size={28} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-xl flex flex-col items-center justify-center px-4">
              <MessageSquare className="size-8 text-muted-foreground/40 mb-2" />
              <h4 className="text-sm font-medium text-foreground">No appraisals recorded</h4>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                This masterpiece currently has no client reviews. When collectors review this piece online or in-store, they will show here in real-time.
              </p>
            </div>
          ) : (
            reviews.map((rev) => {
              const ratingNum = Number(rev.rating) || 5;
              const isDeleting = deletingId === rev._id;

              return (
                <div
                  key={rev._id}
                  className="p-4 rounded-xl border border-border/80 bg-background flex flex-col justify-between space-y-2.5 shadow-2xs hover:border-foreground/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PatronMonogram name={rev.userName} size="size-7" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-foreground truncate">
                            {rev.userName || 'Valued Patron'}
                          </span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="size-2.5" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono block mt-0.5 truncate">
                          {rev.userEmail || 'In-store client'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3 ${
                            s <= ratingNum
                              ? 'fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && (
                    <h5 className="text-xs font-semibold text-foreground">
                      {rev.title}
                    </h5>
                  )}

                  {rev.comment && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed bg-muted/30 p-2.5 rounded-lg">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(rev.createdAt)}
                    </span>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteReview(rev._id)}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete this appraisal"
                    >
                      <Trash2 className="size-3" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3.5 border-t border-border/80 bg-muted/20 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
