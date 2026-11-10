import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Calendar, ZoomIn, Mail, ShoppingBag } from 'lucide-react';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';
import { getJewellerySizingType } from '@/utils/jewellerySizing';
import { JewellerySizeSelector } from './sizing/JewellerySizeSelector';
import { JewelleryMeasurementGuideModal } from './sizing/JewelleryMeasurementGuideModal';
import { formatPKR, getEstimatedPiecePrice } from '@/utils/pricing';
import { toast } from 'sonner';

export function GalleryMasterpieceHero({
  piece,
  onOpenLightbox,
  onOpenReview,
  onOpenInquiry,
  onOpenAppointment,
  onAddToCart
}) {
  const sizingType = getJewellerySizingType(piece);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState(() => sizingType || 'ring');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [loadedThumbs, setLoadedThumbs] = useState({});

  if (!piece) return null;

  const isProduct = Boolean(piece.isProduct);
  const title = piece.title || 'Fine Jewellery Piece';
  const description = piece.description || 'Handcrafted fine gold jewellery made with care at Khalil & Sons, Karachi.';
  const rawImages = Array.isArray(piece.images) && piece.images.length > 0
    ? piece.images
    : (piece.imageUrl || piece.src ? [piece.imageUrl || piece.src] : ['/assets/products/choker-ruby-01.jpg']);
  const activeImageUrl = rawImages[activeImageIndex] || rawImages[0];

  useEffect(() => {
    setIsMainImageLoaded(false);
  }, [activeImageUrl]);

  const rating = Number(Number(piece.averageRating || piece.rating || 0).toFixed(1));
  const reviewCount = piece.reviewCount || (piece.reviews?.length) || 0;
  const purity = piece.purity || '22K';
  const hallmark = purity === '24K' ? 'AU · 999.0' : purity === '18K' ? 'AU · 750.0' : purity === '21K' ? 'AU · 875.0' : 'AU · 916.6';
  const refCode = piece.sku || `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`;

  const numericVal = Number(piece.calculatedPrice) || Number(piece.price) || 0;
  const priceDisplay = numericVal > 0 ? formatPKR(numericVal) : getEstimatedPiecePrice(piece).formattedPrice;
  const minAdvance = Number(piece.minAdvanceToLock) || 0;
  const isOutOfStock = piece.availability === 'Out of Stock' || (piece.stock !== null && piece.stock !== undefined && Number(piece.stock) <= 0);
  const availabilityLabel = piece.availability || (isOutOfStock ? 'Out of Stock' : 'In Stock');

  const whatsappUrl = getPersonalizedWhatsAppInquiry({
    piece: {
      ...piece,
      activeImageUrl,
      activeImageIndex,
      selectedSize: selectedSize || undefined
    }
  });

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleOpenGuide = (tab) => {
    setGuideTab(tab || sizingType || 'ring');
    setIsGuideOpen(true);
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    if (sizingType && !selectedSize) {
      setSizeError(true);
      toast.error(`Please select a ${sizingType} size`, {
        description: 'Choose your desired fit or consult our Measurement Guide.'
      });
      return;
    }
    setSizeError(false);
    if (onAddToCart) {
      onAddToCart(piece, selectedSize);
    }
  };

  return (
    <section className="w-full py-4 md:py-8">
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 xl:col-span-7">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-muted/20 shadow-xs group">
            <div
              className={cn(
                "absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 animate-pulse transition-opacity duration-500 pointer-events-none",
                isMainImageLoaded ? "opacity-0" : "opacity-100"
              )}
            >
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 px-3 py-1 rounded border border-border/60 bg-background/50">
                {hallmark}
              </span>
            </div>

            <div
              onClick={() => onOpenLightbox && onOpenLightbox(activeImageUrl)}
              className="w-full h-full cursor-pointer select-none"
            >
              <img
                src={activeImageUrl}
                alt={title}
                onLoad={() => setIsMainImageLoaded(true)}
                className={cn(
                  "size-full object-cover transition-all duration-700 ease-out group-hover:scale-102",
                  isMainImageLoaded ? "opacity-100" : "opacity-0"
                )}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/products/choker-ruby-01.jpg";
                  setIsMainImageLoaded(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-background/85 backdrop-blur-md border border-border/70 text-foreground text-[10px] font-mono tracking-widest uppercase pointer-events-none">
              {hallmark} · SADDAR
            </div>

            <div className="absolute top-4 right-4 z-20">
              <SaveToVaultButton piece={piece} />
            </div>

            <button
              type="button"
              onClick={() => onOpenLightbox && onOpenLightbox(activeImageUrl)}
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 text-foreground backdrop-blur-md border border-border/70 text-xs font-mono uppercase tracking-wider hover:bg-background transition-colors cursor-pointer shadow-xs"
            >
              <ZoomIn className="size-3 text-muted-foreground" />
              <span>View Full Image</span>
            </button>
          </div>

          {rawImages.length > 1 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              {rawImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer bg-muted/40",
                    activeImageIndex === idx
                      ? "border-foreground ring-1 ring-foreground"
                      : "border-border/70 opacity-70 hover:opacity-100"
                  )}
                  aria-label={`View photo ${idx + 1}`}
                >
                  {!loadedThumbs[idx] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 animate-pulse pointer-events-none" />
                  )}
                  <img
                    src={img}
                    alt={`${title} view ${idx + 1}`}
                    onLoad={() => setLoadedThumbs((prev) => ({ ...prev, [idx]: true }))}
                    className={cn(
                      "size-full object-cover transition-opacity duration-300",
                      loadedThumbs[idx] ? "opacity-100" : "opacity-0"
                    )}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/products/choker-ruby-01.jpg";
                      setLoadedThumbs((prev) => ({ ...prev, [idx]: true }));
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground pb-2.5 border-b border-border/60">
            <span>{piece.category || 'Bridal Jewellery'}</span>
            <span className="text-foreground/80">Ref: {refCode}</span>
          </div>

          <h1 className="mt-3 text-3xl font-serif font-light sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.15]">
            {title}
          </h1>

          {isProduct && (
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
                          i < Math.round(rating)
                            ? "fill-foreground text-foreground"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-foreground font-medium">{rating.toFixed(1)}</span>
                  <span className="underline underline-offset-4">
                    ({reviewCount} Verified {reviewCount === 1 ? 'Review' : 'Reviews'})
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenReview}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-amber-500 font-mono">✦</span>
                  <span className="underline underline-offset-4">No reviews yet • Write a review</span>
                </button>
              )}
            </div>
          )}

          {isProduct ? (
            <div className="mt-5 p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  Direct Atelier Live Price
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-light text-foreground">
                  {priceDisplay}
                </span>
                {minAdvance > 0 && (
                  <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                    90% Gold Lock Advance: <strong className="font-semibold text-foreground">{formatPKR(minAdvance)}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Gold Rate
                </span>
                <span className={cn(
                  "text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border shrink-0",
                  isOutOfStock
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-border/60 bg-muted/40 text-muted-foreground"
                )}>
                  {availabilityLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  Pricing
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-foreground">
                  Based on Karachi Gold Market Rate
                </span>
                <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                  Showcase & Bespoke Inquiry
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Gold Rate Price
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2.5 py-1 rounded-md border border-border/60 bg-muted/40 shrink-0">
                  Showcase Piece
                </span>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            {description}
          </p>

          {isProduct ? (
            <div className="mt-5 grid grid-cols-2 gap-px bg-border/70 rounded-xl overflow-hidden border border-border/70 text-xs">
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Purity Standard</span>
                <span className="font-medium text-foreground">{purity} ({hallmark.replace('AU · ', '')}) Certified</span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Net / Gross Weight</span>
                <span className="font-medium text-foreground">
                  {piece.netWeight ? `${piece.netWeight}g net` : 'Upon Inquiry'}{piece.grossWeight ? ` / ${piece.grossWeight}g gross` : ''}
                </span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Making & Wastage</span>
                <span className="font-medium text-foreground">
                  {(Number(piece.makingCharges) || 0) > 0 ? `PKR ${formatPKR(piece.makingCharges).replace('PKR ', '')}` : 'Standard Craft'}
                  {piece.wastagePercent ? ` · ${piece.wastagePercent}% Wastage` : ''}
                </span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Inventory SKU</span>
                <span className="font-medium text-foreground font-mono">{piece.sku || refCode}</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-px bg-border/70 rounded-xl overflow-hidden border border-border/70 text-xs">
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Purity Standard</span>
                <span className="font-medium text-foreground">{purity} ({hallmark.replace('AU · ', '')}) Certified</span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Made In</span>
                <span className="font-medium text-foreground">Murshid Sunaar Tower, Saddar</span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Crafting</span>
                <span className="font-medium text-foreground">Handmade to Exact Sizing</span>
              </div>
              <div className="bg-card p-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Store Service</span>
                <span className="font-medium text-foreground">Lifetime Polish & Inspection</span>
              </div>
            </div>
          )}

          {isProduct && sizingType && (
            <JewellerySizeSelector
              sizingType={sizingType}
              selectedSize={selectedSize}
              onSelectSize={handleSelectSize}
              onOpenGuide={handleOpenGuide}
              hasError={sizeError}
            />
          )}

          {isProduct ? (
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-xs uppercase tracking-wider font-medium transition-all shadow-xs",
                  isOutOfStock
                    ? "bg-muted text-muted-foreground cursor-not-allowed border border-border/60"
                    : "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                )}
              >
                <ShoppingBag className="size-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Atelier Bag'}</span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs uppercase tracking-wider font-medium transition-all cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>Inquire on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => onOpenInquiry && onOpenInquiry(activeImageUrl, activeImageIndex)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs uppercase tracking-wider font-medium transition-all cursor-pointer"
              >
                <Mail className="size-4" />
                <span>Send Inquiry</span>
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer underline underline-offset-2"
            >
              <Calendar className="size-3" />
              <span>Book Showroom Visit</span>
            </button>

            {isProduct ? (
              <button
                type="button"
                onClick={() => onOpenInquiry && onOpenInquiry(activeImageUrl, activeImageIndex)}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer underline underline-offset-2"
              >
                <Mail className="size-3" />
                <span>Send Inquiry</span>
              </button>
            ) : (
              <span className="text-muted-foreground/70">Showroom Exhibition Only</span>
            )}
          </div>
        </div>
      </div>

      <JewelleryMeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialTab={guideTab}
      />
    </section>
  );
}
