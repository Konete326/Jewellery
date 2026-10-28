import React from 'react';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHistoryList({ history = [], onDeleteLog, onReapplyRate }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-6 text-center">
        <History className="size-6 mx-auto text-muted-foreground/40 mb-1.5" />
        <p className="text-xs text-muted-foreground">No rate history recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground tracking-tight">
            Rate History
          </h3>
          <p className="text-xs text-muted-foreground">
            Recent price updates and adjustments
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {history.length} records
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {history.slice(0, 8).map((item) => {
          const d = new Date(item.createdAt || item.timestamp);
          const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
            d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const isManual = Boolean(item.isManualOverride);

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
                    {formatPkr(item.gold24kTola)}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    (Gold)
                  </span>
                  {item.silver24kTola && (
                    <>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatPkr(item.silver24kTola)} (Silver)
                      </span>
                    </>
                  )}
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
                    onClick={() => onReapplyRate(item)}
                    title="Restore this rate"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                )}

                {onDeleteLog && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteLog(item._id || item.id)}
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
