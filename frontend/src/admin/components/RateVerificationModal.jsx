import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RateVerificationModal({
  isOpen,
  onClose,
  onConfirm,
  goldRate,
  silverRate,
  isSaving = false,
}) {
  if (!isOpen) return null;

  const formattedGold = goldRate ? 'PKR ' + Number(goldRate).toLocaleString('en-PK') : '';
  const formattedSilver = silverRate ? 'PKR ' + Number(silverRate).toLocaleString('en-PK') : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/70">
          <div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Verify Benchmark Rate
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Out of Normal Range
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please confirm you want to publish the following rate to the live customer storefront:
          </p>

          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">24K Gold / Tola:</span>
              <span className="font-mono text-sm font-bold text-foreground">{formattedGold}</span>
            </div>
            {silverRate && (
              <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
                <span className="text-xs font-mono text-muted-foreground">Silver / Tola:</span>
                <span className="font-mono text-sm font-semibold text-foreground">{formattedSilver}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-light">
            Note: Typical 24K gold rates in Pakistan range from PKR 300,000 to PKR 600,000 per tola. Ensure an extra or missing zero was not entered by mistake.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer text-xs"
          >
            Review & Edit
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isSaving}
            className="cursor-pointer text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium"
          >
            {isSaving ? 'Publishing...' : 'Confirm & Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}

