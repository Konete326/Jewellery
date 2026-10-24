import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, itemType = 'piece', loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Remove {itemType}</h3>
            <p className="text-xs text-muted-foreground">Permanent deletion from database</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Are you sure you want to remove <strong className="text-foreground font-medium">"{title}"</strong>? This action cannot be undone.
        </p>

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
            className="px-4 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
