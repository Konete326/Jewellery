import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminOverview({ rates, onSync, isSyncing }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};
  const isOverride = Boolean(rates?.isManualOverride);

  const lastSyncStr = rates?.lastSyncedAt
    ? new Date(rates.lastSyncedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Not synced yet';

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Market Status
            </span>
            {isOverride ? (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-mono text-[11px]">
                <AlertTriangle className="size-3 mr-1 text-amber-600" />
                Manual Atelier Override Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono text-[11px]">
                <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                Live Sarafa Market Sync Active
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-serif font-light text-foreground">
            Current Published Bullion Rates
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Source: {rates?.marketSource || 'Karachi Sarafa Jewellers Association (gold.pk)'} • Last sync: {lastSyncStr} ({rates?.updatedBy || 'System'})
          </p>
        </div>

        <Button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="bg-foreground text-background hover:opacity-90 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Live (gold.pk)'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            24K Pure Gold (1 Tola)
          </span>
          <div className="text-2xl font-serif font-light text-foreground">
            {formatPkr(gold['24K']?.tola)}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono mt-1">
            10g: {formatPkr(gold['24K']?.tenGram)} | 1g: {formatPkr(gold['24K']?.gram)}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            22K Bridal Gold (1 Tola)
          </span>
          <div className="text-2xl font-serif font-light text-foreground">
            {formatPkr(gold['22K']?.tola)}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono mt-1">
            10g: {formatPkr(gold['22K']?.tenGram)} | 1g: {formatPkr(gold['22K']?.gram)}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            21K Traditional Gold (1 Tola)
          </span>
          <div className="text-2xl font-serif font-light text-foreground">
            {formatPkr(gold['21K']?.tola)}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono mt-1">
            10g: {formatPkr(gold['21K']?.tenGram)} | 1g: {formatPkr(gold['21K']?.gram)}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            24K Pure Silver (1 Tola)
          </span>
          <div className="text-2xl font-serif font-light text-foreground">
            {formatPkr(silver['24K']?.tola)}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono mt-1">
            10g: {formatPkr(silver['24K']?.tenGram)} | 1g: {formatPkr(silver['24K']?.gram)}
          </div>
        </div>
      </div>
    </div>
  );
}
