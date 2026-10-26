import React from 'react';
import { MapPin, Navigation, Star, ExternalLink, HeartHandshake } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';
import { GooglePlaceReviewBadge } from '@/user/components/GooglePlaceReviewBadge';

export function AtelierMapEmbed() {
  const reviewUrl = STORE_INFO.social.googleReviewUrl || 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7';

  return (
    <section className="w-full mt-10">
      <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <MapPin className="size-4" />
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-foreground tracking-tight">
                Boutique Location & Directions
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Visit our master goldsmithing salon in Murshid Sunaar Tower, Saddar, Karachi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <GooglePlaceReviewBadge variant="button" />

            <a
              href={STORE_INFO.social.googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Navigation className="size-3.5 text-amber-400" />
              <span>Get Driving Directions</span>
              <ExternalLink className="size-3 text-neutral-400" />
            </a>
          </div>
        </div>

        <GooglePlaceReviewBadge variant="card" />

        <div className="relative w-full h-[380px] sm:h-[450px] rounded-xl overflow-hidden border border-border shadow-xs bg-muted/30">
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

          <div className="hidden sm:flex absolute bottom-4 left-4 z-10 items-center gap-3 p-3.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg max-w-lg">
            <div className="size-10 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <MapPin className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-xs font-semibold text-foreground truncate">
                  Khalil & Sons Jewellers
                </h4>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-700 dark:text-amber-400">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>5.0</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                {STORE_INFO.address.full}
              </p>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-border shrink-0">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                title="Review on Google Maps"
              >
                <HeartHandshake className="size-3 text-amber-600" />
                <span>Review</span>
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href={STORE_INFO.social.googleMapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-foreground hover:underline"
              >
                Maps &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
