import React, { useState, useEffect } from 'react';
import { X, Building2, AlertCircle, Check } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Gold',
  'Silver',
  'Stones',
  'Diamonds',
  'Jewellery',
  'Other'
];

export function SupplierModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  loading = false
}) {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('');
  const [suppliedCategories, setSuppliedCategories] = useState(['Gold']);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactPerson(initialData.contactPerson || '');
      setPhone(initialData.phone || '');
      setWhatsapp(initialData.whatsapp || '');
      setCity(initialData.city || 'Karachi');
      setAddress(initialData.address || '');
      setSuppliedCategories(
        Array.isArray(initialData.suppliedCategories) && initialData.suppliedCategories.length > 0
          ? initialData.suppliedCategories
          : ['Gold']
      );
      setNotes(initialData.notes || '');
      setStatus(initialData.status || 'active');
    } else {
      setName('');
      setContactPerson('');
      setPhone('');
      setWhatsapp('');
      setCity('Karachi');
      setAddress('');
      setSuppliedCategories(['Gold']);
      setNotes('');
      setStatus('active');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (cat) => {
    setSuppliedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Supplier company name must be at least 2 characters');
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 7) {
      setError('A valid primary contact phone number is required');
      return;
    }
    if (suppliedCategories.length === 0) {
      setError('Please select at least one supplied category');
      return;
    }

    const payload = {
      name: trimmedName,
      contactPerson: contactPerson.trim(),
      phone: trimmedPhone,
      whatsapp: whatsapp.trim(),
      city: city.trim() || 'Karachi',
      address: address.trim(),
      suppliedCategories,
      notes: notes.trim(),
      status
    };

    try {
      await onSave(payload);
    } catch (err) {
      if (err.status === 409 || (err.message && err.message.toLowerCase().includes('already exists'))) {
        setError(err.message || 'A supplier with this name already exists in this city.');
      } else {
        setError(err.message || 'Failed to save supplier partner.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
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
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-lg border border-border bg-muted/40 text-foreground shrink-0">
            <Building2 className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {initialData ? 'Edit Supplier Partner' : 'Register Sourcing Partner'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct bullion houses, gemstone dealers, and atelier mounting workshops.
            </p>
          </div>
        </div>

        {error && (
          <div className="my-4 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-medium text-foreground">
                Company / Supplier Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Al-Madina Bullion Traders"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Haji Muhammad Tariq"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">
                City / Market Hub <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Karachi, Lahore, etc."
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">
                Primary Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="03001234567 / 021-35681234"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="03001234567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground block">
              Supplied Categories <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const selected = suppliedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                      selected
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium'
                        : 'border-border/80 bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {selected && <Check className="size-3" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              Workshop / Office Address
            </label>
            <input
              type="text"
              placeholder="Shop #, Sarafa Bazaar, Saddar, Karachi"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              Internal Notes
            </label>
            <textarea
              rows={3}
              placeholder="Purity standards, payment terms, gold assay credentials, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
          </div>

          {initialData && (
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <option value="active">Active Sourcing Partner</option>
                <option value="archived">Archived Partner</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving Partner...' : initialData ? 'Save Changes' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

