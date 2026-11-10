import React from 'react';
import { ShieldCheck, Plus, Minus, Trash2 } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

export function CheckoutOrderSummary({
  items = [],
  goldRates,
  subtotal = 0,
  depositAmount = 0,
  balanceDue = 0,
  onIncrement,
  onDecrement,
  onRemove
}) {
  const rate22kPerTola = Number(goldRates?.rate22k?.perTola) || Number(goldRates?.k22?.perTola) || 0;
  const rate24kPerTola = Number(goldRates?.rate24k?.perTola) || Number(goldRates?.k24?.perTola) || 0;

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <span className="font-serif text-base font-semibold text-foreground">Order Selection</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground">
            {items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)} pieces
          </span>
        </div>

        <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto pr-1 space-y-3">
          {items.map((item) => {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const itemTotal = price * qty;
            const purity = item.purity || '22K';
            const hallmark = purity === '24K' ? 'AU · 999.0' : purity === '18K' ? 'AU · 750.0' : 'AU · 916.6';

            return (
              <div key={`${item.id}-${item.size || 'default'}`} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.imageUrl || item.image || item.src || '/assets/products/choker-ruby-01.jpg'}
                  alt={item.title}
                  className="size-16 rounded-xl object-cover border border-border shrink-0 bg-muted/20"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-xs font-semibold text-foreground line-clamp-1">
                      {item.title}
                    </p>
                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-muted-foreground hover:text-rose-500 transition-colors p-1 -mr-1"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <span className="px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300">
                      {hallmark}
                    </span>
                    {item.size && <span>Size: {item.size}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 border border-border rounded-lg bg-background px-1.5 py-0.5">
                      {onDecrement && (
                        <button
                          type="button"
                          onClick={() => onDecrement(item.id)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Minus className="size-2.5" />
                        </button>
                      )}
                      <span className="text-[11px] font-mono px-1 font-semibold">{qty}</span>
                      {onIncrement && (
                        <button
                          type="button"
                          onClick={() => onIncrement(item.id)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      )}
                    </div>
                    <span className="font-serif text-xs font-semibold text-foreground">
                      {formatPKR(itemTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <ShieldCheck className="size-3.5 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Gold Rate Lock Snapshot
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-muted-foreground">
            <div>
              <span className="block text-[9px] uppercase">22K Jewellery Tola</span>
              <span className="font-semibold text-foreground">
                {rate22kPerTola > 0 ? formatPKR(rate22kPerTola) : 'Active Rate'}
              </span>
            </div>
            <div>
              <span className="block text-[9px] uppercase">24K Bullion Tola</span>
              <span className="font-semibold text-foreground">
                {rate24kPerTola > 0 ? formatPKR(rate24kPerTola) : 'Active Rate'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/90 leading-relaxed pt-0.5">
            Prices locked at order snapshot. Market fluctuations will not impact your invoice valuation.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/80 text-xs font-mono">
          <div className="flex justify-between text-muted-foreground">
            <span>Total Valuation</span>
            <span className="font-serif font-semibold text-foreground text-sm">{formatPKR(subtotal)}</span>
          </div>
          {depositAmount > 0 && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>Advance Submitted</span>
              <span className="font-semibold">- {formatPKR(depositAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border/60 text-foreground font-semibold">
            <span className="uppercase tracking-wider text-[11px]">Payable at Showroom</span>
            <span className="font-serif text-base text-amber-800 dark:text-amber-300">{formatPKR(balanceDue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}