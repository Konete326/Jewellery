import React, { useState } from 'react';
import { cn } from '@/lib/utils';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesTableSection({ rates }) {
  const [activeTab, setActiveTab] = useState('gold');
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const goldRows = [
    {
      karat: '24 Karat Gold',
      purity: '99.9%',
      hallmark: 'AU · 999.0',
      subtitle: 'Pure Bullion (24K)',
      tola: gold['24K']?.tola,
      tenG: gold['24K']?.tenGram,
      oneG: gold['24K']?.gram,
      isPrimary: false
    },
    {
      karat: '22 Karat Gold',
      purity: '91.6%',
      hallmark: 'AU · 916.6',
      subtitle: 'Jewellery Standard (22K)',
      tola: gold['22K']?.tola,
      tenG: gold['22K']?.tenGram,
      oneG: gold['22K']?.gram,
      isPrimary: true
    },
    {
      karat: '21 Karat Gold',
      purity: '87.5%',
      hallmark: 'AU · 875.0',
      subtitle: 'Traditional Jewellery',
      tola: gold['21K']?.tola,
      tenG: gold['21K']?.tenGram,
      oneG: gold['21K']?.gram,
      isPrimary: false
    },
    {
      karat: '18 Karat Gold',
      purity: '75.0%',
      hallmark: 'AU · 750.0',
      subtitle: 'Diamond Jewellery Benchmark',
      tola: gold['18K']?.tola,
      tenG: gold['18K']?.tenGram,
      oneG: gold['18K']?.gram,
      isPrimary: false
    }
  ];

  const silverRows = [
    {
      karat: '925 Pure Silver',
      purity: '92.5%',
      hallmark: 'AG · 925.0',
      subtitle: 'Sterling Silver (925)',
      tola: silver['22K']?.tola,
      tenG: silver['22K']?.tenGram,
      oneG: silver['22K']?.gram,
      isPrimary: true
    },
    {
      karat: 'Fine Silver Bullion',
      purity: '99.9%',
      hallmark: 'AG · 999.0',
      subtitle: 'Pure Silver Bullion (999)',
      tola: silver['24K']?.tola,
      tenG: silver['24K']?.tenGram,
      oneG: silver['24K']?.gram,
      isPrimary: false
    }
  ];

  const currentRows = activeTab === 'gold' ? goldRows : silverRows;

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-4 sm:p-8 shadow-xs mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80 mb-6">
        <div className="inline-flex rounded-xl p-1 bg-muted/80 border border-border/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('gold')}
            className={cn(
              'px-4 sm:px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-mono transition-all cursor-pointer',
              activeTab === 'gold'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Gold Rates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('silver')}
            className={cn(
              'px-4 sm:px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-mono transition-all cursor-pointer',
              activeTab === 'silver'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Silver Rates
          </button>
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          {activeTab === 'gold' ? (
            <span>
              Gold Standard: <strong className="text-foreground font-semibold">1 Tola = 11.664 Grams</strong>
            </span>
          ) : (
            <span>
              Silver Standard: <strong className="text-foreground font-semibold">925 Sterling & 999 Fine Silver</strong>
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-3 sm:py-4 px-3 sm:px-6">Karat / Quality</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-right">Per 1 Tola</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-right">Per 10 Gram</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-right">Per 1 Gram</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {currentRows.map((row) => (
              <tr
                key={row.hallmark}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  row.isPrimary && 'bg-amber-500/[0.03]'
                )}
              >
                <td className="py-3.5 sm:py-4 px-3 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-amber-900/90 dark:text-amber-400 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                      {row.hallmark}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-serif font-medium text-foreground text-sm sm:text-base lg:text-lg tracking-tight">
                          {row.karat}
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground">
                          ({row.purity})
                        </span>
                        {row.isPrimary && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-500/30 font-medium">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground font-light">
                        {row.subtitle}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 sm:py-4 px-3 sm:px-6 text-right">
                  <div className="font-serif text-base sm:text-lg lg:text-xl font-semibold text-amber-950 dark:text-amber-100 tracking-tight whitespace-nowrap">
                    {formatPkr(row.tola)}
                  </div>
                </td>

                <td className="py-3.5 sm:py-4 px-3 sm:px-6 text-right font-mono text-xs sm:text-sm lg:text-base font-medium text-foreground whitespace-nowrap">
                  {formatPkr(row.tenG)}
                </td>

                <td className="py-3.5 sm:py-4 px-3 sm:px-6 text-right font-mono text-xs sm:text-sm lg:text-base font-normal text-muted-foreground whitespace-nowrap">
                  {formatPkr(row.oneG)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
