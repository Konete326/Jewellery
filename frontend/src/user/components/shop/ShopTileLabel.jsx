import React from 'react';
import { cn } from '@/lib/utils';

export function ShopTileLabel({
  title,
  subtitle,
  position = 'bottom',
  className
}) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 flex w-full p-2.5 sm:p-4 @container/label pointer-events-none',
        position === 'center' && 'lg:px-12 lg:pb-[22%]',
        className
      )}
    >
      <div className="flex items-center w-full justify-between rounded-full border border-border/70 bg-background/90 p-1 pl-3 sm:pl-3.5 text-xs text-foreground backdrop-blur-md shadow-xs min-w-0 pointer-events-auto">
        <h3 className="mr-2.5 line-clamp-1 grow font-serif text-xs sm:text-sm font-normal tracking-tight text-foreground truncate">
          {title}
        </h3>
        <span className="flex-none rounded-full bg-foreground text-background px-2.5 sm:px-3 py-1 text-[10px] font-mono font-medium tracking-wider uppercase shrink-0">
          {subtitle || 'AU · 22K'}
        </span>
      </div>
    </div>
  );
}
