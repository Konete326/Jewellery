import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  User,
  Building2,
  Calendar,
  Pencil,
  Archive,
  RotateCcw
} from 'lucide-react';
import { openWhatsAppChat } from '@/utils/whatsapp';

export function SupplierDetailModal({
  isOpen,
  onClose,
  supplier,
  onEdit,
  onToggleArchive
}) {
  if (!isOpen || !supplier) return null;

  const isActive = supplier.status === 'active';

  const handleWhatsAppClick = () => {
    const rawNumber = supplier.whatsapp || supplier.phone;
    const cleanNumber = (rawNumber || '').replace(/[^\d+]/g, '');
    const message = `Greetings from Khalil & Sons Jewellers, Karachi. Reaching out regarding current bullion and jewellery inventory sourcing.`;
    openWhatsAppChat(message, cleanNumber);
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
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                SUPPLIER DOSSIER
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isActive
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-border/80 bg-muted/40 text-muted-foreground'
                }`}
              >
                {supplier.status}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {supplier.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <MapPin className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
              {supplier.city} {supplier.address ? `— ${supplier.address}` : ''}
            </p>
          </div>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Contact Person
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <User className="size-3.5 text-muted-foreground shrink-0" />
                <span>{supplier.contactPerson || 'Direct Company Desk'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Primary Phone
              </span>
              <div className="flex items-center gap-2 font-mono text-foreground">
                <Phone className="size-3.5 text-muted-foreground shrink-0" />
                <a
                  href={`tel:${supplier.phone}`}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {supplier.phone}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                WhatsApp Channel
              </span>
              <div className="flex items-center gap-2 font-mono text-foreground">
                <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {supplier.whatsapp ? (
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {supplier.whatsapp}
                  </button>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                City / Sarafa Hub
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                <span>{supplier.city}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
              Supplied Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(supplier.suppliedCategories || []).map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-md border border-border/80 bg-background text-[11px] font-mono font-medium text-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {supplier.address && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Physical Workshop / Office Address
              </span>
              <p className="p-3 rounded-xl border border-border/70 bg-muted/20 text-muted-foreground leading-relaxed">
                {supplier.address}
              </p>
            </div>
          )}

          {supplier.notes && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Internal Atelier Notes
              </span>
              <p className="p-3 rounded-xl border border-border/70 bg-muted/20 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {supplier.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3 text-muted-foreground" />
              Registered: {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <span>
              Updated: {supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/80">
          <button
            type="button"
            onClick={() => {
              onClose();
              onToggleArchive(supplier);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isActive
                ? 'border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                : 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            {isActive ? (
              <>
                <Archive className="size-3.5" />
                Archive
              </>
            ) : (
              <>
                <RotateCcw className="size-3.5" />
                Restore
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(supplier);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              Edit Details
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

