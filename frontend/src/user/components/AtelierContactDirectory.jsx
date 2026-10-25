import React from 'react';
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';

export function AtelierContactDirectory({ onOpenAppointment }) {
  const whatsappUrl = `https://wa.me/39055218901?text=${encodeURIComponent(
    'Hello Khalil & Sons, I would like to inquire about custom jewellery.'
  )}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="size-3 text-amber-600" />
          <span>Contact Information</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-tight">
          Get In Touch
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          Reach out to us directly by phone, WhatsApp, or email. We are happy to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3.5 p-4 rounded-2xl border border-border/80 bg-white/90 dark:bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-xs"
        >
          <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">WhatsApp Us</span>
            <span className="text-sm font-medium text-foreground group-hover:text-amber-800 transition-colors">+39 055 218 901</span>
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">Chat directly with our team</p>
          </div>
        </a>

        <a
          href="mailto:concierge@khaliljewellery.com"
          className="group flex items-start gap-3.5 p-4 rounded-2xl border border-border/80 bg-white/90 dark:bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all shadow-xs"
        >
          <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Email Us</span>
            <span className="text-sm font-medium text-foreground group-hover:text-amber-800 transition-colors truncate block">concierge@khaliljewellery.com</span>
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">We reply within 24 hours</p>
          </div>
        </a>

        <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/80 bg-white/90 dark:bg-card shadow-xs">
          <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Our Workshop</span>
            <span className="text-sm font-medium text-foreground block">Via de' Tornabuoni 14/R</span>
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">50123 Florence, Italy</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/80 bg-white/90 dark:bg-card shadow-xs">
          <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 block">Opening Hours</span>
            <span className="text-sm font-medium text-foreground block">Monday – Saturday</span>
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">10:00 AM – 7:00 PM</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent flex flex-col gap-4 shadow-sm">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold block mb-1">
            In-Person Visit
          </span>
          <h4 className="font-serif text-lg font-medium text-foreground">
            Visit Our Workshop in Florence
          </h4>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1">
            Visit our showroom in Florence to see our handcrafted jewellery and gemstones in person.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAppointment}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2d3435] text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer shadow-md"
        >
          <Calendar className="size-3.5 text-amber-400" />
          <span>Book an Appointment</span>
        </button>
      </div>
    </div>
  );
}
