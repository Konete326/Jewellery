import React from 'react';
import { Store, Check, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALL_ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Ready',
  'Delivered',
  'Cancelled'
];

export function OrderWorkflowSection({
  formData,
  onChange,
  onQuickStatusChange,
  loading
}) {
  const currentStatus = formData?.orderStatus || 'Pending';
  const isTerminal = currentStatus === 'Delivered';

  const canMarkProcessing = currentStatus === 'Pending' || currentStatus === 'Confirmed';
  const canMarkReady = currentStatus === 'Confirmed' || currentStatus === 'Processing';
  const canMarkCollected = currentStatus === 'Ready';

  const handleStatusSelectChange = (e) => {
    const nextStatus = e.target.value;
    if (nextStatus === 'Delivered') {
      onQuickStatusChange('Delivered');
      return;
    }
    onChange((prev) => ({
      ...prev,
      orderStatus: nextStatus
    }));
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
          <Store className="size-3.5 text-amber-600 shrink-0" />
          <span>Atelier Preparation & Showroom Pickup Workflow</span>
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          Current State: <strong className="text-foreground">{currentStatus === 'Ready' ? 'Ready for Pickup' : currentStatus === 'Delivered' ? 'Collected' : currentStatus}</strong>
        </span>
      </div>

      <div className="p-3 rounded-lg border border-border/60 bg-muted/15 space-y-2">
        <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block">
          Fast-Track Status Actions
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {currentStatus === 'Pending' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => onQuickStatusChange('Confirmed')}
              className="h-8 px-3 text-xs gap-1.5 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 cursor-pointer"
            >
              <Check className="size-3" />
              <span>Confirm Order</span>
            </Button>
          )}

          {canMarkProcessing && currentStatus !== 'Processing' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => onQuickStatusChange('Processing')}
              className="h-8 px-3 text-xs gap-1.5 text-purple-700 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
            >
              <Sparkles className="size-3" />
              <span>Start Workshop Crafting</span>
            </Button>
          )}

          {canMarkReady && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => onQuickStatusChange('Ready')}
              className="h-8 px-3 text-xs gap-1.5 text-teal-700 dark:text-teal-400 border-teal-500/30 hover:bg-teal-500/10 cursor-pointer font-medium"
            >
              <Store className="size-3" />
              <span>Mark Ready for Pickup</span>
            </Button>
          )}

          {canMarkCollected && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => onQuickStatusChange('Delivered')}
              className="h-8 px-3 text-xs gap-1.5 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer font-semibold"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Mark as Collected by Patron</span>
            </Button>
          )}

          {isTerminal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              <span>Order Collection Completed</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase text-muted-foreground flex items-center justify-between">
          <span>Manual Workflow Status Transition</span>
          {isTerminal && (
            <span className="inline-flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400">
              <Lock className="size-2.5" />
              <span>Terminal State Locked</span>
            </span>
          )}
        </label>
        <select
          value={formData.orderStatus}
          disabled={isTerminal || loading}
          onChange={handleStatusSelectChange}
          className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {ALL_ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st === 'Ready' ? 'Ready for Pickup' : st === 'Delivered' ? 'Collected' : st}
            </option>
          ))}
        </select>
        {isTerminal && (
          <p className="text-[10px] font-mono text-muted-foreground pt-0.5">
            This order has been verified and collected from the showroom. Status is permanently locked.
          </p>
        )}
      </div>

      <div className="space-y-1 pt-1 border-t border-border/60">
        <label className="text-[10px] font-mono uppercase text-muted-foreground block">
          Workshop Preparation & Goldsmith Notes (Internal Log)
        </label>
        <textarea
          rows={2}
          value={formData.internalNotes || ''}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              internalNotes: e.target.value
            }))
          }
          placeholder="e.g. Heirloom ring sized to 14, authentic AU · 916.6 assay hallmark confirmed, cleaned and packed in silk-velvet casket for flagship showroom collection."
          className="w-full bg-background border border-input rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none resize-none"
        />
      </div>
    </div>
  );
}
