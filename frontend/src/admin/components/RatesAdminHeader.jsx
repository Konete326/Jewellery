import React from 'react';
import { RefreshCw, RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-serif font-light text-foreground tracking-tight">
            Bullion Market Rates
          </h2>
          {isOverride ? (
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
              Custom Benchmark
            </Badge>
          ) : (
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono text-[10px]">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              Automated Live Sync
            </Badge>
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
          className="text-xs font-mono h-9 cursor-pointer border-amber-500/30 hover:bg-amber-500/10 text-foreground"
        >
          <Mail className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
          Broadcast Rates via Email
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
          className="bg-foreground text-background hover:opacity-90 text-xs font-mono h-9 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Live Market'}
        </Button>
      </div>
    </div>
  );
}
