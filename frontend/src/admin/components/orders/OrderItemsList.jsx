import React from 'react';
import { Package } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

export function OrderItemsList({ items = [] }) {
  const getPurityStamp = (purity) => {
    if (!purity) return 'AU · 916.6';
    if (purity.includes('24K')) return 'AU · 999.0';
    if (purity.includes('22K')) return 'AU · 916.6';
    if (purity.includes('21K')) return 'AU · 875.0';
    if (purity.includes('18K')) return 'AU · 750.0';
    if (purity.includes('Silver') || purity.includes('925')) return 'AG · 925.0';
    return purity;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase tracking-wider text-xs text-muted-foreground block">
          Ordered Masterpieces ({items.length})
        </span>
      </div>

      <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-card overflow-hidden">
        {items.map((item, index) => {
          const itemSize = item.size || item.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1];
          const stamp = getPurityStamp(item.purity);
          const hasWeight = item.netWeight > 0 || item.grossWeight > 0;

          return (
            <div
              key={index}
              className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="size-11 sm:size-12 rounded-lg object-cover border border-border/80 shrink-0"
                  />
                ) : (
                  <div className="size-11 sm:size-12 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-center shrink-0">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-medium text-foreground truncate text-sm">
                      {item.title}
                    </h4>
                    {itemSize && (
                      <span className="px-1.5 py-0.5 rounded border border-border/80 bg-muted/60 text-foreground font-mono font-medium text-[10px]">
                        Size: {itemSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-1 flex-wrap">
                    <span className="px-1.5 py-0.2 rounded border border-amber-600/20 bg-amber-500/5 text-amber-700 dark:text-amber-400">
                      {stamp}
                    </span>
                    <span>•</span>
                    <span>{item.category || 'Fine Jewellery'}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                    {hasWeight && (
                      <>
                        <span>•</span>
                        <span>
                          Weight: {item.netWeight ? `${item.netWeight}g net` : `${item.grossWeight}g gross`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                <span className="font-mono font-medium text-foreground text-sm block">
                  {formatPKR(item.price * item.quantity)}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  @{formatPKR(item.price)} each
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
