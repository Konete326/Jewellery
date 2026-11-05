import React from 'react';
import { Link } from 'react-router-dom';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { ShopTileLabel } from './ShopTileLabel';
import { cn } from '@/lib/utils';
import { formatPKR, getEstimatedPiecePrice } from '@/utils/pricing';

export function ShopTile({
  piece,
  active,
  position = 'bottom',
  priority = false,
  onAddToCart,
  className
}) {
  if (!piece) return null;

  const id = piece._id || piece.id;
  const title = piece.title || 'Fine Jewellery Piece';
  const category = piece.category || 'Fine Jewellery';
  const images = Array.isArray(piece.images) ? piece.images : [];
  const imageUrl = piece.imageUrl || piece.src || images[0] || '/assets/products/choker-ruby-01.jpg';

  const purity = piece.purity || '22K';
  const hallmark = purity === '24K' ? 'AU · 999.0' : purity === '18K' ? 'AU · 750.0' : purity === '21K' ? 'AU · 875.0' : 'AU · 916.6';

  const numericVal = Number(piece.calculatedPrice) || Number(piece.price) || 0;
  const priceDisplay = numericVal > 0 ? formatPKR(numericVal) : getEstimatedPiecePrice(piece).formattedPrice;

  return (
    <div
      className={cn(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border bg-card transition-all duration-300 shadow-2xs',
        active ? 'border-2 border-foreground ring-1 ring-foreground/20' : 'border-border/80 hover:border-foreground/40',
        className
      )}
    >
      <Link
        to={`/gallery/${id}`}
        className="relative block h-full w-full overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/products/choker-ruby-01.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none" />
      </Link>

      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-col items-start gap-1 pointer-events-none">
        <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-background/90 text-foreground border border-border/70 backdrop-blur-md shadow-2xs">
          {hallmark}
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-medium tracking-wide uppercase bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-2xs">
          <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Dynamic Live Gold Price</span>
          <span className="sm:hidden">Live Price</span>
        </span>
      </div>

      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
        <SaveToVaultButton piece={piece} />
      </div>

      <ShopTileLabel
        title={title}
        subtitle={category}
        price={priceDisplay}
        position={position}
        onAddToCart={onAddToCart ? () => onAddToCart(piece) : undefined}
      />
    </div>
  );
}
