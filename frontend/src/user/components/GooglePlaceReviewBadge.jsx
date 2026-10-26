import React from 'react';
import { Star, ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';

export function GooglePlaceReviewBadge({ variant = 'card', className = '' }) {
  const reviewUrl = STORE_INFO.social.googleReviewUrl || 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7';

  if (variant === 'button') {
    return (
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-stone-900 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors shadow-2xs group cursor-pointer ${className}`}
      >
        <span className="flex items-center text-amber-500">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
        </span>
        <span>Review Us on Google</span>
        <ExternalLink className="size-3 text-neutral-500" />
      </a>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-700/90 shadow-md ${className}`}>
        <div className="flex items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <div className="h-3 w-px bg-border" />
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
        >
          <span>Write a Review</span>
          <ExternalLink className="size-2.5" />
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-white dark:bg-card backdrop-blur-xs ${className}`}>
      <div className="flex items-center gap-3.5">
        <div className="size-11 rounded-xl bg-neutral-100 dark:bg-stone-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-xs shrink-0">
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-serif font-bold text-sm sm:text-base text-foreground">5.0</span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground">• Google Verified Place</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-light">
            Share your bespoke experience or rate our master goldsmithing in Saddar, Karachi.
          </p>
        </div>
      </div>

      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-stone-900 border border-neutral-300 dark:border-neutral-700 text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors shadow-xs shrink-0 cursor-pointer w-full sm:w-auto"
      >
        <HeartHandshake className="size-3.5 text-neutral-600 dark:text-neutral-400" />
        <span>Review on Google</span>
        <ExternalLink className="size-3 text-neutral-400" />
      </a>
    </div>
  );
}
