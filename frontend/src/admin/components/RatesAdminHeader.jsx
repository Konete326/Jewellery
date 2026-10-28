import React from 'react';
import { RefreshCw, RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RatesAdminHeader({
  rates,
  onSync,
  isSyncing,
  onRestoreMarket,
  isRestoring,
  onOpenBroadcastModal
}) {
  const isOverride = Boolean(rates?.isManualOverride);
  const lastSyncStr = rates?.lastSyncedAt
    ? new Date(rates.lastSyncedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' +
      new Date(rates.lastSyncedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Pending';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h2 className="text-xl sm:text-2xl font-serif font-light text-foreground tracking-tight">
            Bullion Market Rates
          </h2>
          {isOverride ? (
            <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-900/90 dark:text-amber-200 font-medium">
              Custom Benchmark
            </span>
          ) : (
            <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-foreground font-medium">
              Market Live Sync
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Karachi Sarafa Source (gold.pk) • Last pulse: {lastSyncStr}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenBroadcastModal}
          className="text-xs font-mono h-9 cursor-pointer border-border hover:bg-muted text-foreground"
        >
          <Mail className="size-3.5 mr-1.5 text-muted-foreground" />
          Broadcast Rates
        </Button>

        {isOverride && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRestoreMarket}
            disabled={isRestoring || isSyncing}
            className="text-xs font-mono h-9 cursor-pointer"
          >
            <RotateCcw className={`size-3.5 mr-1.5 ${isRestoring ? 'animate-spin' : ''}`} />
            Revert to Market
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          onClick={onSync}
          disabled={isSyncing}
          className="bg-foreground text-background hover:bg-neutral-800 text-xs font-mono h-9 px-4 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Live Market'}
        </Button>
      </div>
    </div>
  );
}
