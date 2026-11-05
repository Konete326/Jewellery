import React from 'react';
import { X, Check, Copy, Lock, Unlock } from 'lucide-react';

export function OrderModalHeader({ order, copied, onCopy, onClose, loading }) {
  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  const isRateLocked = Boolean(order?.goldRateLock?.isLocked);
  const status = order?.orderStatus || 'Pending';

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Pending':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300';
      case 'Confirmed':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'Processing':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'Ready':
        return 'border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300';
      case 'Delivered':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
      case 'Cancelled':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400';
      default:
        return 'border-border bg-muted/40 text-muted-foreground';
    }
  };

  return (
    <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/80 bg-card/95 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="px-2.5 py-1 rounded-sm border border-amber-600/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-medium tracking-wider shrink-0 select-none">
          {order?.goldRateLock?.karat || 'AU · 916.6'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-base sm:text-lg font-medium text-foreground truncate">
              Order #{order?.orderNumber}
            </h3>
            <button
              type="button"
              onClick={onCopy}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              title="Copy Order Number"
            >
              {copied ? <Check className="size-3.5 text-amber-600" /> : <Copy className="size-3.5" />}
            </button>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold border ${getStatusBadge(
                status
              )}`}
            >
              {status === 'Ready' ? 'Ready for Pickup' : status === 'Delivered' ? 'Collected' : status}
            </span>
            {isRateLocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] border border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Lock className="size-2.5" />
                <span>Rate Locked</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] border border-border bg-muted/30 text-muted-foreground">
                <Unlock className="size-2.5" />
                <span>Floating Rate</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
            Placed on {formattedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          disabled={loading}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
