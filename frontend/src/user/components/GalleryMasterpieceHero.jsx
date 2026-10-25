import React from 'react';
import { Star, Sparkles, MessageCircle, Mail, Calendar, ZoomIn, ShieldCheck, Gem, Compass } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';

export function GalleryMasterpieceHero({
  piece,
  onOpenLightbox,
  onOpenReview,
  onOpenInquiry,
  onOpenAppointment
}) {
  if (!piece) return null;

  const title = piece.title || 'Haute Joaillerie Masterpiece';
  const description = piece.description || 'Archival exhibition piece forged with patient Renaissance goldcraft in our Florence atelier.';
  const imageUrl = piece.imageUrl || piece.src;
  const rating = Number(piece.averageRating || piece.rating || 0);
  const reviewCount = piece.reviewCount || (piece.reviews?.length) || 0;
  const hasQualifyingRating = rating >= 4.0;
  const refCode = `FL-ATELIER-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`;

  const whatsappMessage = encodeURIComponent(
    `Hello Khalil & Sons Atelier,\n\nI am inquiring regarding the bespoke masterpiece:\n*${title}*\nReference: ${refCode}\nImage: ${imageUrl}\nPage: ${typeof window !== 'undefined' ? window.location.href : ''}\n\nPlease share availability, bespoke specifications, and private viewing details.`
  );
  const whatsappUrl = `https://wa.me/39055218901?text=${whatsappMessage}`;

  return (
    <section className="w-full pt-2 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-6 order-2 lg:order-1">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>Living Archive • Archival Masterpiece</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-5xl xl:text-6xl text-[#2d3435] font-light tracking-tight leading-[1.15]">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {hasQualifyingRating ? (
                <div
                  onClick={onOpenReview}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 cursor-pointer hover:bg-amber-500/15 transition-colors group"
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= Math.round(rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 font-mono">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-400 underline underline-offset-2">
                    ({reviewCount} {reviewCount === 1 ? 'Appraisal' : 'Appraisals'})
                  </span>
                </div>
              ) : null}

              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#2d3435] hover:border-amber-500/50 hover:text-amber-800 transition-colors cursor-pointer shadow-xs"
              >
                <Star className="size-3.5 text-amber-600" />
                <span>{hasQualifyingRating ? 'Add Your Appraisal' : 'Record Patron Appraisal'}</span>
              </button>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-sm sm:text-base text-[#5a6061] font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-neutral-200/80">
            <div className="p-3 rounded-xl bg-white/80 border border-neutral-200/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Archive Ref</span>
              <p className="text-xs font-mono font-medium text-[#2d3435] mt-0.5 truncate">{refCode}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-neutral-200/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Precious Metal</span>
              <p className="text-xs font-medium text-[#2d3435] mt-0.5">Solid Florentine Gold</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-neutral-200/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Atelier</span>
              <p className="text-xs font-medium text-[#2d3435] mt-0.5">Florence, Italy</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 border border-neutral-200/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Edition</span>
              <p className="text-xs font-medium text-amber-700 mt-0.5">Bespoke Unique Piece</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#5f5e5e] block">
              Bespoke Acquisition & Atelier Inquiry
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <LuxuryButton
                as="a"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                size="lg"
                className="flex-1"
              >
                <MessageCircle className="size-4" />
                <span>WhatsApp Atelier Directly</span>
              </LuxuryButton>

              <LuxuryButton
                as="button"
                onClick={onOpenInquiry}
                variant="dark"
                size="lg"
                className="flex-1"
              >
                <Mail className="size-4 text-amber-400" />
                <span>Email Commission Inquiry</span>
              </LuxuryButton>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenAppointment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 bg-white/70 hover:bg-white text-xs uppercase tracking-wider font-medium text-[#2d3435] hover:border-amber-500/50 transition-all cursor-pointer shadow-xs"
              >
                <Calendar className="size-3.5 text-amber-600" />
                <span>Book In-Person Atelier Viewing in Florence</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 order-1 lg:order-2">
          <div
            onClick={onOpenLightbox}
            className="group relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-2xl cursor-pointer select-none"
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-70 transition-opacity" />

            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Gem className="size-3 text-amber-400" />
              <span>Florentine Masterwork</span>
            </div>

            <div className="absolute bottom-4 right-4 z-10 px-4 py-2 rounded-xl bg-white/95 text-[#2d3435] backdrop-blur-md shadow-lg text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
              <ZoomIn className="size-4 text-amber-600" />
              <span>Inspect High-Res Details</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
