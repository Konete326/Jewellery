import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Clock } from 'lucide-react';
import { LuxuryButton } from '@/user/components/LuxuryButton';
import { generateRateBulletinPdf } from '@/utils/ratePdfGenerator';

export function RatesHero({ rates, onRefresh, isRefreshing }) {
  const lastSyncDate = rates?.lastSyncedAt ? new Date(rates.lastSyncedAt) : new Date();
  const formattedDate = lastSyncDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
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
    <div className="w-full rounded-2xl border border-border/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium shrink-0 ${
              isWeekend
                ? 'bg-muted text-muted-foreground border border-border'
                : 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
            }`}>
              <span className={`size-1.5 rounded-full shrink-0 ${isWeekend ? 'bg-muted-foreground' : 'bg-amber-600 animate-pulse'}`} />
              {isWeekend ? 'Market Closed' : 'Live Market Rates'}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/60 text-muted-foreground text-xs font-mono shrink-0">
              <Clock className="size-3 text-muted-foreground/80 shrink-0" />
              <span>{formattedDate} · {formattedTime}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-foreground tracking-tight">
            Karachi Gold & Silver Market Rates
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-2xl leading-relaxed">
            Official daily benchmark prices from the Karachi Sarafa Market, updated in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-amber-500/10 hover:border-amber-500/40 text-xs uppercase tracking-wider font-medium text-foreground hover:text-amber-900 dark:hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50 select-none shadow-2xs"
            title="Refresh rates"
          >
            <motion.span
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0.3 }}
              className="inline-flex items-center justify-center"
            >
              <RefreshCw className="size-3.5" />
            </motion.span>
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </motion.button>

          <LuxuryButton
            type="button"
            variant="gold"
            onClick={() => generateRateBulletinPdf(rates)}
            className="justify-center"
          >
            <Download size={14} className="text-amber-300" />
            Download PDF
          </LuxuryButton>
        </div>
      </div>
    </div>
  );
}
