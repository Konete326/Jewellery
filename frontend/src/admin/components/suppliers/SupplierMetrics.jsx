import React from 'react';
import { Building2, CheckCircle2, Archive, Gem } from 'lucide-react';

export function SupplierMetrics({ suppliers = [], pagination = {} }) {
  const total = pagination.total ?? suppliers.length;
  const activeCount = suppliers.filter((s) => s.status === 'active').length;
  const archivedCount = suppliers.filter((s) => s.status === 'archived').length;

  const categoryFrequency = suppliers.reduce((acc, s) => {
    (s.suppliedCategories || []).forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});

  const topCategory = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Gold';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-amber-500/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Total Sourcing Partners
          </span>
          <Building2 className="size-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {total}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">Registered</span>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Active Accounts
          </span>
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">Live Supply</span>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Archived Ledger
          </span>
          <Archive className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {archivedCount}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">Preserved</span>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-amber-500/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Primary Material
          </span>
          <Gem className="size-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            {topCategory}
          </span>
          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">Hub</span>
        </div>
      </div>
    </div>
  );
}

