import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryDeleteModal({
  isOpen,
  onClose,
  category,
  onConfirm,
  loading = false
}) {
  if (!isOpen || !category) return null;

  const itemCount = category.itemCount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Delete Collection Category
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Are you sure you want to permanently remove <span className="font-semibold text-foreground">&ldquo;{category.name}&rdquo;</span> from the atelier classifications?
            </p>
          </div>
        </div>

        {itemCount > 0 && (
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs">
            <span className="font-semibold">Notice:</span> There are currently{' '}
            <span className="font-bold">{itemCount} pieces</span> linked to this category in the gallery.
          </div>
        )}

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
            onClick={() => onConfirm(category)}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete Category'}
          </Button>
        </div>
      </div>
    </div>
  );
}
