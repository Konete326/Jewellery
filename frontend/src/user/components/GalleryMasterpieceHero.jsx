import React from 'react';
import { Star, MessageCircle, Mail, Calendar, ZoomIn, Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';

export function GalleryMasterpieceHero({
  piece,
  onOpenLightbox,
  onOpenReview,
  onOpenInquiry,
  onOpenAppointment
}) {
  if (!piece) return null;

  const title = piece.title || 'Fine Jewellery Piece';
  const description = piece.description || 'Handcrafted fine gold jewellery made with care at Khalil & Sons, Karachi.';
  const imageUrl = piece.imageUrl || piece.src;
  const rating = Number(piece.averageRating || piece.rating || 0);
  const reviewCount = piece.reviewCount || (piece.reviews?.length) || 0;
  const refCode = `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`;

  const whatsappUrl = getPersonalizedWhatsAppInquiry({ piece });

  return (
    <section className="w-full py-6 md:py-10">
      <div className="grid gap-8 items-start lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider font-mono border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900">
                <Gem className="size-3 mr-1.5 text-neutral-700 dark:text-neutral-300" />
                22K · 21K · 18K Certified Gold
              </Badge>
              <Badge variant="secondary" className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {piece.category || 'Bridal Sets'}
              </Badge>
            </div>
            <SaveToVaultButton piece={piece} variant="pill" showText />
          </div>

          <p className="text-xs sm:text-sm font-mono font-medium uppercase tracking-widest text-muted-foreground">
            Handcrafted in Saddar, Karachi • Ref: {refCode}
          </p>

          <h1 className="mt-2 text-3xl font-serif font-light sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.15]">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {reviewCount > 0 ? (
              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer group"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < Math.floor(rating)
                          ? "fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground ml-1">{rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">
                  ({reviewCount} Verified {reviewCount === 1 ? 'Appraisal' : 'Appraisals'})
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 cursor-pointer transition-colors group"
              >
                <Gem className="size-3.5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-xs font-serif font-medium text-foreground">Awaiting First Appraisal</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground underline underline-offset-2">Be First to Review</span>
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 pb-3 border-y border-neutral-200/80 dark:border-neutral-800">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Appraisal & Value</span>
              <span className="text-xl sm:text-2xl font-serif font-light text-foreground">
                Bespoke Gold Rate Linked
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                Karachi Sarafa Rates
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10">
                Made to Order
              </Badge>
            </div>
          </div>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            {description}
          </p>

          <ul className="mt-6 space-y-2.5">
            <li className="flex items-center gap-2.5 text-sm text-foreground/90">
              <span className="size-1.5 rounded-full bg-foreground shrink-0" />
              <span>Certified 22K, 21K & 18K hallmark purity guarantee with official stamp</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-foreground/90">
              <span className="size-1.5 rounded-full bg-foreground shrink-0" />
              <span>Handcrafted by master goldsmiths in Murshid Sunaar Tower, Saddar</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-foreground/90">
              <span className="size-1.5 rounded-full bg-foreground shrink-0" />
              <span>Complimentary lifetime polishing, ultrasonic cleaning & inspection</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-foreground/90">
              <span className="size-1.5 rounded-full bg-foreground shrink-0" />
              <span>Insured delivery worldwide in bespoke handcrafted velvet casket</span>
            </li>
          </ul>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            <div className="p-3 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Purity</span>
              <p className="text-xs font-medium text-foreground mt-0.5">22K, 21K & 18K Hallmarked</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Boutique</span>
              <p className="text-xs font-medium text-foreground mt-0.5">Saddar, Karachi</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Craftsmanship</span>
              <p className="text-xs font-medium text-foreground mt-0.5">Artisanal Goldsmithing</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Availability</span>
              <p className="text-xs font-medium text-foreground mt-0.5">Handmade to Order</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-foreground text-background hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>WhatsApp Directly</span>
              </a>

              <button
                type="button"
                onClick={onOpenInquiry}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-border/90 bg-card hover:bg-accent text-foreground text-xs uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer"
              >
                <Mail className="size-4" />
                <span>Send Atelier Inquiry</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onOpenAppointment}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 hover:bg-white dark:hover:bg-neutral-900 text-xs uppercase tracking-wider font-medium text-foreground transition-all cursor-pointer shadow-xs"
              >
                <Calendar className="size-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>Book an In-Person Viewing in Karachi</span>
              </button>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900 border border-border/80 shadow-xl group/hero">
            <div
              onClick={onOpenLightbox}
              className="w-full h-full cursor-pointer select-none"
            >
              <img
                src={imageUrl}
                alt={title}
                className="size-full object-cover transition-transform duration-500 ease-out group-hover/hero:scale-105 w-full h-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/products/choker-ruby-01.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-30 group-hover/hero:opacity-60 transition-opacity" />
            </div>

            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5 pointer-events-none">
              <Gem className="size-3 text-neutral-200" />
              <span>Handmade in Karachi</span>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <SaveToVaultButton piece={piece} />
            </div>

            <div
              onClick={onOpenLightbox}
              className="absolute bottom-4 right-4 z-10 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-neutral-900/95 text-foreground backdrop-blur-md shadow-md text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-transform duration-300 group-hover/hero:scale-105 cursor-pointer border border-border/80"
            >
              <ZoomIn className="size-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>Click to Zoom</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
