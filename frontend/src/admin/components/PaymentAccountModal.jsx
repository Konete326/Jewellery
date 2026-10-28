import React, { useState, useEffect } from 'react';
import { X, Landmark, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const POPULAR_PROVIDERS = [
  'Meezan Bank',
  'Habib Bank Limited (HBL)',
  'Bank Alfalah',
  'Standard Chartered',
  'MCB Bank',
  'Allied Bank (ABL)',
  'Faysal Bank',
  'Raast ID',
  'JazzCash',
  'Nayapay'
];

const ACCOUNT_TYPES = [
  'Bank Account',
  'Current Account',
  'Corporate Account',
  'Raast ID',
  'Digital Wallet',
  'Wire Transfer'
];

export function PaymentAccountModal({ isOpen, onClose, onSave, account = null, loading = false }) {
  const [formData, setFormData] = useState({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchName: '',
    accountType: 'Bank Account',
    swiftCode: '',
    instructions: '',
    isInstantSettlement: false,
    isDefault: false,
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        bankName: account.bankName || '',
        accountTitle: account.accountTitle || '',
        accountNumber: account.accountNumber || '',
        iban: account.iban || '',
        branchName: account.branchName || '',
        accountType: account.accountType || 'Bank Account',
        swiftCode: account.swiftCode || '',
        instructions: account.instructions || '',
        isInstantSettlement: Boolean(account.isInstantSettlement),
        isDefault: Boolean(account.isDefault),
        isActive: account.isActive !== undefined ? Boolean(account.isActive) : true
      });
    } else {
      setFormData({
        bankName: '',
        accountTitle: 'Khalil & Sons Jewellers',
        accountNumber: '',
        iban: '',
        branchName: '',
        accountType: 'Bank Account',
        swiftCode: '',
        instructions: '',
        isInstantSettlement: false,
        isDefault: false,
        isActive: true
      });
    }
    setErrors({});
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank or provider name is required';
    }
    if (!formData.accountTitle.trim()) {
      newErrors.accountTitle = 'Account title is required';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number or ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      bankName: formData.bankName.trim(),
      accountTitle: formData.accountTitle.trim(),
      accountNumber: formData.accountNumber.trim(),
      iban: formData.iban.trim(),
      branchName: formData.branchName.trim(),
      swiftCode: formData.swiftCode.trim(),
      instructions: formData.instructions.trim()
    });
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
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/70">
          <div className="size-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <Landmark className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {account ? 'Edit Payment Account' : 'Add Payment Account'}
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-800 dark:text-amber-300 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded-full">
                AU · SETTLEMENT
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure receiving bank details, IBAN, and payment verification instructions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Bank / Provider Name *
              </label>
              <span className="text-[10px] text-muted-foreground/80">Quick Select:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {POPULAR_PROVIDERS.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleChange('bankName', provider)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    formData.bankName === provider
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium'
                      : 'border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="e.g. Meezan Bank / Raast ID"
              className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                errors.bankName ? 'border-rose-500' : 'border-input'
              }`}
            />
            {errors.bankName && <p className="text-xs text-rose-500">{errors.bankName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Account Title (Beneficiary) *
              </label>
              <input
                type="text"
                required
                value={formData.accountTitle}
                onChange={(e) => handleChange('accountTitle', e.target.value)}
                placeholder="e.g. Khalil & Sons Jewellers"
                className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                  errors.accountTitle ? 'border-rose-500' : 'border-input'
                }`}
              />
              {errors.accountTitle && <p className="text-xs text-rose-500">{errors.accountTitle}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Account Type
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => handleChange('accountType', e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 cursor-pointer"
              >
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Account Number / Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="e.g. 01080105829101"
                className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm font-mono text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                  errors.accountNumber ? 'border-rose-500' : 'border-input'
                }`}
              />
              {errors.accountNumber && <p className="text-xs text-rose-500">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                IBAN (International Account No.)
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => handleChange('iban', e.target.value.toUpperCase())}
                placeholder="e.g. PK36MEZN0001080105829101"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm font-mono text-foreground uppercase placeholder:normal-case focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Branch Name & City (Optional)
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => handleChange('branchName', e.target.value)}
                placeholder="e.g. Cloth Market Branch (0108), Karachi"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                SWIFT / BIC Code (Optional)
              </label>
              <input
                type="text"
                value={formData.swiftCode}
                onChange={(e) => handleChange('swiftCode', e.target.value.toUpperCase())}
                placeholder="e.g. MEZNPKKA"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm font-mono text-foreground uppercase placeholder:normal-case focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Payment & Verification Instructions
            </label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="e.g. Please share the bank transfer receipt or transaction screenshot on WhatsApp with your Order Reference ID."
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 resize-none"
            />
          </div>

          <div className="pt-2 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isInstantSettlement}
                  onChange={(e) => handleChange('isInstantSettlement', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30"
                />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-1.5 rounded-full bg-amber-600" />
                  Instant Settlement
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleChange('isDefault', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30"
                />
                <span className="font-medium">Primary</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30"
                />
                <span>Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="h-9 px-4 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-5 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer shadow-xs"
              >
                {loading ? 'Saving...' : account ? 'Update Account' : 'Save Account'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
