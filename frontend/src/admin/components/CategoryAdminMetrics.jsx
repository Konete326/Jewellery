import React from 'react';

export function CategoryAdminMetrics({ categories = [] }) {
  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const hiddenCount = totalCategories - activeCount;
  const totalPieces = categories.reduce((sum, c) => sum + (c.itemCount || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Total Categories
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            TOTAL
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalCategories}
          </span>
          <span className="text-xs text-muted-foreground">Collections</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Active / Live
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            LIVE
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {activeCount}
          </span>
          <span className="text-xs text-muted-foreground">Visible</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Hidden
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
            DRAFT
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {hiddenCount}
          </span>
          <span className="text-xs text-muted-foreground">Unpublished</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Cataloged Pieces
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            GALLERY
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalPieces}
          </span>
          <span className="text-xs text-muted-foreground">Total Items</span>
        </div>
      </div>
    </div>
  );
}