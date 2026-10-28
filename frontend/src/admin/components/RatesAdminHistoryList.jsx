import React from 'react';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHistoryList({ history = [], onDeleteLog, onReapplyRate }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
        <History className="size-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm font-light text-muted-foreground">No rate change records logged yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-border/40 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground tracking-tight">
            Recent Rate Audit Trail
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Automated market syncs and atelier benchmark adjustments
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {history.length} records
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {history.slice(0, 10).map((item) => {
          const d = new Date(item.createdAt || item.timestamp);
          const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
            d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const isManual = Boolean(item.isManualOverride);

          return (
            <div
              key={item._id || item.id}
              className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground min-w-[120px]">
                  {timeStr}
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">
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
                <Badge
                  variant={isManual ? 'secondary' : 'outline'}
                  className="text-[10px] font-mono uppercase"
                >
                  {isManual ? 'Manual' : 'Live Sync'}
                </Badge>

                <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[100px] hidden md:inline-block">
                  {item.updatedBy || 'System'}
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
