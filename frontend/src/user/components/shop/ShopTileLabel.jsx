import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShopTileLabel({
  title,
  subtitle,
  price,
  href,
  onAddToCart,
  className
}) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 p-2 sm:p-3 pointer-events-none z-20',
        className
      )}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/40 dark:border-white/10 bg-background/90 dark:bg-card/90 p-2 sm:p-2.5 backdrop-blur-xl shadow-lg transition-all duration-300 pointer-events-auto">
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          {href ? (
            <Link
              to={href}
              className="group/link min-w-0 flex-1 block pr-1 focus:outline-none"
            >
              <h3 className="font-serif text-[11px] sm:text-[13px] font-medium leading-tight text-foreground truncate group-hover/link:text-amber-600 transition-colors">
                {title}
              </h3>
            </Link>
          ) : (
            <div className="min-w-0 flex-1 block pr-1">
              <h3 className="font-serif text-[11px] sm:text-[13px] font-medium leading-tight text-foreground truncate">
                {title}
              </h3>
            </div>
          )}

          {subtitle && (
            <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase border border-border/70 bg-muted/60 text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
          <div className="min-w-0 flex items-baseline gap-1">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
              {price || 'Price on Inquiry'}
            </span>
            <span className="hidden sm:inline text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
              · Live
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {href && (
              <Link
                to={href}
                className="size-7 sm:size-7 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                title="View Masterpiece Details"
                aria-label={`View details of ${title}`}
              >
                <ArrowUpRight className="size-3.5" />
              </Link>
            )}

            {onAddToCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="h-7 px-2 sm:px-2.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 active:scale-95 transition-all flex items-center gap-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider cursor-pointer shadow-xs shrink-0 focus:outline-none"
                title="Add to Atelier Bag"
                aria-label={`Add ${title} to bag`}
              >
                <ShoppingBag className="size-3" />
                <span className="hidden sm:inline">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
