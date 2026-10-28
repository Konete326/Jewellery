import React, { useState, useEffect } from 'react';
import { X, Landmark, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { fetchActivePaymentAccounts } from '@/api/paymentAccountsApi';

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

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(key);
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
          <div className="size-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
            <Landmark className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Official Bank Settlement Accounts
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
                AU · SETTLEMENT
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Official accounts for bespoke jewellery bookings, bullion lock-in, and appraisals.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground animate-pulse">
            Loading verified atelier accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <ShieldCheck className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-xs font-mono text-muted-foreground">
              Direct settlement accounts available via WhatsApp concierge.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div
                key={acc._id || acc.id}
                className={`p-5 rounded-2xl border transition-all ${
                  acc.isInstantSettlement
                    ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-card to-background shadow-xs'
                    : 'border-border/80 bg-background/60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-base text-foreground">
                      {acc.bankName}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      ({acc.accountType})
                    </span>
                  </div>

                  {acc.isInstantSettlement && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-900 border border-amber-500/30">
                      <Zap className="size-3 fill-amber-600 text-amber-600" />
                      Instant Settlement
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mb-3 font-light">
                  Beneficiary Title: <strong className="text-foreground font-medium">{acc.accountTitle}</strong>
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
                      onClick={() => handleCopy(acc.accountNumber, `acc-${acc._id}`)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                        onClick={() => handleCopy(acc.iban, `iban-${acc._id}`)}
                        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

                {acc.instructions && (
                  <p className="mt-2.5 text-[11px] font-mono text-muted-foreground/90 bg-muted/20 p-2 rounded-lg border border-border/40">
                    ℹ️ {acc.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
