import React from 'react';
import { Mail, MapPin, Clock, Calendar, MessageCircle } from 'lucide-react';
import { GlobeWireframe } from '@/components/ui/contact-with-globe';
import { STORE_INFO } from '@/constants/storeInfo';
import { LuxuryButton } from './LuxuryButton';

export function AtelierContactDirectory({ onOpenAppointment }) {
  const whatsappUrl = STORE_INFO.whatsapp.inquiryUrl(
    'Hello Khalil & Sons, I would like to inquire about your services.'
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
          Get In Touch
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          Reach out directly by phone, WhatsApp, or email. We are here to assist with any questions or requests.
        </p>
      </div>

      <div className="relative overflow-hidden h-44 sm:h-48 rounded-2xl border border-neutral-200/80 bg-white dark:bg-card shadow-xs p-3">
        <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#5a6061]">
            Global Concierge Network
          </span>
        </div>
        <GlobeWireframe
          className="w-full aspect-square max-w-full absolute -top-8 left-0 text-amber-600 dark:text-amber-400"
          variant="wireframesolid"
          autoRotate
          autoRotateSpeed={0.4}
          strokeWidth={0.8}
          graticuleOpacity={0.12}
          strokeColor="currentColor"
          sphereOutlineColor="currentColor"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-card dark:via-card/80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-white/90 dark:bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-xs"
        >
          <div className="size-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">WhatsApp</span>
            <span className="text-xs font-medium text-foreground group-hover:text-amber-800 transition-colors block truncate">{STORE_INFO.phone.mobileFormatted}</span>
          </div>
        </a>

        <a
          href={`mailto:${STORE_INFO.email}`}
          className="group flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-white/90 dark:bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-xs"
        >
          <div className="size-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Email</span>
            <span className="text-xs font-medium text-foreground group-hover:text-amber-800 transition-colors block truncate">{STORE_INFO.email}</span>
          </div>
        </a>

        <a
          href={STORE_INFO.social.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-white/90 dark:bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-xs"
        >
          <div className="size-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Showroom</span>
            <span className="text-xs font-medium text-foreground block truncate">{STORE_INFO.address.short}</span>
          </div>
        </a>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-white/90 dark:bg-card shadow-xs">
          <div className="size-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Hours</span>
            <span className="text-xs font-medium text-foreground block truncate">{STORE_INFO.hours.monThu}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 className="font-serif text-sm font-medium text-foreground">
            Private Consultation
          </h4>
          <p className="text-[11px] text-muted-foreground font-light">
            Book an appointment for in-person viewing or bespoke jewelry advice
          </p>
        </div>

        <LuxuryButton
          onClick={onOpenAppointment}
          variant="gold"
          size="sm"
          icon={<Calendar className="size-3 text-amber-200" />}
        >
          Book Visit
        </LuxuryButton>
      </div>
    </div>
  );
}
