import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductDeleteModal({
  isOpen,
  onClose,
  product,
  onConfirm,
  loading = false
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Delete Product
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Are you sure you want to permanently remove <span className="font-semibold text-foreground">&ldquo;{product.title}&rdquo;</span> from your inventory?
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onConfirm(product)}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}

