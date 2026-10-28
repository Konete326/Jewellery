import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RatesAdminHeader({
  rates,
  onSync,
  isSyncing,
  onRestoreMarket,
  isRestoring
}) {
  const isOverride = Boolean(rates?.isManualOverride);
  const lastSyncStr = rates?.lastSyncedAt
    ? new Date(rates.lastSyncedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' +
      new Date(rates.lastSyncedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Pending';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-2xl font-serif font-light text-foreground tracking-tight">
            Gold Rates
          </h1>
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-border/80 bg-muted/40 text-foreground">
            {isOverride ? 'Manual Rate' : 'Market Live'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Sarafa Market (gold.pk) • Last synced: {lastSyncStr}
        </p>
      </div>

      <div className="flex items-center gap-2">
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
            Revert to Live
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
