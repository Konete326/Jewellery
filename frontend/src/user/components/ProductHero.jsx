import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Calendar, ZoomIn, Maximize2, ShoppingBag, Ruler } from 'lucide-react';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { ZoomImage } from '@/components/ui/ZoomImage';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';
import { getJewellerySizingType, getSizingMeta } from '@/utils/jewellerySizing';
import { JewellerySizeSelector } from './sizing/JewellerySizeSelector';
import { JewelleryMeasurementGuideModal } from './sizing/JewelleryMeasurementGuideModal';
import { formatPKR, getEstimatedPiecePrice } from '@/utils/pricing';
import { toast } from 'sonner';

export function ProductHero({
  piece,
  onOpenLightbox,
  onOpenReview,
  onOpenAppointment,
  onAddToCart
}) {
  const pieceId = piece?._id || piece?.id;
  const sizingType = getJewellerySizingType(piece);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState(() => sizingType || 'ring');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize('');
    setSizeError(false);
  }, [pieceId]);

  if (!piece) return null;

  const title = piece.title || 'Fine Jewellery Piece';
  const description = piece.description || 'Handcrafted pure gold heirloom made with care at Khalil & Sons atelier, Saddar, Karachi.';
  const rawImages = Array.isArray(piece.images) && piece.images.length > 0
    ? piece.images
    : (piece.imageUrl ? [piece.imageUrl] : ['/assets/products/choker-ruby-01.jpg']);
  const activeImageUrl = rawImages[activeImageIndex] || rawImages[0];

  const rating = Number(Number(piece.averageRating || piece.rating || 5.0).toFixed(1));
  const reviewCount = piece.reviewCount || (piece.reviews?.length) || 0;
  const purity = piece.purity || '22K';
  const hallmark = purity === '24K' ? 'AU · 999.0' : purity === '18K' ? 'AU · 750.0' : purity === '21K' ? 'AU · 875.0' : 'AU · 916.6';
  const refCode = piece.sku || `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`;

  const numericVal = Number(piece.calculatedPrice) || Number(piece.price) || 0;
  const priceDisplay = numericVal > 0 ? formatPKR(numericVal) : getEstimatedPiecePrice(piece).formattedPrice;
  const isOutOfStock = piece.availability === 'Out of Stock' || (piece.stock !== null && piece.stock !== undefined && Number(piece.stock) <= 0);

  const whatsappUrl = getPersonalizedWhatsAppInquiry({
    piece: {
      ...piece,
      activeImageUrl,
      activeImageIndex,
      selectedSize: selectedSize || undefined
    }
  });

  const handleOpenGuide = (tab) => {
    setGuideTab(tab || sizingType || 'ring');
    setIsGuideOpen(true);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSizeError(false);
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
            <ZoomImage
              src={activeImageUrl}
              alt={title}
              zoomScale={1.5}
              transitionDuration={0.35}
              borderRadius={24}
              className="size-full"
            />

            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-background/85 backdrop-blur-md border border-border/70 text-foreground text-[10px] font-mono tracking-widest uppercase pointer-events-none">
              {hallmark} · SADDAR
            </div>

            <div className="absolute top-4 right-4 z-20">
              <SaveToVaultButton piece={piece} />
            </div>

            <button
              type="button"
              onClick={() => onOpenLightbox && onOpenLightbox(activeImageUrl)}
              className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 text-foreground backdrop-blur-md border border-border/70 text-xs font-mono uppercase tracking-wider hover:bg-background hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Inspect 4K Details at 200% resolution"
            >
              <Maximize2 className="size-3 text-amber-700 dark:text-amber-400" />
              <span>Inspect 4K Details</span>
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
                    "relative size-16 sm:size-20 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer bg-muted/20",
                    activeImageIndex === idx
                      ? "border-foreground ring-2 ring-foreground/20 scale-102"
                      : "border-border/70 opacity-70 hover:opacity-100 hover:border-foreground/50"
                  )}
                >
                  <img src={img} alt={`${title} view ${idx + 1}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-[10px] tracking-widest uppercase">
                {hallmark} Certified
              </span>
              <span className="font-mono text-xs text-muted-foreground">{refCode}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              {title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "size-3.5",
                      s <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-border"
                    )}
                  />
                ))}
                <span className="text-xs font-mono font-medium text-foreground ml-1">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <button
                type="button"
                onClick={onOpenReview}
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer"
              >
                {reviewCount} {reviewCount === 1 ? 'Appraisal' : 'Appraisals'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/15 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Live Gold Valuation
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                {priceDisplay}
              </span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              Calculated live based on current Karachi Sarafa market benchmark rates, verified net gold weight, and master craftsmanship.
            </p>
          </div>

          {sizingType && (
            <div className="space-y-2">
              <JewellerySizeSelector
                sizingType={sizingType}
                piece={piece}
                selectedSize={selectedSize}
                onSelectSize={handleSelectSize}
                onOpenGuide={() => handleOpenGuide(sizingType)}
                hasError={sizeError}
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card/60 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Ruler className="size-3.5" />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-medium text-foreground block truncate">
                  {sizingType ? `${getSizingMeta(sizingType)?.title} & Measurement Guide` : 'Jewellery Sizing & Measurement Guide'}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block truncate">
                  How to measure rings, bangles, bracelets &amp; chains
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenGuide(sizingType || 'ring')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted font-mono text-[11px] uppercase tracking-wider text-foreground hover:text-amber-700 transition-colors shrink-0 cursor-pointer shadow-2xs font-semibold"
            >
              <span>Size Guide</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="size-4" />
              <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Atelier Bag'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl border border-border hover:border-amber-500/50 bg-card hover:bg-muted/40 text-foreground font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="size-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onOpenAppointment}
                className="h-10 px-3 rounded-xl border border-border hover:border-amber-500/50 bg-card hover:bg-muted/40 text-foreground font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="size-3.5 text-amber-600" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>

          <div className="border-t border-border/80 pt-4 space-y-2">
            <h3 className="font-serif text-sm font-semibold text-foreground">Atelier Description</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {description}
            </p>
          </div>

          <div className="p-3 rounded-xl border border-amber-500/25 bg-amber-500/5 text-[11px] font-mono text-amber-800 dark:text-amber-300">
            <span className="font-semibold block uppercase tracking-wider text-[10px]">Showroom Pickup</span>
            <span>Personal Collection &amp; Gold Assay Verification at Shop #2, Murshid Sunaar Tower, Saddar, Karachi.</span>
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

export default ProductHero;
