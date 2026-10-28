import React, { useState } from 'react';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHistoryList({ history = [], onRequestDelete, onReapplyRate }) {
  const [activeTab, setActiveTab] = useState('gold');

  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-6 text-center">
        <History className="size-6 mx-auto text-muted-foreground/40 mb-1.5" />
        <p className="text-xs text-muted-foreground">No rate history recorded yet.</p>
      </div>
    );
  }

  const filteredHistory = history.filter((item) => {
    if (activeTab === 'gold') return Boolean(item.gold24kTola);
    if (activeTab === 'silver') return Boolean(item.silver24kTola);
    return true;
  });

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="p-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground tracking-tight">
            {activeTab === 'gold' ? 'Gold Rate History' : 'Silver Rate History'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeTab === 'gold'
              ? 'Past 24K gold bullion benchmark updates'
              : 'Past silver bullion benchmark updates'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg border border-border/60 bg-muted/30">
            <button
              type="button"
              onClick={() => setActiveTab('gold')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'gold'
                  ? 'bg-foreground text-background font-medium shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gold Rates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('silver')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'silver'
                  ? 'bg-foreground text-background font-medium shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Silver Rates
            </button>
          </div>

          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            {filteredHistory.length} records
          </span>
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {filteredHistory.slice(0, 10).map((item) => {
          const d = new Date(item.createdAt || item.timestamp);
          const timeStr =
            d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ', ' +
            d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const isManual = Boolean(item.isManualOverride);
          const displayPrice =
            activeTab === 'gold' ? item.gold24kTola : item.silver24kTola;

          return (
            <div
              key={item._id || item.id}
              className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground min-w-[120px]">
                  {timeStr}
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {formatPkr(displayPrice)}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    / Tola ({activeTab === 'gold' ? '24K Gold' : 'Silver'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border bg-muted/30 text-muted-foreground">
                  {isManual ? 'Manual' : 'Live Sync'}
                </span>

                {onReapplyRate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onReapplyRate(item, activeTab)}
                    title={`Restore this ${activeTab} rate`}
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                )}

                {onRequestDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRequestDelete(item)}
                    title="Delete log"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}