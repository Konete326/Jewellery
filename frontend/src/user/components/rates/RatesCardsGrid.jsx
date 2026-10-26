import React from 'react';
import { Gem, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesCardsGrid({ rates }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const cards = [
    {
      title: '24 Karat Pure Gold',
      subtitle: 'Bullion standard (.999 pure)',
      badge: '99.9% Pure',
      badgeClass: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
      icon: <Gem className="size-5 text-amber-700 dark:text-amber-400" />,
      tola: gold['24K']?.tola,
      tenG: gold['24K']?.tenGram,
      oneG: gold['24K']?.gram,
      note: 'Reference bullion rate for Sarafa trading'
    },
    {
      title: '22 Karat Bridal Gold',
      subtitle: 'Pakistani bridal & wedding jewellery',
      badge: 'Most Popular',
      badgeClass: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20',
      icon: <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />,
      tola: gold['22K']?.tola,
      tenG: gold['22K']?.tenGram,
      oneG: gold['22K']?.gram,
      note: 'Optimal tensile strength for intricate filigree & stones'
    },
    {
      title: '21 Karat Traditional Gold',
      subtitle: 'Antique finish & heirloom bangles',
      badge: '87.5% Purity',
      badgeClass: 'bg-neutral-500/10 text-neutral-800 dark:text-neutral-300 border-neutral-500/20',
      icon: <Sparkles className="size-5 text-neutral-600 dark:text-neutral-300" />,
      tola: gold['21K']?.tola,
      tenG: gold['21K']?.tenGram,
      oneG: gold['21K']?.gram,
      note: 'Traditional South Asian gold craft standard'
    },
    {
      title: '24 Karat Pure Silver',
      subtitle: 'Fine silver (Chandi) bullion',
      badge: 'Fine Silver',
      badgeClass: 'bg-slate-500/10 text-slate-800 dark:text-slate-300 border-slate-500/20',
      icon: <TrendingUp className="size-5 text-slate-600 dark:text-slate-400" />,
      tola: silver['24K']?.tola,
      tenG: silver['24K']?.tenGram,
      oneG: silver['24K']?.gram,
      note: 'Sarafa association certified silver bullion'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
      {cards.map((item, index) => (
        <div
          key={index}
          className="relative rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-md transition-all duration-300 group"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center">
                {item.icon}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                {item.badge}
              </span>
            </div>

            <h3 className="text-base font-medium text-foreground tracking-tight mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground font-light mb-4">
              {item.subtitle}
            </p>

            <div className="pt-2 pb-4 border-y border-border/60">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono block mb-1">
                1 Tola (11.664 Grams)
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
                {formatPkr(item.tola)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  10 Grams
                </span>
                <span className="text-xs font-semibold font-mono text-foreground">
                  {formatPkr(item.tenG)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  1 Gram
                </span>
                <span className="text-xs font-semibold font-mono text-foreground">
                  {formatPkr(item.oneG)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/40 text-[11px] text-muted-foreground/80 font-light">
            {item.note}
          </div>
        </div>
      ))}
    </div>
  );
}
