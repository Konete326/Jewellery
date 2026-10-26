import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Gem, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/google-icon';
import { submitInquiry } from '@/api/inquiryApi';
import { normalizePhoneToE164 } from '@/utils/phone';
import { getAuthUser, loginWithGoogle } from '@/lib/auth';
import { toast } from 'sonner';

export function MasterpieceInquiryModal({ isOpen, onClose, piece }) {
  const [user, setUser] = useState(getAuthUser());
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState(
    piece
      ? `Hello, I am interested in this piece: ${piece.title}. Please provide details on price, availability, and ordering.`
      : ''
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const current = getAuthUser();
    setUser(current);
    if (current) {
      if (!customerName) setCustomerName(current.name || '');
      if (!email) setEmail(current.email || '');
    }
  }, [isOpen]);

  if (!isOpen || !piece) return null;

  const handleGoogleAutofill = async () => {
    try {
      setGoogleLoading(true);
      const signedIn = await loginWithGoogle();
      setUser(signedIn);
      setCustomerName(signedIn.name || '');
      setEmail(signedIn.email || '');
      toast.success(`Autofilled as ${signedIn.name}`);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google connection failed', {
          description: err.message || 'Unable to connect Google account'
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim()) {
      toast.error('Please enter your name and email address.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        customerName: customerName.trim(),
        email: email.trim(),
        phone: normalizePhoneToE164(phone.trim()),
        subject: `Inquiry: ${piece.title}`,
        message: `${message.trim()}\n\n[Reference ID: ${piece._id || piece.id}]`,
        jewelryType: piece.category || 'Bridal Sets',
        preferredMetal: '22K Gold',
        estimatedBudget: 'Consultation'
      });

      toast.success('Your inquiry has been sent! We will contact you soon.');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry.');
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
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-4"
      >
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <Gem className="size-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                Product Inquiry
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Ask About This Piece
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
          <img
            src={piece.imageUrl || piece.src}
            alt={piece.title}
            className="size-14 rounded-lg object-cover border border-border"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-sm font-medium text-foreground line-clamp-1">
              {piece.title}
            </h4>
            <p className="text-[11px] text-muted-foreground font-light line-clamp-1">
              {piece.description}
            </p>
          </div>
        </div>

        {!user && (
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-2">
              <GoogleIcon className="size-4 shrink-0" />
              <span className="text-xs text-foreground font-medium">
                Sign in with Google to autofill your details
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={googleLoading}
              onClick={handleGoogleAutofill}
              className="h-7 text-[11px] px-2.5 font-medium cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="size-3 animate-spin mr-1" />
              ) : null}
              <span>1-Tap Autofill</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full bg-muted/30 border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@domain.com"
                className="w-full bg-muted/30 border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              WhatsApp / Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 314 2004245"
              className="w-full bg-muted/30 border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Custom Inquiry Notes
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-muted/30 border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-amber-500/60 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Direct Atelier Dispatch
            </span>
            <div className="flex items-center gap-2">
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
                className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest gap-1.5 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-amber-500" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5 text-amber-500" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
