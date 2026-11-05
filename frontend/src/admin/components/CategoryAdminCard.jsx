import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryAdminCard({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading = false
}) {
  const [imgError, setImgError] = useState(false);

  const itemCount = category.itemCount ?? 0;
  const isActive = Boolean(category.isActive);

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden shadow-xs transition-all flex flex-col justify-between hover:border-foreground/30 ${
      isActive ? 'border-border/80' : 'border-border/50 opacity-75'
    }`}>
      <div>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 border-b border-border/80">
          {!imgError && category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              onError={() => setImgError(true)}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-neutral-900 to-amber-500/5 p-4 text-center">
              <span className="font-serif italic font-bold text-amber-400 text-lg tracking-wider">
                {category.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                Jewellery Collection
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
              {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] uppercase font-mono tracking-widest font-semibold ${
              isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-500'
            }`}>
              {isActive ? 'Active' : 'Hidden'}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
              /{category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-foreground tracking-tight line-clamp-1">
            {category.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
            {category.description || 'Jewellery category collection.'}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 border-t border-border/70 bg-muted/20 flex items-center justify-end gap-1.5 text-xs">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onToggleStatus(category)}
          disabled={actionLoading}
          title={isActive ? 'Hide on storefront' : 'Make live on storefront'}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </Button>

        <Link
          to={`/admin/gallery?category=${encodeURIComponent(category.name)}`}
          title="Inspect gallery pieces under this category"
          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ExternalLink className="size-3.5" />
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          disabled={actionLoading}
          title="Edit category details"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Pencil className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          disabled={actionLoading}
          title="Delete category"
          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}