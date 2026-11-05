import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShopTileLabel({
  title,
  subtitle,
  price,
  onAddToCart,
  position = 'bottom',
  className
}) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 flex w-full p-1.5 sm:p-4 @container/label pointer-events-none z-20',
        className
      )}
    >
      <div className="flex items-center w-full justify-between rounded-full border border-border/70 bg-background/90 p-1 pl-2 sm:pl-3.5 pr-1 sm:pr-1.5 text-xs text-foreground backdrop-blur-md shadow-xs min-w-0 pointer-events-auto">
        <div className="mr-1.5 sm:mr-2 min-w-0 grow">
          <h3 className="line-clamp-1 font-serif text-[11px] sm:text-sm font-normal tracking-tight text-foreground truncate">
            {title}
          </h3>
          {price && (
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-foreground">
                {price}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground hidden @[280px]/label:inline">
                · Live Rate
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="hidden @[240px]/label:inline-flex rounded-full bg-muted/60 text-foreground border border-border/60 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono font-medium tracking-wider uppercase shrink-0">
            {subtitle || 'AU · 22K'}
          </span>
          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              className="size-6 sm:size-7 rounded-full bg-foreground text-background hover:bg-foreground/90 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0"
              title="Add to Atelier Bag"
              aria-label={`Add ${title} to shopping bag`}
            >
              <ShoppingBag className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
