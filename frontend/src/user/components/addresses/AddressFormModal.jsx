import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Building2, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanitizePhoneInput, sanitizeNameInput } from '@/utils/pricing';

const LABELS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Work', label: 'Work', icon: Building2 },
  { id: 'Other', label: 'Other', icon: Compass }
];

export function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  address = null,
  isSubmitting = false
}) {
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Karachi');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(address && (address._id || address.id));

  useEffect(() => {
    if (address) {
      setLabel(address.label || 'Home');
      setRecipientName(address.recipientName || '');
      setPhone(address.phone || '');
      setAddressLine(address.addressLine || '');
      setArea(address.area || '');
      setCity(address.city || 'Karachi');
      setPostalCode(address.postalCode || '');
      setIsDefault(Boolean(address.isDefault));
      setErrors({});
    } else {
      setLabel('Home');
      setRecipientName('');
      setPhone('');
      setAddressLine('');
      setArea('');
      setCity('Karachi');
      setPostalCode('');
      setIsDefault(false);
      setErrors({});
    }
  }, [address, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!recipientName.trim() || recipientName.trim().length < 2) {
      errs.recipientName = 'Recipient name must be at least 2 characters';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!addressLine.trim() || addressLine.trim().length < 5) {
      errs.addressLine = 'Street address must be at least 5 characters';
    }
    if (!city.trim()) {
      errs.city = 'City is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      label,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      area: area.trim(),
      city: city.trim() || 'Karachi',
      postalCode: postalCode.trim(),
      isDefault
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-border/80">
          <div className="size-10 rounded-full border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium block">
              Atelier Delivery Registry
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
              {isEditing ? 'Edit Saved Address' : 'Add New Address'}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
              Address Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LABELS.map((item) => {
                const Icon = item.icon;
                const isSelected = label === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLabel(item.id)}
                    className={`h-9 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background font-medium shadow-2xs'
                        : 'border-border/80 bg-background hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(sanitizeNameInput(e.target.value));
                  if (errors.recipientName) setErrors((prev) => ({ ...prev, recipientName: null }));
                }}
                placeholder="e.g. Fatima Zahra"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.recipientName && (
                <span className="text-[10px] text-rose-500 font-mono mt-1 block">{errors.recipientName}</span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(sanitizePhoneInput(e.target.value));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                placeholder="e.g. 0333 3213613"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.phone && (
                <span className="text-[10px] text-rose-500 font-mono mt-1 block">{errors.phone}</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Street / House / Building Address *
            </label>
            <textarea
              required
              rows={2}
              value={addressLine}
              onChange={(e) => {
                setAddressLine(e.target.value);
                if (errors.addressLine) setErrors((prev) => ({ ...prev, addressLine: null }));
              }}
              placeholder="e.g. House 42-B, Street 7, Block 4"
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            {errors.addressLine && (
              <span className="text-[10px] text-rose-500 font-mono mt-1 block">{errors.addressLine}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Clifton / DHA"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                }}
                placeholder="Karachi"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.city && (
                <span className="text-[10px] text-rose-500 font-mono mt-1 block">{errors.city}</span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 75600"
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="size-4 rounded border-border text-foreground focus:ring-1 focus:ring-ring"
              />
              <span className="text-xs font-medium text-foreground">
                Set as default delivery address for checkout
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs cursor-pointer h-9 px-4 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs cursor-pointer h-9 px-5 rounded-xl font-medium tracking-wide bg-foreground text-background hover:bg-foreground/90 shadow-xs"
            >
              {isSubmitting ? 'Saving Address...' : isEditing ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

