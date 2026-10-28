import React, { useState } from 'react';
import { Copy, Check, Pencil, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PaymentAccountCard({
  account,
  onEdit,
  onDelete,
  onSetDefault,
  onToggleStatus,
  actionLoading
}) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const isDigital =
    account.accountType === 'Digital Wallet' ||
    account.accountType === 'Raast ID' ||
    account.bankName.toLowerCase().includes('raast') ||
    account.bankName.toLowerCase().includes('jazzcash') ||
    account.bankName.toLowerCase().includes('nayapay');

  return (
    <div
      className={`relative rounded-2xl border p-5 sm:p-6 transition-all flex flex-col justify-between ${
        account.isDefault
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/5 via-card to-card shadow-md'
          : 'border-border/80 bg-card hover:border-border shadow-xs'
      } ${!account.isActive ? 'opacity-70' : ''}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3.5 border-b border-border/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-300 border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-medium">
              {isDigital ? 'AU · DIGITAL' : 'AU · SETTLE'}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">
              {account.accountType}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {account.isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 dark:text-amber-200 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                Primary
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                account.isActive
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-muted-foreground bg-muted border-border/80'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  account.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'
                }`}
              />
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-serif text-lg font-semibold text-foreground tracking-tight">
            {account.bankName}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Beneficiary: <strong className="text-foreground font-medium">{account.accountTitle}</strong>
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Account Number / ID
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate block">
                {account.accountNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(account.accountNumber, 'acc')}
              className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              title="Copy Account Number"
            >
              {copiedField === 'acc' ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>

          {account.iban && (
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  IBAN Number
                </span>
                <span className="font-mono text-xs font-semibold text-foreground truncate block uppercase">
                  {account.iban}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(account.iban, 'iban')}
                className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Copy IBAN"
              >
                {copiedField === 'iban' ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
            {account.branchName && (
              <div>
                <span className="font-mono uppercase text-[9px] block text-muted-foreground/75">
                  Branch / Location
                </span>
                <span className="text-foreground truncate block">{account.branchName}</span>
              </div>
            )}
            {account.swiftCode && (
              <div>
                <span className="font-mono uppercase text-[9px] block text-muted-foreground/75">
                  SWIFT / BIC
                </span>
                <span className="font-mono font-medium text-foreground truncate block uppercase">
                  {account.swiftCode}
                </span>
              </div>
            )}
          </div>

          {account.instructions && (
            <div className="mt-2 p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-amber-900 dark:text-amber-200 block mb-0.5">
                Settlement Instructions:
              </span>
              {account.instructions}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-border/70 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {!account.isDefault && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={() => onSetDefault(account)}
              className="h-8 px-2.5 text-[11px] cursor-pointer"
            >
              <Star className="size-3 mr-1 text-amber-600" />
              Set Primary
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={() => onToggleStatus(account)}
            className="h-8 px-2 text-[11px] cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {account.isActive ? (
              <>
                <XCircle className="size-3 mr-1 text-rose-500" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="size-3 mr-1 text-emerald-600" />
                Activate
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={actionLoading}
            onClick={() => onEdit(account)}
            className="h-8 px-2.5 text-[11px] cursor-pointer"
          >
            <Pencil className="size-3 mr-1" />
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={() => onDelete(account)}
            className="h-8 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
