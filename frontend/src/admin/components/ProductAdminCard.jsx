import React, { useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductAdminCard({
  product,
  onEdit,
  onDelete,
  onTogglePublish,
  actionLoading = false
}) {
  const [imgError, setImgError] = useState(false);

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images[0] || '';
  const isPublished = Boolean(product.isPublished);
  const stock = Number(product.stock) || 0;
  const hallmark = product.hallmark || 'AU · 916.6';
  const metal = product.metal || '22K Gold';

  const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden shadow-xs transition-all flex flex-col justify-between hover:border-foreground/30 ${
      isPublished ? 'border-border/80' : 'border-border/50 opacity-75'
    }`}>
      <div>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 border-b border-border/80">
          {!imgError && primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title}
              onError={() => setImgError(true)}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-neutral-900 to-amber-500/5 p-4 text-center">
              <span className="font-serif italic font-bold text-amber-400 text-lg tracking-wider">
                {hallmark}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                {product.category || 'Fine Jewellery'}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest font-semibold bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              {hallmark}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md border ${
              stock > 0
                ? 'bg-black/60 border-white/10 text-white'
                : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
            }`}>
              {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
            </span>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
                {images.length} Photos
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold truncate">
              {product.category || 'Jewellery'}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
              {metal} {product.weight ? `• ${product.weight}` : ''}
            </span>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground tracking-tight line-clamp-1">
              {product.title}
            </h3>
            <div className="mt-1 font-mono text-base font-bold text-foreground">
              {formatPKR(product.price)}
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
            {product.description || 'Certified authentic gold jewellery masterpiece crafted in Saddar, Karachi.'}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 border-t border-border/70 bg-muted/20 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-muted-foreground block truncate">
            /{product.slug || 'product'}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onTogglePublish(product)}
            disabled={actionLoading}
            title={isPublished ? 'Hide product on storefront' : 'Publish product live'}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isPublished ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            disabled={actionLoading}
            title="Edit product"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Pencil className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            disabled={actionLoading}
            title="Delete product"
            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
