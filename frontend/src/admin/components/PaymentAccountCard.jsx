import React, { useState } from 'react';
import { Copy, Check, Pencil, Trash2, Star, CheckCircle, XCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PaymentAccountCard({
  account,
  onEdit,
  onDelete,
  onSetDefault,
  onToggleStatus,
  actionLoading
}) {
  const [copiedField, setCopiedField] = useState(null);

  const cleanIban = account.iban ? String(account.iban).replace(/\s+/g, '').toUpperCase() : '';
  const formattedIban = cleanIban.match(/.{1,4}/g)?.join(' ') || cleanIban;

  const handleCopy = (text, field, label = 'Account Number') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${account.bankName} ${label} copied to clipboard`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all flex flex-col justify-between ${
        account.isDefault
          ? 'border-foreground/30 bg-muted/20 shadow-xs'
          : 'border-border/80 bg-card hover:border-border shadow-xs'
      } ${!account.isActive ? 'opacity-65' : ''}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-border/70">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {account.accountType || 'Bank Account'}
          </span>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            {account.isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 dark:text-amber-200 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                Primary
              </span>
            )}
            {account.isInstantSettlement && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Zap className="size-2.5" />
                Instant Settlement
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                account.isActive
                  ? 'text-foreground bg-muted/60 border-border/80'
                  : 'text-muted-foreground bg-muted/20 border-border/60'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  account.isActive ? 'bg-amber-600' : 'bg-muted-foreground'
                }`}
              />
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="font-serif text-lg font-semibold text-foreground tracking-tight">
            {account.bankName}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Title: <strong className="text-foreground font-medium">{account.accountTitle}</strong>
          </p>
        </div>

        <div className="space-y-2 text-xs">
          {account.accountNumber ? (
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  {account.accountType === 'Raast ID'
                    ? 'Raast ID / Number'
                    : account.accountType === 'Digital Wallet'
                    ? 'Wallet Mobile Number'
                    : 'Account Number'}
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate block">
                  {account.accountNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    account.accountNumber,
                    'acc',
                    account.accountType === 'Raast ID'
                      ? 'Raast ID'
                      : account.accountType === 'Digital Wallet'
                      ? 'Wallet Number'
                      : 'Account Number'
                  )
                }
                className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Copy Number"
              >
                {copiedField === 'acc' ? (
                  <Check className="size-3.5 text-amber-700" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          ) : null}

          {cleanIban ? (
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  IBAN Number
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate block uppercase tracking-wide">
                  {formattedIban}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(cleanIban, 'iban', 'IBAN')}
                className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Copy Clean IBAN"
              >
                {copiedField === 'iban' ? (
                  <Check className="size-3.5 text-amber-700" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {!account.isDefault && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={() => onSetDefault(account)}
              className="h-7 px-2 text-[11px] cursor-pointer"
            >
              <Star className="size-3 mr-1 text-amber-600" />
              Make Primary
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={() => onToggleStatus(account)}
            className="h-7 px-2 text-[11px] cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {account.isActive ? (
              <>
                <XCircle className="size-3 mr-1 text-rose-500" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="size-3 mr-1 text-foreground" />
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
            className="h-7 px-2.5 text-[11px] cursor-pointer"
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
            className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
