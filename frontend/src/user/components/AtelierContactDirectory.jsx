import React from 'react';
import { Mail, MapPin, Phone, Calendar, MessageCircle, Navigation, Clock, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { LuxuryButton } from './LuxuryButton';
import { StoreStatusBadge } from '@/components/StoreStatusBadge';

export function AtelierContactDirectory({ onOpenAppointment }) {
  const whatsappUrl = getPersonalizedWhatsAppInquiry();

  return (
    <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-7 shadow-xs flex flex-col justify-between h-full gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-serif font-light text-foreground tracking-tight">
            Contact Directory
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Direct phone, email, and location details for our Saddar, Karachi showroom.
          </p>
        </div>
        <StoreStatusBadge variant="pill" className="shrink-0" />
      </div>

      <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-muted/30 p-3.5 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-900 dark:text-amber-300 font-semibold">
                Saddar, Karachi Atelier
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300">
                AU · 916.6
              </span>
            </div>
            <p className="font-serif text-sm font-medium text-foreground tracking-tight">
              Murshid Sunaar Tower, Dr. Daud Pota Road
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground flex-wrap pt-0.5">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 text-amber-600 shrink-0" />
                Near Regal Chowk, Saddar
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3 text-amber-600 shrink-0" />
                2:00 PM - 9:00 PM (Fri 3:30 PM)
              </span>
            </div>
          </div>

          <a
            href={STORE_INFO.social.googleMapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-background hover:bg-muted text-foreground text-[10px] font-mono uppercase tracking-wider transition-colors shadow-2xs"
            title="Open directions in Google Maps"
          >
            <Navigation className="size-3 text-amber-600" />
            <span className="hidden sm:inline">Directions</span>
            <ExternalLink className="size-2.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-900 shrink-0">
            <MessageCircle className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900 block">WhatsApp</span>
            <span className="text-xs font-medium text-foreground group-hover:text-neutral-900 transition-colors block truncate">{STORE_INFO.phone.mobileFormatted}</span>
          </div>
        </a>

        <a
          href={`tel:${STORE_INFO.phone.landline}`}
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
            <Phone className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">Landline</span>
            <span className="text-xs font-medium text-foreground group-hover:text-neutral-900 transition-colors block truncate">{STORE_INFO.phone.landlineFormatted}</span>
          </div>
        </a>

        <a
          href={`mailto:${STORE_INFO.email}`}
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
            <Mail className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">Email</span>
            <span className="text-xs font-medium text-foreground group-hover:text-neutral-900 transition-colors block truncate">{STORE_INFO.email}</span>
          </div>
        </a>

        <a
          href={STORE_INFO.social.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
            <MapPin className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">Showroom</span>
            <span className="text-xs font-medium text-foreground block truncate">{STORE_INFO.address.short}</span>
          </div>
        </a>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/80">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={STORE_INFO.social.googleMapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors"
          >
            <Navigation className="size-3.5" />
            <span>Maps & Directions &rarr;</span>
          </a>
        </div>

        {onOpenAppointment && (
          <LuxuryButton
            onClick={onOpenAppointment}
            variant="gold"
            size="sm"
            icon={<Calendar className="size-3 text-amber-200" />}
          >
            Book Private Visit
          </LuxuryButton>
        )}
      </div>
    </div>
  );
}
