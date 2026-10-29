import React from 'react';
import { Star, MessageCircle, Calendar, ZoomIn, Mail, ShoppingBag } from 'lucide-react';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';

export function GalleryMasterpieceHero({
  piece,
  onOpenLightbox,
  onOpenReview,
  onOpenInquiry,
  onOpenAppointment,
  onAddToCart
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
    <section className="w-full py-4 md:py-8">
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 xl:col-span-7">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-muted/20 shadow-xs group">
            <div
              onClick={onOpenLightbox}
              className="w-full h-full cursor-pointer select-none"
            >
              <img
                src={imageUrl}
                alt={title}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/products/choker-ruby-01.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-background/85 backdrop-blur-md border border-border/70 text-foreground text-[10px] font-mono tracking-widest uppercase pointer-events-none">
              AU · 916.6 · SADDAR
            </div>

            <div className="absolute top-4 right-4 z-20">
              <SaveToVaultButton piece={piece} />
            </div>

            <button
              type="button"
              onClick={onOpenLightbox}
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 text-foreground backdrop-blur-md border border-border/70 text-xs font-mono uppercase tracking-wider hover:bg-background transition-colors cursor-pointer shadow-xs"
            >
              <ZoomIn className="size-3 text-muted-foreground" />
              <span>Inspect Piece</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground pb-2.5 border-b border-border/60">
            <span>{piece.category || 'Bridal Heirlooms'}</span>
            <span className="text-foreground/80">Ref: {refCode}</span>
          </div>

          <h1 className="mt-3 text-3xl font-serif font-light sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.15]">
            {title}
          </h1>

          <div className="mt-3.5 flex items-center gap-3">
            {reviewCount > 0 ? (
              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < Math.floor(rating)
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="font-mono text-foreground font-medium">{rating.toFixed(1)}</span>
                <span className="underline underline-offset-4">
                  ({reviewCount} Verified {reviewCount === 1 ? 'Appraisal' : 'Appraisals'})
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span className="text-amber-500 font-mono">✦</span>
                <span className="underline underline-offset-4">Awaiting First Appraisal • Submit Review</span>
              </button>
            )}
          </div>

          <div className="mt-5 p-4 rounded-xl border border-border/80 bg-card/60 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                Valuation & Rate
              </span>
              <span className="font-serif text-xl sm:text-2xl font-light text-foreground">
                Karachi Sarafa Rate Linked
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2.5 py-1 rounded-md border border-border/60 bg-muted/40 shrink-0">
              Made to Order
            </span>
          </div>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            {description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-px bg-border/70 rounded-xl overflow-hidden border border-border/70 text-xs">
            <div className="bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Purity Standard</span>
              <span className="font-medium text-foreground">22K (916.6) & 21K Certified</span>
            </div>
            <div className="bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Artisanal Origin</span>
              <span className="font-medium text-foreground">Murshid Sunaar Tower, Saddar</span>
            </div>
            <div className="bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Goldsmithing</span>
              <span className="font-medium text-foreground">Handmade to Exact Sizing</span>
            </div>
            <div className="bg-card p-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Boutique Care</span>
              <span className="font-medium text-foreground">Lifetime Polish & Inspection</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onAddToCart && onAddToCart(piece)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="size-4" />
              <span>Add to Atelier Bag</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs uppercase tracking-wider font-medium transition-all cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp Inquire</span>
            </a>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer underline underline-offset-2"
            >
              <Calendar className="size-3" />
              <span>Book Showroom Viewing in Saddar</span>
            </button>

            <button
              type="button"
              onClick={onOpenInquiry}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer underline underline-offset-2"
            >
              <Mail className="size-3" />
              <span>Send Online Inquiry</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
