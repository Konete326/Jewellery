import React, { useState, useEffect } from 'react';
import { X, Star, Loader2, ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/google-icon';
import { galleryApi } from '@/api/galleryApi';
import { getAuthUser, loginWithGoogle } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function MasterpieceReviewModal({ isOpen, onClose, piece, onReviewSubmitted = () => {} }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser());
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleAuthChange = (e) => {
      setUser(e.detail || getAuthUser());
    };
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange);
  }, []);

  if (!isOpen || !piece) return null;

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const signedInUser = await loginWithGoogle();
      setUser(signedInUser);
      toast.success(`Welcome, ${signedInUser.name}!`, {
        description: 'You can now submit your rating'
      });
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google Sign-In Failed', {
          description: err.message || 'Unable to connect Google account.'
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit a review.');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    try {
      const reviewPayload = {
        userName: user.name || user.email?.split('@')[0] || 'Customer',
        userEmail: user.email || 'customer@example.com',
        rating,
        comment: comment.trim(),
        title: piece.title,
        imageUrl: piece.imageUrl || piece.src
      };

      await galleryApi.addReview(piece._id || piece.id, reviewPayload);

      try {
        const alertData = {
          id: Date.now(),
          pieceTitle: piece.title,
          pieceId: piece._id || piece.id,
          rating,
          userName: reviewPayload.userName,
          comment: reviewPayload.comment,
          time: new Date().toISOString()
        };
        localStorage.setItem('khalil_latest_review_alert', JSON.stringify(alertData));
        window.dispatchEvent(new CustomEvent('khalil_review_added', { detail: alertData }));
      } catch {}

      toast.success('Thank you! Your review has been recorded.');
      onReviewSubmitted(reviewPayload);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-5"
      >
        <div className="flex items-start justify-between border-b border-border pb-3.5">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Customer Feedback
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Rate This Piece
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {piece.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-5 rounded-xl bg-muted/40 border border-border/80 flex flex-col items-center text-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <LogIn className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Sign In to Rate</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Connect your account in 1 tap to leave a verified rating for this masterpiece.
              </p>
            </div>
            <Button
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2.5 h-11 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="size-4 animate-spin text-amber-500" />
              ) : (
                <GoogleIcon className="size-4 shrink-0" />
              )}
              <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </Button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/auth');
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              Or sign in with email & password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center py-2 gap-1.5 bg-muted/30 rounded-xl border border-border/60">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Select Your Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`size-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {rating === 5 ? 'Excellent (5/5)' :
                 rating === 4 ? 'Very Good (4/5)' :
                 rating === 3 ? 'Good (3/5)' :
                 rating === 2 ? 'Fair (2/5)' : 'Needs Improvement (1/5)'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                Your Review (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this jewellery design..."
                className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-amber-500/60 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-light pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-amber-700" />
                Verified Buyer
              </span>
              <span>Logged in as {user.name || user.email}</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={submitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest gap-2 font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-amber-500" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
