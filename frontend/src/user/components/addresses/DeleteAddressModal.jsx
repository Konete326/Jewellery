import React from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeleteAddressModal({ isOpen, onClose, onConfirm, address, isDeleting }) {
  if (!isOpen || !address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
              Confirm Removal
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Delete Saved Address
            </h3>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Are you sure you want to remove <span className="font-medium text-foreground">{address.label || 'this address'}</span> ({address.addressLine}, {address.city})? This action cannot be undone.
        </p>

        {address.isDefault && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-mono">
            <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>This is currently your default address.</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs cursor-pointer h-9 px-4 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-xs cursor-pointer h-9 px-4 rounded-xl font-medium tracking-wide"
          >
            {isDeleting ? 'Deleting...' : 'Delete Address'}
          </Button>
        </div>
      </div>
    </div>
  );
}

