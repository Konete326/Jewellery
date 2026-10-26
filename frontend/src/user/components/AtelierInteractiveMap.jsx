import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Star, Gem, Copy, Check } from 'lucide-react';
import { GooglePlaceReviewBadge } from '@/user/components/GooglePlaceReviewBadge';
import { STORE_INFO } from '@/constants/storeInfo';
import { toast } from 'sonner';

export function AtelierInteractiveMap({ onOpenAppointment }) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(STORE_INFO.address.full);
      setCopied(true);
      toast.success('Boutique address copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Unable to copy address');
    }
  };

  return (
    <section className="w-full mt-10">
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider mb-2">
              <Gem className="size-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>Historic Jewellery Quarter</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
              Visit Our Saddar Atelier & Showroom
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
              Located in Murshid Sunaar Tower near Regal Chowk, Saddar, Karachi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <GooglePlaceReviewBadge variant="button" />

            <a
              href={STORE_INFO.social.googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Navigation className="size-3.5 text-amber-400" />
              <span>Get Directions</span>
              <ExternalLink className="size-3 text-neutral-400" />
            </a>
          </div>
        </div>

        <GooglePlaceReviewBadge variant="card" />

        <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-border shadow-xs bg-muted/40">
          <iframe
            src={STORE_INFO.social.googleMapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Khalil & Sons Jewellers Location on Google Maps"
            className="w-full h-full"
          />

          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 p-4 rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-sm font-semibold text-foreground">
                      Khalil & Sons Jewellers
                    </h4>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-foreground text-[10px] font-mono font-medium">
                      <Star className="size-2.5 fill-amber-400 text-amber-400" />
                      5.0
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {STORE_INFO.address.full}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0"
                title="Copy address"
              >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/80">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="size-3 text-neutral-500" />
                <span>Mon – Sat: 1:00 PM – 8:30 PM</span>
              </div>

              {onOpenAppointment && (
                <button
                  type="button"
                  onClick={onOpenAppointment}
                  className="text-xs text-foreground hover:underline font-medium cursor-pointer"
                >
                  Book Private Viewing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
