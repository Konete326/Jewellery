import React, { useState, useEffect } from 'react';
import { X, Landmark, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { fetchActivePaymentAccounts } from '@/api/paymentAccountsApi';
import { toast } from 'sonner';

export function BankSettlementModal({ isOpen, onClose }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetchActivePaymentAccounts()
      .then((res) => {
        if (isMounted && res?.data) {
          setAccounts(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text, key, label = 'Account Number') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/70">
          <div className="size-10 rounded-full border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0">
            <Landmark className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Bank Accounts
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Official accounts for custom jewelry orders and advances
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground animate-pulse">
            Loading verified accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <ShieldCheck className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-xs font-mono text-muted-foreground">
              Direct accounts available via WhatsApp concierge.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div
                key={acc._id || acc.id}
                className="p-5 rounded-2xl border border-border/80 bg-background/60 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-base text-foreground">
                      {acc.bankName}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      ({acc.accountType || 'Bank Account'})
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3 font-light">
                  Beneficiary: <strong className="text-foreground font-medium">{acc.accountTitle}</strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                        Account / Raast ID
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground truncate block">
                        {acc.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumber, `acc-${acc._id}`, `${acc.bankName} Account / Raast ID`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedField === `acc-${acc._id}` ? (
                        <Check className="size-3.5 text-amber-700" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>

                  {acc.iban && (
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                          IBAN Number
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground truncate block uppercase">
                          {acc.iban}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.iban, `iban-${acc._id}`, `${acc.bankName} IBAN`)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy IBAN"
                      >
                        {copiedField === `iban-${acc._id}` ? (
                          <Check className="size-3.5 text-amber-700" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
