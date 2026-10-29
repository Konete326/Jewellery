import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShopSearchHeader({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'all',
  onCategoryClear,
  totalResults = 0,
  hasActiveFilters = false,
  onResetAll,
  className
}) {
  return (
    <div className={cn('w-full mb-8', className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono font-medium block mb-1.5">
            Murshid Sunaar Tower • Saddar, Karachi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
            Haute Joaillerie & Heirlooms
          </h1>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or gemstone..."
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            {searchQuery ? (
              <>
                Showing <strong className="text-foreground font-semibold">{totalResults}</strong> {totalResults === 1 ? 'result' : 'results'} for &ldquo;<span className="text-foreground">{searchQuery}</span>&rdquo;
              </>
            ) : (
              <>
                <strong className="text-foreground font-semibold">{totalResults}</strong> {totalResults === 1 ? 'Masterpiece Available' : 'Masterpieces Available'}
              </>
            )}
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-card text-foreground text-[11px]">
              <span>{selectedCategory}</span>
              <button
                type="button"
                onClick={onCategoryClear}
                className="hover:text-destructive cursor-pointer"
                aria-label="Clear category filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline underline-offset-4"
          >
            <RotateCcw className="size-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

