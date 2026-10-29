import React, { useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PURITY_HALLMARKS = {
  '24K': 'AU · 999.0',
  '22K': 'AU · 916.6',
  '21K': 'AU · 875.0',
  '18K': 'AU · 750.0'
};

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
  const purity = product.purity || '22K';
  const hallmark = PURITY_HALLMARKS[purity] || 'AU · 916.6';
  const availability = product.availability || (stock > 0 ? 'In Stock' : 'Out of Stock');
  const netWeight = Number(product.netWeight) || 0;
  const grossWeight = Number(product.grossWeight) || 0;
  const makingCharges = Number(product.makingCharges) || 0;
  const stoneCharges = Number(product.stoneCharges) || 0;
  const wastagePercent = Number(product.wastagePercent) || 0;
  const displayPrice = Number(product.price) || Number(product.calculatedPrice) || 0;
  const minAdvanceToLock = Number(product.minAdvanceToLock) || 0;

  const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getAvailabilityBadge = () => {
    if (availability === 'In Stock') {
      return 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300';
    }
    if (availability === 'Made to Order') {
      return 'bg-amber-950/80 border-amber-500/30 text-amber-300';
    }
    return 'bg-rose-950/80 border-rose-500/30 text-rose-300';
  };

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden shadow-xs transition-all flex flex-col justify-between hover:border-foreground/30 ${
      isPublished ? 'border-border/80' : 'border-border/50 opacity-75'
    }`}>
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 border-b border-border/80">
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
                {product.category || 'Atelier Collection'}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest font-semibold bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              {purity} · {hallmark}
            </span>
            {product.sku && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-black/60 text-white/90 border border-white/10 backdrop-blur-md">
                {product.sku}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md border ${getAvailabilityBadge()}`}>
              {availability}
            </span>
            {stock > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/80 border border-white/10 backdrop-blur-md">
                Qty: {stock}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
                {images.length} Photos
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold truncate">
              {product.category || 'Fine Jewellery'}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground shrink-0">
              <span className="font-semibold text-foreground">{netWeight}g Net</span>
              {grossWeight > 0 && <span>({grossWeight}g Gross)</span>}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground tracking-tight line-clamp-1">
              {product.title}
            </h3>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="font-mono text-base font-bold text-foreground">
                {formatPKR(displayPrice)}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Live Sarafa Linked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono text-muted-foreground">
            <div className="p-1.5 rounded-lg border border-border/60 bg-muted/30">
              <span className="block text-[8px] uppercase tracking-wider text-muted-foreground/80">Making</span>
              <span className="font-semibold text-foreground">Rs. {makingCharges.toLocaleString()}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-border/60 bg-muted/30">
              <span className="block text-[8px] uppercase tracking-wider text-muted-foreground/80">Stones</span>
              <span className="font-semibold text-foreground">Rs. {stoneCharges.toLocaleString()}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-border/60 bg-muted/30">
              <span className="block text-[8px] uppercase tracking-wider text-muted-foreground/80">Wastage</span>
              <span className="font-semibold text-foreground">{wastagePercent}%</span>
            </div>
          </div>

          {minAdvanceToLock > 0 && (
            <div className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[10px] text-foreground">
                <span className="font-semibold">90% Gold Lock Advance:</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatPKR(minAdvanceToLock)}
              </span>
            </div>
          )}

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-2.5 sm:px-5 border-t border-border/70 bg-muted/20 flex items-center justify-between gap-2 text-xs">
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
