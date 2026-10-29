import React from 'react';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const SORT_OPTIONS = [
  { slug: 'featured', title: 'Featured' },
  { slug: 'newest', title: 'Newest Masterpieces' },
  { slug: 'rating', title: 'Highest Rated' },
  { slug: 'title-asc', title: 'Name: A to Z' },
  { slug: 'title-desc', title: 'Name: Z to A' }
];

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
    <nav className={cn('w-full', className)}>
      <h3 className="hidden md:block text-xs uppercase tracking-widest font-mono text-muted-foreground mb-3 font-medium">
        Collections
      </h3>

      <div className="md:hidden mb-2">
        <label htmlFor="mobile-collection-select" className="sr-only">Select Collection</label>
        <div className="relative">
          <select
            id="mobile-collection-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full h-10 px-3.5 pr-8 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono uppercase tracking-wider appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? `All Collections (${totalCount})` : cat}
              </option>
            ))}
          </select>
          <ChevronDown className="size-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <ul className="hidden md:flex flex-col space-y-2 text-xs font-mono">
        {allCategories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
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
    <nav className={cn('w-full', className)}>
      <h3 className="hidden md:block text-xs uppercase tracking-widest font-mono text-muted-foreground mb-3 font-medium">
        Sort by
      </h3>

      <div className="md:hidden mb-2">
        <label htmlFor="mobile-sort-select" className="sr-only">Sort by</label>
        <div className="relative">
          <select
            id="mobile-sort-select"
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="w-full h-10 px-3.5 pr-8 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono uppercase tracking-wider appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.title}
              </option>
            ))}
          </select>
          <ChevronDown className="size-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <ul className="hidden md:flex flex-col space-y-2 text-xs font-mono">
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
