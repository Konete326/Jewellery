import React, { useEffect } from 'react';
import { JEWELLERY_CATEGORIES, normalizeCategory } from '@/constants/categories';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, X, Check, RotateCcw } from 'lucide-react';
import { Portal } from '@/components/portal';

export const SORT_OPTIONS = [
  { slug: 'featured', title: 'Featured' },
  { slug: 'newest', title: 'Newest Masterpieces' },
  { slug: 'rating', title: 'Highest Rated' },
  { slug: 'title-asc', title: 'Name: A to Z' },
  { slug: 'title-desc', title: 'Name: Z to A' }
];

export function MobileFilterTrigger({
  onClick,
  selectedCategory = 'all',
  selectedSort = 'featured',
  className
}) {
  const sortTitle = SORT_OPTIONS.find((s) => s.slug === selectedSort)?.title || 'Featured';
  const categoryTitle = selectedCategory === 'all' ? 'All Pieces' : selectedCategory;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label="Open filter and sort drawer"
      className={cn(
        'md:hidden flex items-center justify-between w-full h-11 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-mono uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mb-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Filter & Sort</span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate max-w-[180px]">
        <span className="truncate capitalize">{categoryTitle}</span>
        <span>•</span>
        <span className="truncate">{sortTitle}</span>
      </div>
    </button>
  );
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategory = 'all',
  onSelectCategory,
  categories = JEWELLERY_CATEGORIES,
  countsByCategory = {},
  totalCount = 0,
  selectedSort = 'featured',
  onSelectSort,
  onResetAll
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allCategories = ['all', ...(categories && categories.length > 0 ? categories : JEWELLERY_CATEGORIES)];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter and Sort Masterpieces"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl bg-background border-t border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        <div className="p-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <h3 className="font-serif text-base font-medium text-foreground">
              Filter & Sort
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
              {totalCount} Pieces
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2.5 font-semibold">
              Collections
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allCategories.map((cat) => {
                const isActive = normalizeCategory(selectedCategory).toLowerCase() === normalizeCategory(cat).toLowerCase();
                const label = cat === 'all' ? 'All Pieces' : cat;
                const count = cat === 'all' ? totalCount : (countsByCategory[cat] ?? null);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5',
                      isActive
                        ? 'border-foreground bg-foreground text-background font-medium shadow-xs'
                        : 'border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <span>{label}</span>
                    {count !== null && (
                      <span className={cn('text-[10px] tabular-nums', isActive ? 'text-background/80' : 'text-muted-foreground')}>
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2.5 font-semibold">
              Sort by
            </span>
            <div className="space-y-1.5">
              {SORT_OPTIONS.map((opt) => {
                const isActive = selectedSort === opt.slug;
                return (
                  <button
                    key={opt.slug}
                    type="button"
                    onClick={() => onSelectSort(opt.slug)}
                    className={cn(
                      'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer text-left',
                      isActive
                        ? 'border-foreground bg-foreground text-background font-medium shadow-xs'
                        : 'border-border/70 bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <span>{opt.title}</span>
                    {isActive && <Check className="size-3.5 text-background" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/80 bg-muted/20 flex items-center gap-2">
          {onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="flex-1 h-11 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Masterpieces ({totalCount})</span>
          </button>
        </div>
      </div>
    </Portal>
  );
}

export function ShopCollectionsFilter({
  selectedCategory = 'all',
  onSelectCategory,
  categories = JEWELLERY_CATEGORIES,
  countsByCategory = {},
  totalCount = 0,
  className
}) {
  const allCategories = ['all', ...(categories && categories.length > 0 ? categories : JEWELLERY_CATEGORIES)];

  return (
    <nav className={cn('hidden md:block w-full', className)}>
      <h3 className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-3 font-medium">
        Collections
      </h3>

      <ul className="flex flex-col space-y-2 text-xs font-mono">
        {allCategories.map((cat) => {
          const isActive = normalizeCategory(selectedCategory).toLowerCase() === normalizeCategory(cat).toLowerCase();
          const label = cat === 'all' ? 'All Pieces' : cat;
          const count = cat === 'all' ? totalCount : (countsByCategory[cat] ?? null);

          return (
            <li key={cat}>
              <button
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  'w-full text-left py-1 transition-colors cursor-pointer flex items-center justify-between group',
                  isActive
                    ? 'font-medium text-foreground underline underline-offset-8 decoration-foreground/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="truncate pr-2">{label}</span>
                {count !== null && (
                  <span className={cn(
                    'text-[10px] tabular-nums',
                    isActive ? 'text-foreground' : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ShopSortFilter({
  selectedSort = 'featured',
  onSelectSort,
  className
}) {
  return (
    <nav className={cn('hidden md:block w-full', className)}>
      <h3 className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-3 font-medium">
        Sort by
      </h3>

      <ul className="flex flex-col space-y-2 text-xs font-mono">
        {SORT_OPTIONS.map((opt) => {
          const isActive = selectedSort === opt.slug;
          return (
            <li key={opt.slug}>
              <button
                type="button"
                onClick={() => onSelectSort(opt.slug)}
                className={cn(
                  'w-full text-left py-1 transition-colors cursor-pointer truncate',
                  isActive
                    ? 'font-medium text-foreground underline underline-offset-8 decoration-foreground/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
