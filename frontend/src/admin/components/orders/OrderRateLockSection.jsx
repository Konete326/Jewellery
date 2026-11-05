import React from 'react';
import { Lock, Unlock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

export function OrderRateLockSection({ order }) {
  const rateLock = order?.goldRateLock || {};
  const isLocked = Boolean(rateLock.isLocked);
  const pureGoldVal = Number(rateLock.pureGoldValue) || 0;
  const minRequiredAdvance = Number(rateLock.minAdvanceRequired) || 0;
  const approvedAdvance = Number(order?.advancePaid) || 0;
  const snapshotRate = Number(rateLock.snapshotRate) || Number(rateLock.lockedRate) || 0;
  const karat = rateLock.karat || rateLock.snapshotKarat || '22K';

  const progressPercent =
    minRequiredAdvance > 0
      ? Math.min(100, Math.round((approvedAdvance / minRequiredAdvance) * 100))
      : 0;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
          {isLocked ? (
            <Lock className="size-3.5 text-amber-600 shrink-0" />
          ) : (
            <Unlock className="size-3.5 text-muted-foreground shrink-0" />
          )}
          <span>Gold Rate-Lock Benchmark & 90% Advance Threshold</span>
        </span>

        {isLocked ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
            <CheckCircle2 className="size-3" />
            <span>Rate Locked at PKR {snapshotRate.toLocaleString()} / tola</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-border bg-muted/40 text-muted-foreground font-medium">
            <ShieldAlert className="size-3 text-amber-600" />
            <span>Floating Market Rate</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">
            Order Snapshot Rate
          </span>
          <span className="font-semibold text-foreground text-xs block mt-0.5">
            {snapshotRate > 0 ? `PKR ${snapshotRate.toLocaleString()}` : 'N/A'}
          </span>
          <span className="text-[10px] text-muted-foreground">Standard: {karat}</span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">
            Pure Gold Metal Value
          </span>
          <span className="font-semibold text-foreground text-xs block mt-0.5">
            {pureGoldVal > 0 ? formatPKR(pureGoldVal) : 'Calculated at Booking'}
          </span>
          <span className="text-[10px] text-muted-foreground">Net bullion weight</span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">
            Required 90% Advance
          </span>
          <span className="font-semibold text-foreground text-xs block mt-0.5">
            {minRequiredAdvance > 0 ? formatPKR(minRequiredAdvance) : 'Pending bullion eval'}
          </span>
          <span className="text-[10px] text-amber-700 dark:text-amber-400">
            Backend Threshold
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">
            Total Approved Advance
          </span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs block mt-0.5">
            {formatPKR(approvedAdvance)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {progressPercent}% of required
          </span>
        </div>
      </div>

      {minRequiredAdvance > 0 && (
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Rate-Lock Advance Progress:</span>
            <span className={approvedAdvance >= minRequiredAdvance ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
              {approvedAdvance >= minRequiredAdvance
                ? 'Threshold Satisfied (90%+ Pure Gold Paid)'
                : `${formatPKR(Math.max(0, minRequiredAdvance - approvedAdvance))} needed to lock rate`}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                approvedAdvance >= minRequiredAdvance ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
