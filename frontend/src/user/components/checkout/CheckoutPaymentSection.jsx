import React, { useState } from 'react';
import { Copy, Check, Building2, MapPin, ShieldCheck, Banknote } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';
import { BankLogo } from '@/components/BankLogo';
import { toast } from 'sonner';

export function CheckoutPaymentSection({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  customerNote,
  setCustomerNote,
  paymentMode,
  setPaymentMode,
  paymentAccounts = [],
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  transactionRef,
  setTransactionRef,
  subtotal = 0,
  minAdvanceRequired = 0
}) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldLabel) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldLabel);
    toast.success(`${fieldLabel} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const selectedAccount = paymentAccounts.find((a) => a._id === selectedAccountId) || paymentAccounts[0];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center gap-2 text-foreground font-semibold text-xs font-mono uppercase tracking-wider">
          <MapPin className="size-3.5 text-amber-600" />
          <span>Fulfillment: Showroom Collection Only</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Orders must be personally collected and verified. No courier or delivery service is offered.
        </p>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <h3 className="font-serif text-base font-semibold text-foreground">Patron Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Fatima Ali"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Email Address (For Invoices &amp; Notifications) *
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Special Instructions / Ring &amp; Bangle Sizing
            </label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value.slice(0, 160))}
              placeholder="e.g. Ring size 16, need gift packaging..."
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <h3 className="font-serif text-base font-semibold text-foreground">Settlement Method</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setPaymentMode('Bank Transfer');
              if (!depositAmount && minAdvanceRequired > 0) {
                setDepositAmount(String(minAdvanceRequired));
              }
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              paymentMode === 'Bank Transfer'
                ? 'border-amber-500/80 bg-amber-500/5 ring-1 ring-amber-500/40'
                : 'border-border/80 bg-muted/10 hover:bg-muted/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-sm font-semibold text-foreground">
                Advance Bank Transfer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
                Lock Rate
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deposit min 90% or full amount via bank transfer to lock gold rates against daily market surges.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('Showroom Payment');
              setDepositAmount('0');
              setTransactionRef('');
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              paymentMode === 'Showroom Payment'
                ? 'border-amber-500/80 bg-amber-500/5 ring-1 ring-amber-500/40'
                : 'border-border/80 bg-muted/10 hover:bg-muted/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-sm font-semibold text-foreground">
                Pay at Showroom
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border bg-muted/50 text-muted-foreground">
                Showroom Visit
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reserve your chosen pieces and settle in cash or pay via card during your personal showroom visit.
            </p>
          </button>
        </div>

        {paymentMode === 'Bank Transfer' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2">
                Select Receiving Bank Account
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paymentAccounts.map((account) => {
                  const isSelected = (selectedAccountId || selectedAccount?._id) === account._id;
                  return (
                    <div
                      key={account._id}
                      onClick={() => setSelectedAccountId(account._id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-foreground/40 bg-muted/30 shadow-xs'
                          : 'border-border/70 bg-card hover:bg-muted/10'
                      }`}
                    >
                      <BankLogo
                        name={account.bankName}
                        type={account.accountType}
                        logoUrl={account.logoUrl}
                        className="size-8 rounded-lg shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">{account.bankName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">{account.accountTitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedAccount && (
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-border/60">
                  <span className="font-semibold text-foreground">{selectedAccount.bankName}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{selectedAccount.accountType}</span>
                </div>

                <div className="space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>Account Title:</span>
                    <span className="text-foreground font-medium">{selectedAccount.accountTitle}</span>
                  </div>

                  {selectedAccount.accountNumber && (
                    <div className="flex justify-between items-center">
                      <span>Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">{selectedAccount.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNumber, 'Account Number')}
                          className="p-1 hover:text-foreground text-muted-foreground cursor-pointer"
                        >
                          {copiedField === 'Account Number' ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedAccount.iban && (
                    <div className="flex justify-between items-center">
                      <span>IBAN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate max-w-[200px]">{selectedAccount.iban}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.iban, 'IBAN')}
                          className="p-1 hover:text-foreground text-muted-foreground cursor-pointer"
                        >
                          {copiedField === 'IBAN' ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-1.5">
                  Select Advance Deposit Amount
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setDepositAmount(String(minAdvanceRequired))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                      Number(depositAmount) === minAdvanceRequired
                        ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    90% Rate Lock ({formatPKR(minAdvanceRequired)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositAmount(String(subtotal))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                      Number(depositAmount) === subtotal
                        ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    100% Full Payment ({formatPKR(subtotal)})
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Transferred Amount (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={String(minAdvanceRequired)}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Bank Ref / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value.slice(0, 50))}
                      placeholder="e.g. PK240801849"
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}