import React from 'react';

export function CategoryAdminMetrics({ categories = [] }) {
  const totalCollections = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const totalPieces = categories.reduce((sum, c) => sum + (c.itemCount || 0), 0);
  const pureBullionCount = categories.filter((c) =>
    (c.metalStandard || '').toLowerCase().includes('24k') || (c.hallmark || '').includes('999')
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Total Collections
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            CURATED
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalCollections}
          </span>
          <span className="text-xs text-muted-foreground">Classifications</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Live on Storefront
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            ACTIVE
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {activeCount}
          </span>
          <span className="text-xs text-muted-foreground">Visible to Public</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Cataloged Pieces
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            INVENTORY
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalPieces}
          </span>
          <span className="text-xs text-muted-foreground">Masterpieces</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Assay Standards
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
            AU · 916.6
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xs font-semibold text-foreground">
            24K • 22K • 21K • 18K
          </span>
          {pureBullionCount > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono">
              ({pureBullionCount} Bullion)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
