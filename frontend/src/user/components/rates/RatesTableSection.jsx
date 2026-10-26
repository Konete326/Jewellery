import React, { useState } from 'react';
import { Gem, ShieldCheck, Check } from 'lucide-react';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesTableSection({ rates }) {
  const [activeTab, setActiveTab] = useState('gold');
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const goldRows = [
    {
      karat: '24 Karat',
      name: 'Pure Bullion (Fine Gold)',
      purity: '99.9% (.999)',
      tola: gold['24K']?.tola,
      tenG: gold['24K']?.tenGram,
      oneG: gold['24K']?.gram,
      ounce: gold['24K']?.ounce,
      application: 'Investment bars, bullion biscuits, asset preservation'
    },
    {
      karat: '22 Karat',
      name: 'Bridal Standard (Jewellers Hallmark)',
      purity: '91.67% (.916)',
      tola: gold['22K']?.tola,
      tenG: gold['22K']?.tenGram,
      oneG: gold['22K']?.gram,
      ounce: null,
      application: 'Bridal sets, handcrafted kadas, churyan, Mughal necklaces'
    },
    {
      karat: '21 Karat',
      name: 'Traditional South Asian Gold',
      purity: '87.5% (.875)',
      tola: gold['21K']?.tola,
      tenG: gold['21K']?.tenGram,
      oneG: gold['21K']?.gram,
      ounce: null,
      application: 'Antique filigree work, daily heirloom bangles'
    },
    {
      karat: '18 Karat',
      name: 'Diamond Setting Benchmark',
      purity: '75.0% (.750)',
      tola: gold['18K']?.tola,
      tenG: gold['18K']?.tenGram,
      oneG: gold['18K']?.gram,
      ounce: null,
      application: 'Solitaire diamond engagement rings, delicate fine jewelry'
    }
  ];

  const silverRows = [
    {
      karat: '24 Karat',
      name: 'Fine Silver Bullion (999)',
      purity: '99.99% (.999)',
      tola: silver['24K']?.tola,
      tenG: silver['24K']?.tenGram,
      oneG: silver['24K']?.gram,
      application: 'Pure silver bullion bars, commemorative coins'
    },
    {
      karat: '22 Karat',
      name: 'Sterling Silver (925)',
      purity: '92.5% (.925)',
      tola: silver['22K']?.tola,
      tenG: silver['22K']?.tenGram,
      oneG: silver['22K']?.gram,
      application: 'Heirloom tableware, custom rings, artisan jewelry'
    }
  ];

  const currentRows = activeTab === 'gold' ? goldRows : silverRows;

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-amber-800 dark:text-amber-400 font-mono font-medium block mb-1">
            Complete Market Breakdown
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
            Detailed Bullion & Karat Benchmark
          </h2>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-muted/60 border border-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('gold')}
            className={`px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
              activeTab === 'gold'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gold Rates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('silver')}
            className={`px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
              activeTab === 'silver'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Silver Rates
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4 sm:px-6">Specification</th>
              <th className="py-3 px-4">Purity</th>
              <th className="py-3 px-4 text-right">Per 1 Tola</th>
              <th className="py-3 px-4 text-right">Per 10 Grams</th>
              <th className="py-3 px-4 text-right">Per 1 Gram</th>
              <th className="py-3 px-4 sm:px-6 hidden md:table-cell">Crafting Application</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {currentRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4 sm:px-6">
                  <div className="font-medium text-foreground">{row.karat}</div>
                  <div className="text-xs text-muted-foreground font-light">{row.name}</div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-foreground/80">
                  <span className="inline-flex items-center gap-1">
                    <Check className="size-3 text-emerald-600" />
                    {row.purity}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-serif text-base sm:text-lg font-light text-foreground whitespace-nowrap">
                  {formatPkr(row.tola)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                  {formatPkr(row.tenG)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                  {formatPkr(row.oneG)}
                </td>
                <td className="py-4 px-4 sm:px-6 text-xs text-muted-foreground font-light hidden md:table-cell max-w-xs">
                  {row.application}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-light pt-2">
        <span className="font-mono">
          * 1 Tola = 11.6638 Metric Grams (Standard Pakistani Sarafa Calibration)
        </span>
        <span>
          Making charges (jurai) & gemstone settings calculated individually per bespoke design.
        </span>
      </div>
    </div>
  );
}
