import React from 'react';
import { Home, Building2, Compass, Check, Edit2, Trash2, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault = false
}) {
  const getIcon = () => {
    switch (address.label) {
      case 'Work':
        return <Building2 className="size-3.5" />;
      case 'Other':
        return <Compass className="size-3.5" />;
      case 'Home':
      default:
        return <Home className="size-3.5" />;
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-background flex flex-col justify-between shadow-2xs ${
      address.isDefault
        ? 'border-amber-500/50 dark:border-amber-500/40 ring-1 ring-amber-500/20'
        : 'border-border/80 hover:border-foreground/30'
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-foreground font-medium">
              {getIcon()}
              <span>{address.label || 'Home'}</span>
            </span>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                <Star className="size-2.5 fill-amber-500 text-amber-500" />
                <span>Default Address</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(address)}
              className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Edit address"
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(address)}
              className="size-8 text-muted-foreground hover:text-rose-500 cursor-pointer"
              title="Delete address"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-sm sm:text-base font-medium text-foreground">
            {address.recipientName}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-muted-foreground">
            <Phone className="size-3 shrink-0" />
            <span>{address.phone}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground font-sans space-y-0.5">
          <p className="text-foreground leading-relaxed">
            {address.addressLine}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {[address.area, address.city, address.postalCode].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            disabled={isSettingDefault}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:underline disabled:opacity-40"
          >
            {isSettingDefault ? 'Setting...' : 'Set as Default'}
          </button>
        ) : (
          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Check className="size-3 text-amber-600 dark:text-amber-400" />
            <span>Primary address</span>
          </span>
        )}
        <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider">
          AU · SADDAR SARAFA
        </span>
      </div>
    </div>
  );
}

