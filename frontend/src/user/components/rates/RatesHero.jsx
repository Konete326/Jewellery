import React from 'react';
import { Download, RefreshCw, Sparkles, Clock, MapPin } from 'lucide-react';
import { LuxuryButton } from '@/user/components/LuxuryButton';
import { generateRateBulletinPdf } from '@/utils/ratePdfGenerator';

export function RatesHero({ rates, onRefresh, isRefreshing }) {
  const lastSyncDate = rates?.lastSyncedAt ? new Date(rates.lastSyncedAt) : new Date();
  const formattedDate = lastSyncDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = lastSyncDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const isWeekend = rates?.marketStatus?.toLowerCase().includes('weekend') ||
    rates?.marketStatus?.toLowerCase().includes('closed') ||
    lastSyncDate.getDay() === 0;

  return (
    <div className="relative w-full rounded-3xl border border-border/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-10 shadow-xs mb-10 overflow-hidden">
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isWeekend ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono uppercase tracking-wider font-medium">
                <span className="size-2 rounded-full bg-amber-500" />
                Weekend • Saturday Closing Benchmark
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sarafa Market Sync
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono">
              <Clock className="size-3" />
              {formattedDate} • {formattedTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-foreground tracking-tight">
            Karachi Sarafa Market <span className="italic font-normal">Gold & Silver</span> Rates
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            {isWeekend
              ? 'Karachi Sarafa Market is closed on Sundays and official holidays. Rates displayed reflect the verified Saturday closing benchmark certified at the Khalil & Sons atelier in Saddar.'
              : 'Official daily bullion benchmark prices sourced from the Karachi Sarafa Jewellers Association (gold.pk) and verified at the Khalil & Sons atelier hallmark bench in Saddar, Karachi.'}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-mono">
            <MapPin className="size-3.5 text-amber-700 dark:text-amber-400" />
            <span>Market Benchmark: {rates?.marketSource || 'Karachi Sarafa Jewellers Association (gold.pk)'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs uppercase tracking-wider font-medium text-foreground transition-all cursor-pointer disabled:opacity-50"
            title="Refresh current market rates"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Refresh'}</span>
          </button>

          <LuxuryButton
            type="button"
            variant="gold"
            onClick={() => generateRateBulletinPdf(rates)}
            className="justify-center"
          >
            <Download size={14} className="text-amber-300" />
            Download Rate Sheet (PDF)
          </LuxuryButton>
        </div>
      </div>
    </div>
  );
}
