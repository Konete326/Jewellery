import React, { useState, useEffect } from 'react';
import { X, Landmark, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ACCOUNT_TYPES = [
  'Bank Account',
  'Current Account',
  'Corporate Account',
  'Raast ID',
  'Digital Wallet'
];

const PROVIDER_PRESETS = {
  'Bank Account': ['Meezan Bank', 'Habib Bank Limited (HBL)', 'Bank Alfalah', 'Standard Chartered', 'MCB Bank', 'Allied Bank'],
  'Current Account': ['Meezan Bank', 'Habib Bank Limited (HBL)', 'Bank Alfalah', 'Standard Chartered', 'MCB Bank'],
  'Corporate Account': ['Meezan Bank', 'Habib Bank Limited (HBL)', 'Bank Alfalah', 'Standard Chartered', 'MCB Bank'],
  'Raast ID': ['State Bank Raast', 'Meezan Bank', 'HBL', 'Bank Alfalah', 'JazzCash', 'EasyPaisa'],
  'Digital Wallet': ['JazzCash', 'EasyPaisa', 'SadaPay', 'NayaPay']
};

export function PaymentAccountModal({ isOpen, onClose, onSave, account = null, loading = false }) {
  const [formData, setFormData] = useState({
    bankName: '',
    accountTitle: 'Khalil & Sons Jewellers',
    accountNumber: '',
    iban: '',
    accountType: 'Bank Account',
    isDefault: false,
    isInstantSettlement: false,
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        bankName: account.bankName || '',
        accountTitle: account.accountTitle || 'Khalil & Sons Jewellers',
        accountNumber: account.accountNumber || '',
        iban: account.iban ? String(account.iban).replace(/\s+/g, '').toUpperCase() : '',
        accountType: account.accountType || 'Bank Account',
        isDefault: Boolean(account.isDefault),
        isInstantSettlement: Boolean(account.isInstantSettlement),
        isActive: account.isActive !== undefined ? Boolean(account.isActive) : true
      });
    } else {
      setFormData({
        bankName: '',
        accountTitle: 'Khalil & Sons Jewellers',
        accountNumber: '',
        iban: '',
        accountType: 'Bank Account',
        isDefault: false,
        isInstantSettlement: false,
        isActive: true
      });
    }
    setErrors({});
  }, [account, isOpen]);

  if (!isOpen) return null;

  const isWallet = formData.accountType === 'Digital Wallet';
  const isRaast = formData.accountType === 'Raast ID';
  const currentPresets = PROVIDER_PRESETS[formData.accountType] || PROVIDER_PRESETS['Bank Account'];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.accountNumber || errors.iban) {
      setErrors((prev) => ({ ...prev, [field]: null, accountNumber: null, iban: null }));
    }
  };

  const handleIbanChange = (e) => {
    const sanitized = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 24);
    handleChange('iban', sanitized);
  };

  const handleAccountNumberChange = (e) => {
    let sanitized = e.target.value;
    if (isWallet || isRaast) {
      sanitized = sanitized.replace(/[^\d+]/g, '').slice(0, 15);
    } else {
      sanitized = sanitized.replace(/[^0-9-]/g, '').slice(0, 24);
    }
    handleChange('accountNumber', sanitized);
  };

  const handleAccountTypeChange = (newType) => {
    const isNowInstant = newType === 'Raast ID' || newType === 'Digital Wallet';
    setFormData((prev) => ({
      ...prev,
      accountType: newType,
      isInstantSettlement: isNowInstant ? true : prev.isInstantSettlement
    }));
    setErrors({});
  };

  const isIbanValid = formData.iban ? /^PK\d{2}[A-Z]{4}[A-Z0-9]{16}$/i.test(formData.iban) : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = isWallet ? 'Wallet provider is required' : 'Bank or provider name is required';
    }
    if (!formData.accountTitle.trim()) {
      newErrors.accountTitle = 'Account title is required';
    }

    if (isWallet) {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Wallet mobile number is required';
      }
    } else {
      const hasNumber = Boolean(formData.accountNumber.trim());
      const hasIban = Boolean(formData.iban.trim());
      if (!hasNumber && !hasIban) {
        const errorMsg = isRaast
          ? 'Enter either Raast Mobile Number or IBAN'
          : 'Enter either Account Number or IBAN';
        newErrors.accountNumber = errorMsg;
        newErrors.iban = errorMsg;
      } else if (hasIban && formData.iban.length > 0 && !isIbanValid) {
        newErrors.iban = 'Invalid Pakistani IBAN format (must be 24 chars e.g. PK36MEZN...)';
      }
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
      iban: formData.iban.replace(/\s+/g, '').toUpperCase()
    });
  };

  const formattedIbanPreview = formData.iban
    ? formData.iban.match(/.{1,4}/g)?.join(' ')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border/70">
          <div className="size-9 rounded-full border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {account ? 'Edit Payment Account' : 'Add Payment Account'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter official receiving details with instant IBAN auto-formatting
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Account Type
            </label>
            <select
              value={formData.accountType}
              onChange={(e) => handleAccountTypeChange(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 cursor-pointer"
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {isWallet ? 'Wallet Provider *' : isRaast ? 'Raast / Bank Provider *' : 'Bank / Institution Name *'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {currentPresets.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleChange('bankName', provider)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    formData.bankName === provider
                      ? 'border-foreground bg-foreground text-background font-medium'
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
              placeholder={isWallet ? 'e.g. JazzCash or EasyPaisa' : isRaast ? 'e.g. State Bank Raast or Meezan Bank' : 'e.g. Meezan Bank'}
              className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                errors.bankName ? 'border-rose-500' : 'border-input'
              }`}
            />
            {errors.bankName && <p className="text-xs text-rose-500">{errors.bankName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {isWallet ? 'Wallet Title / Beneficiary *' : 'Account Title *'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {isWallet
                    ? 'Wallet Number *'
                    : isRaast
                    ? `Raast Mobile ${formData.iban.trim() ? '(Optional)' : '*'}`
                    : `Account Number ${formData.iban.trim() ? '(Optional)' : '*'}`}
                </label>
              </div>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={handleAccountNumberChange}
                placeholder={isWallet || isRaast ? '03001234567' : '01080105829101'}
                className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm font-mono text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                  errors.accountNumber ? 'border-rose-500' : 'border-input'
                }`}
              />
              {errors.accountNumber && <p className="text-xs text-rose-500">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {isRaast
                    ? `Raast IBAN ${formData.accountNumber.trim() ? '(Optional)' : '*'}`
                    : isWallet
                    ? 'IBAN (Optional)'
                    : `IBAN ${formData.accountNumber.trim() ? '(Optional)' : '*'}`}
                </label>
                {formData.iban && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formData.iban.length}/24
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.iban}
                onChange={handleIbanChange}
                placeholder="PK36MEZN0001080105829101"
                className={`w-full bg-background border rounded-xl px-3.5 py-2 text-sm font-mono text-foreground uppercase placeholder:normal-case focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 ${
                  errors.iban ? 'border-rose-500' : isIbanValid ? 'border-emerald-500/80' : 'border-input'
                }`}
              />
              {formData.iban && (
                <div className="flex items-center justify-between text-[10px] font-mono mt-0.5">
                  <span className="text-muted-foreground/80 truncate">
                    {formattedIbanPreview}
                  </span>
                  {isIbanValid ? (
                    <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 font-semibold shrink-0">
                      <Check className="size-3" />
                      Valid IBAN
                    </span>
                  ) : formData.iban.length === 24 ? (
                    <span className="text-rose-600 inline-flex items-center gap-1 shrink-0">
                      <AlertCircle className="size-3" />
                      Check IBAN format
                    </span>
                  ) : null}
                </div>
              )}
              {errors.iban && !errors.accountNumber && <p className="text-xs text-rose-500">{errors.iban}</p>}
            </div>
          </div>

          {!isWallet && (
            <p className="text-[11px] text-muted-foreground font-light">
              Spaces and hyphens in IBAN are automatically removed and saved in standard clean uppercase format.
            </p>
          )}

          <div className="pt-2 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleChange('isDefault', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30 cursor-pointer"
                />
                <span className="font-medium">Primary</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isInstantSettlement}
                  onChange={(e) => handleChange('isInstantSettlement', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30 cursor-pointer"
                />
                <span>Instant Settlement</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30 cursor-pointer"
                />
                <span>Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
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
                {loading ? 'Saving...' : account ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
