import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShopTileLabel({
  title,
  subtitle,
  onAddToCart,
  position = 'bottom',
  className
}) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 flex w-full p-2.5 sm:p-4 @container/label pointer-events-none z-20',
        position === 'center' && 'lg:px-12 lg:pb-[22%]',
        className
      )}
    >
      <div className="flex items-center w-full justify-between rounded-full border border-border/70 bg-background/90 p-1 pl-3 sm:pl-3.5 pr-1.5 text-xs text-foreground backdrop-blur-md shadow-xs min-w-0 pointer-events-auto">
        <h3 className="mr-2 line-clamp-1 grow font-serif text-xs sm:text-sm font-normal tracking-tight text-foreground truncate">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="rounded-full bg-muted/60 text-foreground border border-border/60 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] font-mono font-medium tracking-wider uppercase shrink-0">
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
