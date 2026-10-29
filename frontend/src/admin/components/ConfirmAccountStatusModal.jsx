import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConfirmAccountStatusModal({
  isOpen,
  onClose,
  onConfirm,
  account = null,
  loading = false
}) {
  if (!isOpen || !account) return null;

  const isDeactivating = account.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
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
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`size-10 rounded-full flex items-center justify-center shrink-0 border ${
              isDeactivating
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isDeactivating ? <AlertCircle className="size-5" /> : <CheckCircle className="size-5" />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground tracking-tight">
              {isDeactivating ? 'Deactivate Account' : 'Activate Account'}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {account.bankName} · {account.accountType || 'Bank Account'}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {isDeactivating ? (
            <>
              Are you sure you want to deactivate <strong className="text-foreground font-medium">{account.bankName} ({account.accountNumber || account.iban})</strong>? Clients will no longer see this receiving account on the website or bank settlement modals until reactivated.
            </>
          ) : (
            <>
              Are you sure you want to activate <strong className="text-foreground font-medium">{account.bankName} ({account.accountNumber || account.iban})</strong>? Clients will immediately see this receiving account for order payments.
            </>
          )}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 text-xs font-mono cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`h-9 px-5 text-xs font-mono cursor-pointer shadow-xs ${
              isDeactivating
                ? 'bg-foreground text-background hover:bg-neutral-800'
                : 'bg-foreground text-background hover:bg-neutral-800'
            }`}
          >
            {loading ? 'Updating...' : isDeactivating ? 'Deactivate Account' : 'Activate Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}
