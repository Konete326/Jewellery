import React from 'react';
import { formatPKR } from '@/utils/pricing';

export function TrackOrderItemsCard({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h4 className="font-serif text-base font-medium text-foreground">
            Ordered Items ({items.length})
          </h4>
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {items.map((item, index) => {
          const structuredSize = item.size || '';
          const legacyMatch = item.title?.match(/\[Size:\s*([^\]]+)\]/i);
          const legacySize = legacyMatch ? legacyMatch[1].trim() : '';
          const effectiveSize = structuredSize || legacySize;
          const cleanTitle = (item.title || 'Fine Jewellery Piece')
            .replace(/\s*\[Size:\s*[^\]]+\]/i, '')
            .trim();
          const quantity = Number(item.quantity) || 1;
          const unitPrice = Number(item.price) || 0;
          const lineTotal = unitPrice * quantity;

          return (
            <div
              key={`${item.title}-${index}`}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-14 rounded-lg border border-border/80 bg-muted/30 overflow-hidden flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={cleanTitle}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-xs font-semibold text-muted-foreground/60 tracking-wider">
                      AU
                    </span>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h5 className="font-serif text-sm font-medium text-foreground truncate">
                    {cleanTitle}
                  </h5>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    {item.purity && (
                      <span className="px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
                        {item.purity}
                      </span>
                    )}

                    {effectiveSize && (
                      <span className="px-1.5 py-0.2 rounded border border-border/80 bg-muted/60 text-foreground text-[10px] font-medium">
                        Size: {effectiveSize}
                      </span>
                    )}

                    {item.category && (
                      <span className="text-[11px] text-muted-foreground">
                        • {item.category}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-muted-foreground font-mono">
                    Qty: {quantity}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 font-mono">
                <div className="text-sm font-semibold text-foreground">
                  {formatPKR(lineTotal)}
                </div>
                {quantity > 1 && (
                  <div className="text-[10px] text-muted-foreground">
                    @{formatPKR(unitPrice)} each
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
