import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, ZoomIn, Maximize2, ShieldCheck } from 'lucide-react';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { ZoomImage } from '@/components/ui/ZoomImage';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { STORE_INFO } from '@/constants/storeInfo';
import { cn } from '@/lib/utils';

export function MasterpieceHero({
  piece,
  onOpenLightbox,
  onOpenAppointment
}) {
  const pieceId = piece?._id || piece?.id;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [pieceId]);

  if (!piece) return null;

  const title = piece.title || 'Atelier Masterpiece';
  const description = piece.description || 'A timeless bespoke gold masterpiece handcrafted by master goldsmiths at Khalil & Sons, Saddar, Karachi.';
  const rawImages = Array.isArray(piece.images) && piece.images.length > 0
    ? piece.images
    : (piece.imageUrl ? [piece.imageUrl] : ['/assets/products/choker-ruby-01.jpg']);
  const activeImageUrl = rawImages[activeImageIndex] || rawImages[0];

  const purity = piece.purity || '22K';
  const hallmark = purity === '24K' ? 'AU · 999.0' : purity === '18K' ? 'AU · 750.0' : purity === '21K' ? 'AU · 875.0' : 'AU · 916.6';
  const refCode = piece.sku || `KS-${String(piece._id || piece.id || '001').slice(-6).toUpperCase()}`;

  const handleWhatsAppInquiry = () => {
    const phone = STORE_INFO.whatsapp.number || '+923333213613';
    const msg = `As-salamu alaykum Khalil & Sons Jewellers, I would like to request this bespoke design from your Masterpiece Archive:\n\nPiece: ${title} (${refCode})\nPurity: ${purity} Gold\nLink: https://khalilandsonsjewellers.com/masterpieces/${pieceId}\n\nPlease share details and consultation for crafting a similar design.`;
    openWhatsAppChat({ phone, message: msg });
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
              {hallmark} · LIVING ARCHIVE
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
                {hallmark} Archive
              </span>
              <span className="font-mono text-xs text-muted-foreground">{refCode}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              {title}
            </h1>

            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {piece.category || 'Bespoke Haute Joaillerie'}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/15 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Pricing Structure
            </span>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
              Price on Request
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
              Masterpieces are bespoke archival pieces crafted to customer specifications. Gold weight, gemstones, and making charges are calculated custom upon commission.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>Request This Design on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onOpenAppointment}
              className="w-full h-11 rounded-xl border border-border hover:border-amber-500/50 bg-card hover:bg-muted/40 text-foreground font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="size-3.5 text-amber-600" />
              <span>Book Showroom Consultation</span>
            </button>

            <p className="text-center text-[11px] text-muted-foreground font-mono">
              Masterpieces are showcase pieces. Contact us to have a similar design made.
            </p>
          </div>

          <div className="border-t border-border/80 pt-4 space-y-2">
            <h3 className="font-serif text-sm font-semibold text-foreground">Design Narrative &amp; Craft</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Lifetime Gold Purity &amp; Buyback Guarantee</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Every heirloom from Khalil &amp; Sons is crafted in certified 22K or 24K pure gold with laser hallmark assay stamping at our Saddar atelier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MasterpieceHero;
