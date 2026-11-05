import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPKR, sanitizeQuantity, isItemPriceConfirmed } from '@/utils/pricing';

export function CartDrawerItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateQuantity
}) {
  const qty = Number(item.quantity) || 1;
  const unitPrice = Number(item.numericPrice) || 0;
  const lineTotal = unitPrice * qty;

  const rawTitle = item.name || item.title || 'Fine Jewellery Piece';
  const cleanTitle = rawTitle.replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();

  const structuredSize = item.size ? String(item.size).trim() : '';
  const legacyMatch = rawTitle.match(/\[Size:\s*([^\]]+)\]/i);
  const displaySize = structuredSize || (legacyMatch ? legacyMatch[1].trim() : '');

  const rawPurity = item.purity || item.material || '';
  const displayPurity = rawPurity ? rawPurity.replace(/^AU\s*·?\s*/i, '').trim() : '';
  const isEstimate = !isItemPriceConfirmed(item);

  return (
    <div className="p-3 rounded-xl border border-border/80 bg-background flex gap-3.5 shadow-2xs hover:border-foreground/30 transition-colors">
      <div className="size-20 rounded-lg overflow-hidden border border-border/80 bg-muted/20 shrink-0 relative">
        <img
          src={item.image || item.imageUrl || '/assets/products/choker-ruby-01.jpg'}
          alt={cleanTitle}
          className="size-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/products/choker-ruby-01.jpg';
          }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4
              className="font-serif text-xs sm:text-sm font-medium text-foreground truncate"
              title={cleanTitle}
            >
              {cleanTitle}
            </h4>
            <button
              type="button"
              onClick={() => onRemove && onRemove(item.id)}
              className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer p-0.5 shrink-0"
              title="Remove item"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-muted-foreground flex-wrap">
            <span>{item.category || 'Fine Jewellery'}</span>
            {displayPurity && (
              <>
                <span>•</span>
                <span className="font-serif">AU · {displayPurity}</span>
              </>
            )}
            {displaySize && (
              <>
                <span>•</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-border/80 bg-muted/60 text-foreground font-mono font-medium">
                  Size: {displaySize}
                </span>
              </>
            )}
            {isEstimate && (
              <>
                <span>•</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 font-medium">
                  Estimate
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-2">
          <div className="flex items-center gap-1 border border-border/80 rounded-md bg-muted/30 px-1 py-0.5">
            <button
              type="button"
              onClick={() => onDecrement && onDecrement(item.id)}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-2.5" />
            </button>
            <input
              type="text"
              value={qty}
              onChange={(e) => {
                if (onUpdateQuantity) {
                  const clean = sanitizeQuantity(e.target.value);
                  onUpdateQuantity(item.id, clean);
                }
              }}
              className="w-7 text-center text-xs font-mono bg-transparent text-foreground focus-visible:outline-none"
              aria-label="Item quantity"
            />
            <button
              type="button"
              onClick={() => onIncrement && onIncrement(item.id)}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="size-2.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-medium text-foreground block">
              {formatPKR(lineTotal)}
              {isEstimate && (
                <span className="text-[10px] text-muted-foreground ml-1 font-normal font-sans">
                  (Est.)
                </span>
              )}
            </span>
            {qty > 1 && (
              <span className="text-[9px] font-mono text-muted-foreground block">
                {formatPKR(unitPrice)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
