import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

export function TrackOrderSummaryCard({ order }) {
  if (!order) return null;

  const total = Number(order.totalAmount) || 0;
  const advance = Number(order.advancePaid) || 0;
  const balance = Number(order.balanceDue) || 0;
  const paymentStatus = order.paymentStatus || 'Unpaid';
  const rateLock = order.goldRateLock || {};
  const isRateLocked = Boolean(rateLock.isLocked);
  const snapshotRate = Number(rateLock.snapshotRate) || Number(rateLock.lockedRate) || 0;
  const minAdvanceRequired = Number(rateLock.minAdvanceRequired) || 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h4 className="font-serif text-base font-medium text-foreground">
          Payment Summary
        </h4>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
            paymentStatus === 'Paid'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : paymentStatus === 'Partial'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
              : 'border-border bg-muted/30 text-muted-foreground'
          }`}
        >
          {paymentStatus}
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Total Amount:</span>
          <span className="text-foreground font-medium">{formatPKR(total)}</span>
        </div>

        {minAdvanceRequired > 0 && (
          <div className="flex items-center justify-between text-muted-foreground">
            <span>90% Advance for Rate Lock:</span>
            <span className="text-foreground">{formatPKR(minAdvanceRequired)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Advance Paid:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            {formatPKR(advance)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-sm">
          <span className="font-serif text-foreground font-medium">Balance Due at Pickup:</span>
          <span className="font-mono font-bold text-foreground">
            {formatPKR(balance)}
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-border/70 bg-muted/15 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {isRateLocked ? (
            <Lock className="size-3.5 text-amber-600 shrink-0" />
          ) : (
            <Unlock className="size-3.5 text-muted-foreground shrink-0" />
          )}
          <span className="text-muted-foreground">Gold Rate:</span>
        </div>
        <span className={isRateLocked ? 'text-amber-700 dark:text-amber-400 font-semibold' : 'text-muted-foreground'}>
          {isRateLocked && snapshotRate > 0
            ? `Locked @ PKR ${snapshotRate.toLocaleString()} / tola`
            : 'Floating Market Rate'}
        </span>
      </div>
    </div>
  );
}
