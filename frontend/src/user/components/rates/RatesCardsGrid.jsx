import React from 'react';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesCardsGrid({ rates }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const cards = [
    {
      hallmark: 'AU · 999.0',
      title: '24K Pure Gold',
      purity: '99.9% Pure',
      tola: gold['24K']?.tola,
      tenG: gold['24K']?.tenGram,
      oneG: gold['24K']?.gram
    },
    {
      hallmark: 'AU · 916.6',
      title: '22K Bridal Gold',
      purity: '91.6% Pure',
      tola: gold['22K']?.tola,
      tenG: gold['22K']?.tenGram,
      oneG: gold['22K']?.gram
    },
    {
      hallmark: 'AU · 875.0',
      title: '21K Heritage Gold',
      purity: '87.5% Pure',
      tola: gold['21K']?.tola,
      tenG: gold['21K']?.tenGram,
      oneG: gold['21K']?.gram
    },
    {
      hallmark: 'AG · 999.0',
      title: '24K Pure Silver',
      purity: '99.9% Fine',
      tola: silver['24K']?.tola,
      tenG: silver['24K']?.tenGram,
      oneG: silver['24K']?.gram
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {cards.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-border/70 bg-card p-5 flex flex-col justify-between hover:border-amber-500/30 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-muted-foreground uppercase mb-3">
              <span className="font-semibold text-foreground/80">{item.hallmark}</span>
              <span className="text-[10px] text-muted-foreground">{item.purity}</span>
            </div>

            <h3 className="text-base font-serif font-medium text-foreground tracking-tight">
              {item.title}
            </h3>

            <div className="mt-4 pt-3 border-t border-border/50">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                1 Tola (11.66g)
              </span>
              <div className="text-2xl font-serif font-light text-foreground tracking-tight mt-0.5">
                {formatPkr(item.tola)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 mt-4 border-t border-border/40 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                10 Grams
              </span>
              <span className="font-mono text-xs font-medium text-foreground">
                {formatPkr(item.tenG)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                1 Gram
              </span>
              <span className="font-mono text-xs font-medium text-foreground">
                {formatPkr(item.oneG)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
