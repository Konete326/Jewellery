import React from 'react';
import { X, Store, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';

export function OrderCollectionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  order,
  loading
}) {
  if (!isOpen || !order) return null;

  const balanceDue = Number(order.balanceDue || 0);
  const hasOutstandingBalance = balanceDue > 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        disabled={loading}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-default w-full h-full border-0 p-0 focus:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-border/80 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="size-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif text-base font-medium text-foreground">
              Confirm Showroom Collection
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-border/80 bg-background font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-semibold text-foreground">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patron:</span>
              <span className="text-foreground">{order.customer?.name || 'Valued Patron'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-semibold text-foreground">{formatPKR(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-1.5 mt-1.5">
              <span className="text-muted-foreground">Balance Due:</span>
              <span className={hasOutstandingBalance ? "font-bold text-rose-600 dark:text-rose-400" : "font-semibold text-emerald-600 dark:text-emerald-400"}>
                {hasOutstandingBalance ? formatPKR(balanceDue) : 'Fully Settled'}
              </span>
            </div>
          </div>

          {hasOutstandingBalance && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="size-3.5 shrink-0" />
                <span>Outstanding Balance Due</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This order has an unpaid balance of <strong>{formatPKR(balanceDue)}</strong>. Verify cash or bank receipt at the counter before completing handover.
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Terminal State Warning</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Recording this collection sets the order status to <strong>Delivered</strong>. This is a terminal state and cannot be reverted or reset once saved.
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="h-8 px-3 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-8 px-4 text-xs font-semibold cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {loading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              {loading ? 'Recording Collection...' : 'Confirm Collection Handover'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

