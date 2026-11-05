import React from 'react';
import { User, Mail, Phone, Store, MapPin } from 'lucide-react';
import { getVerifiedStoreProfile } from '@/utils/storeConfig';

export function OrderClientDetails({ order }) {
  const customer = order?.customer || {};
  const storeProfile = getVerifiedStoreProfile();
  const pickupLocation = storeProfile?.address || 'Saddar Flagship Showroom, Karachi';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-border/80 bg-muted/15">
      <div className="space-y-1.5 text-xs">
        <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block">
          Client Information
        </span>
        <div className="flex items-center gap-2 text-foreground font-medium text-sm">
          <User className="size-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{customer.name || 'Valued Patron'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-3.5 text-muted-foreground shrink-0" />
          <a
            href={`mailto:${customer.email}`}
            className="hover:underline hover:text-foreground transition-colors truncate"
          >
            {customer.email || 'N/A'}
          </a>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          <Phone className="size-3.5 text-muted-foreground shrink-0" />
          <a
            href={`tel:${customer.phone}`}
            className="hover:underline hover:text-foreground transition-colors"
          >
            {customer.phone || 'N/A'}
          </a>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block">
          Fulfillment Policy
        </span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-amber-600/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-medium">
            <Store className="size-3" />
            <span>Showroom Collection Policy</span>
          </span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground mt-1">
          <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {pickupLocation}
          </span>
        </div>
        {order?.customerNote && (
          <div className="text-[11px] text-muted-foreground italic mt-1.5 p-2 rounded-lg border border-border/60 bg-background/60">
            Client Request: "{order.customerNote}"
          </div>
        )}
      </div>
    </div>
  );
}
