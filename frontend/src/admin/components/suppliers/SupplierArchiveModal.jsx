import React from 'react';
import { X, Archive, RotateCcw, AlertTriangle } from 'lucide-react';

export function SupplierArchiveModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  actionType = 'archive',
  loading = false
}) {
  if (!isOpen || !supplier) return null;

  const isRestore = actionType === 'restore';
  const isDelete = actionType === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg border border-border bg-muted/40 text-foreground shrink-0">
            {isRestore ? (
              <RotateCcw className="size-5 text-emerald-600 dark:text-emerald-400" />
            ) : isDelete ? (
              <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400" />
            ) : (
              <Archive className="size-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {isRestore
                ? 'Restore Supplier Partner'
                : isDelete
                ? 'Archive Supplier Record'
                : 'Archive Supplier Partner'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRestore
                ? 'Reactivate sourcing and order linking'
                : 'Safely preserve historical inventory and transactions'}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          {isRestore ? (
            <>
              Are you sure you want to restore{' '}
              <strong className="text-foreground font-medium">{supplier.name}</strong> ({supplier.city})? This supplier will be re-listed under active partners.
            </>
          ) : (
            <>
              Are you sure you want to archive{' '}
              <strong className="text-foreground font-medium">{supplier.name}</strong> ({supplier.city})?
            </>
          )}
        </p>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/30 text-[11px] font-mono text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">Safe Archive Protection:</span> Supplier
          data will not be erased. Past gold purchases and inventory references remain intact.
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-medium rounded-lg text-white transition-colors cursor-pointer disabled:opacity-50 ${
              isRestore
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading
              ? isRestore
                ? 'Restoring...'
                : 'Archiving...'
              : isRestore
              ? 'Restore Supplier'
              : 'Archive Supplier'}
          </button>
        </div>
      </div>
    </div>
  );
}

