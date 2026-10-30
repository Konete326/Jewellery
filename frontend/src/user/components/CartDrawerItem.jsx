import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPKR, sanitizeQuantity } from '@/utils/pricing';

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

  return (
    <div className="p-3 rounded-xl border border-border/80 bg-background flex gap-3.5 shadow-2xs hover:border-foreground/30 transition-colors">
      <div className="size-20 rounded-lg overflow-hidden border border-border/80 bg-muted/20 shrink-0 relative">
        <img
          src={item.image || item.imageUrl || '/assets/products/choker-ruby-01.jpg'}
          alt={item.name || item.title}
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
            <h4 className="font-serif text-xs sm:text-sm font-medium text-foreground truncate">
              {item.name || item.title}
            </h4>
            <button
              type="button"
              onClick={() => onRemove && onRemove(item.id)}
              className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer p-0.5"
              title="Remove item"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-muted-foreground">
            <span>{item.category || 'Fine Jewellery'}</span>
            <span>•</span>
            <span className="font-serif">AU · {item.purity || '22K'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-2">
          <div className="flex items-center gap-1 border border-border/80 rounded-md bg-muted/30 px-1 py-0.5">
            <button
              type="button"
              onClick={() => onDecrement && onDecrement(item.id)}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
              disabled={qty <= 1}
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
            />
            <button
              type="button"
              onClick={() => onIncrement && onIncrement(item.id)}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Plus className="size-2.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-medium text-foreground block">
              {formatPKR(lineTotal)}
            </span>
            {qty > 1 && (
              <span className="text-[9px] font-mono text-muted-foreground block">
                {formatPKR(unitPrice)} ea
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
