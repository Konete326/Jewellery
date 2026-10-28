import React, { useState, useMemo } from 'react';
import { GalleryProductCard } from './GalleryProductCard';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Search, LayoutGrid } from 'lucide-react';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';

export function GalleryCatalogGrid({
  items = [],
  onEdit,
  onDelete,
  onInspectReviews,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Masterpiece Vault Catalog
            </h3>
            <Badge variant="outline" className="font-mono text-[10px]">
              {filteredItems.length} of {items.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full inventory of pieces published to client catalog and archive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 w-full sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background font-medium'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {JEWELLERY_CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-foreground text-background font-medium'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-xl bg-muted/10">
          <ImageIcon className="size-8 text-muted-foreground/40 mb-2" />
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
            No matching masterpieces found
          </h4>
          <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'Try adjusting your search query or category filter.'
              : 'Your gallery is currently empty. Use the New Piece button to upload.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <GalleryProductCard
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onInspectReviews={onInspectReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
