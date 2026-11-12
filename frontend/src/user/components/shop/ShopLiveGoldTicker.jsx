import React, { useState, useEffect } from 'react';
import { ratesApi } from '@/api/ratesApi';
import { formatPKR } from '@/utils/pricing';
import { cn } from '@/lib/utils';

export function ShopLiveGoldTicker({ className }) {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    let isMounted = true;
    ratesApi.getRates({ silent: true })
      .then((res) => {
        if (isMounted && res?.data) {
          setRates(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const rate24kTola = Number(rates?.rate24k?.perTola) || Number(rates?.k24?.perTola) || 0;
  const rate22kTola = Number(rates?.rate22k?.perTola) || Number(rates?.k22?.perTola) || 0;
  const rate21kTola = Number(rates?.rate21k?.perTola) || Number(rates?.k21?.perTola) || 0;

  if (!rates && !rate24kTola) return null;

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 p-2 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-2xs',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-amber-900 dark:text-amber-300">
            Sarafa Live Rates
          </span>
          <span className="text-[10px] font-sans text-muted-foreground hidden md:inline">
            • Saddar Karachi Market Benchmark
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-[11px]">
          {rate24kTola > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/20 bg-background/80">
              <span className="text-muted-foreground uppercase text-[10px]">24K Pure:</span>
              <strong className="text-foreground font-semibold">
                {formatPKR(rate24kTola)}
              </strong>
              <span className="text-[9px] text-muted-foreground font-sans">/tola</span>
            </div>
          )}

          {rate22kTola > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/20 bg-background/80">
              <span className="text-muted-foreground uppercase text-[10px]">22K Jewellery:</span>
              <strong className="text-foreground font-semibold">
                {formatPKR(rate22kTola)}
              </strong>
              <span className="text-[9px] text-muted-foreground font-sans">/tola</span>
            </div>
          )}

          {rate21kTola > 0 && (
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/20 bg-background/80">
              <span className="text-muted-foreground uppercase text-[10px]">21K Bridal:</span>
              <strong className="text-foreground font-semibold">
                {formatPKR(rate21kTola)}
              </strong>
              <span className="text-[9px] text-muted-foreground font-sans">/tola</span>
            </div>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
            Verified Live
          </span>
        </div>
      </div>
    </div>
  );
}
