import React from 'react';
import { Mail, MapPin, Phone, Calendar, MessageCircle, Navigation } from 'lucide-react';
import { GlobeWireframe } from '@/components/ui/contact-with-globe';
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
            Atelier Directory
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Direct concierge channels for our Saddar Karachi boutique.
          </p>
        </div>
        <StoreStatusBadge variant="pill" className="shrink-0" />
      </div>

      <div className="relative overflow-hidden h-28 rounded-xl border border-neutral-200/80 bg-muted/20 shadow-2xs p-2.5">
        <div className="absolute top-2 left-2.5 z-10 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
            Saddar Karachi Concierge
          </span>
        </div>
        <GlobeWireframe
          className="w-full aspect-square max-w-full absolute -top-12 left-0 text-amber-600 dark:text-amber-400"
          variant="wireframesolid"
          autoRotate
          autoRotateSpeed={0.4}
          strokeWidth={0.8}
          graticuleOpacity={0.12}
          strokeColor="currentColor"
          sphereOutlineColor="currentColor"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-card dark:via-card/80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400 block">WhatsApp</span>
            <span className="text-xs font-medium text-foreground group-hover:text-amber-800 transition-colors block truncate">{STORE_INFO.phone.mobileFormatted}</span>
          </div>
        </a>

        <a
          href={`tel:${STORE_INFO.phone.landline}`}
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Phone className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block">Landline</span>
            <span className="text-xs font-medium text-foreground group-hover:text-amber-800 transition-colors block truncate">{STORE_INFO.phone.landlineFormatted}</span>
          </div>
        </a>

        <a
          href={`mailto:${STORE_INFO.email}`}
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block">Email</span>
            <span className="text-xs font-medium text-foreground group-hover:text-amber-800 transition-colors block truncate">{STORE_INFO.email}</span>
          </div>
        </a>

        <a
          href={STORE_INFO.social.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-2xs"
        >
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="size-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block">Showroom</span>
            <span className="text-xs font-medium text-foreground block truncate">{STORE_INFO.address.short}</span>
          </div>
        </a>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/80">
        <a
          href={STORE_INFO.social.googleMapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-800 dark:text-amber-300 hover:text-amber-600 transition-colors"
        >
          <Navigation className="size-3.5" />
          <span>Maps & Directions &rarr;</span>
        </a>

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
