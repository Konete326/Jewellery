import React from 'react';
import { Link } from 'react-router-dom';
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton';
import { ShopTileLabel } from './ShopTileLabel';
import { cn } from '@/lib/utils';

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
  const imageUrl = piece.imageUrl || piece.src || '/assets/products/choker-ruby-01.jpg';

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

      <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md bg-background/85 backdrop-blur-md border border-border/70 text-foreground text-[10px] font-mono tracking-widest uppercase pointer-events-none">
        AU · 916.6
      </div>

      <div className="absolute top-3 right-3 z-20">
        <SaveToVaultButton piece={piece} />
      </div>

      <ShopTileLabel
        title={title}
        subtitle={category}
        position={position}
        onAddToCart={onAddToCart ? () => onAddToCart(piece) : undefined}
      />
    </div>
  );
}
