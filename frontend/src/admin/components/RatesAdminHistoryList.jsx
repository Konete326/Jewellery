import React, { useState, useMemo } from 'react';
import { History, RotateCcw, Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHistoryList({ history = [], onRequestDelete, onReapplyRate }) {
  const [activeTab, setActiveTab] = useState('gold');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const dailyHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];

    const map = new Map();
    history.forEach((item) => {
      const price = activeTab === 'gold' ? item.gold24kTola : item.silver24kTola;
      if (!price) return;

      const dateObj = new Date(item.createdAt || item.timestamp || Date.now());
      const dayKey = dateObj.toLocaleDateString('en-CA');

      if (!map.has(dayKey)) {
        map.set(dayKey, item);
      }
    });

    return Array.from(map.values());
  }, [history, activeTab]);

  const totalPages = Math.max(1, Math.ceil(dailyHistory.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = dailyHistory.slice(startIndex, startIndex + itemsPerPage);

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
      <div className="p-3.5 sm:px-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground tracking-tight">
            {activeTab === 'gold' ? 'Daily Gold Benchmark History' : 'Daily Silver Benchmark History'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeTab === 'gold'
              ? 'Past verified 24K gold rates recorded per day'
              : 'Past verified pure silver rates recorded per day'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg border border-border/60 bg-muted/30">
            <button
              type="button"
              onClick={() => handleTabChange('gold')}
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
              onClick={() => handleTabChange('silver')}
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
            {dailyHistory.length} {dailyHistory.length === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      <div className="hidden sm:block divide-y divide-border/40">
        {currentRecords.map((item) => {
          const d = new Date(item.createdAt || item.timestamp);
          const timeStr =
            d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' · ' +
            d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const isManual = Boolean(item.isManualOverride);
          const displayPrice =
            activeTab === 'gold' ? item.gold24kTola : item.silver24kTola;

          return (
            <div
              key={item._id || item.id}
              className="py-2.5 px-4 flex items-center justify-between gap-3 hover:bg-muted/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground min-w-[155px]">
                  {timeStr}
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {formatPkr(displayPrice)}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    / Tola ({activeTab === 'gold' ? '24K Gold' : 'Pure Silver'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border bg-muted/30 text-muted-foreground">
                  {isManual ? 'Manual' : 'Sarafa Sync'}
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

      <div className="block sm:hidden divide-y divide-border/40">
        {currentRecords.map((item) => {
          const d = new Date(item.createdAt || item.timestamp);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const isManual = Boolean(item.isManualOverride);
          const displayPrice = activeTab === 'gold' ? item.gold24kTola : item.silver24kTola;

          return (
            <div key={item._id || item.id} className="p-3.5 space-y-2.5 bg-card hover:bg-muted/10 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-muted-foreground text-[11px]">
                  <Calendar className="size-3" />
                  <span>{dateStr}</span>
                  <span className="text-muted-foreground/50">·</span>
                  <span>{timeStr}</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-border bg-muted/40 text-muted-foreground">
                  {isManual ? 'Manual' : 'Sarafa Sync'}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                    {activeTab === 'gold' ? '24K Gold Benchmark' : 'Pure Silver Benchmark'}
                  </span>
                  <span className="font-serif text-lg font-semibold text-foreground">
                    {formatPkr(displayPrice)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">/ 1 Tola</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                {onReapplyRate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onReapplyRate(item, activeTab)}
                    className="h-7 text-xs font-mono cursor-pointer"
                  >
                    <RotateCcw className="size-3 mr-1" />
                    Restore
                  </Button>
                )}
                {onRequestDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRequestDelete(item)}
                    className="h-7 text-xs font-mono text-muted-foreground hover:text-destructive hover:border-destructive/40 cursor-pointer"
                  >
                    <Trash2 className="size-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="p-2.5 sm:px-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
          <span className="font-mono text-[11px]">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, dailyHistory.length)} of {dailyHistory.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2.5 text-xs font-mono cursor-pointer"
            >
              <ChevronLeft className="size-3.5 mr-0.5" />
              <span>Prev</span>
            </Button>
            <span className="px-2 font-mono text-[11px] text-foreground font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 px-2.5 text-xs font-mono cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
