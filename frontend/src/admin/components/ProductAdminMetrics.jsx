import React from 'react';

export function ProductAdminMetrics({ products = [] }) {
  const totalProducts = products.length;
  const publishedCount = products.filter((p) => p.isPublished).length;
  const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalValuation = products.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

  const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Total Inventory
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            CATALOG
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalProducts}
          </span>
          <span className="text-xs text-muted-foreground">Products</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Published Live
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            STOREFRONT
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {publishedCount}
          </span>
          <span className="text-xs text-muted-foreground">Active for Sale</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Stock Units
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-border bg-muted/60 text-foreground">
            ON HAND
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {totalStockUnits}
          </span>
          <span className="text-xs text-muted-foreground">Available Units</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Inventory Value
          </span>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
            AU · ESTIMATE
          </span>
        </div>
        <div className="mt-2 truncate">
          <span className="font-mono text-sm sm:text-base font-bold text-foreground">
            {formatPKR(totalValuation)}
          </span>
        </div>
      </div>
    </div>
  );
}
