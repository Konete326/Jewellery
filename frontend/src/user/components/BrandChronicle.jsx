import React from 'react'
import { ShieldCheck, Award, Gem, MapPin, Phone, MessageCircle, Calendar } from 'lucide-react'
import { STORE_INFO } from '@/constants/storeInfo'
import { LuxuryButton } from './LuxuryButton'

const ERAS = [
  {
    year: '1992',
    title: 'The Handcrafted Workshop',
    location: 'Murshid Bazaar, Saddar',
    description: 'Founded by master craftsman Mr. Khalil Ahmed. Built on traditional Mughal filigree wirework, hand-forged gold bangles (kadas), and bespoke bridal churyan for Karachi families.',
    highlight: 'Master Goldsmith Foundations'
  },
  {
    year: '2010',
    title: 'Sarafa Bullion & Purity Vault',
    location: 'Murshid Sunaar Tower',
    description: 'Pioneered stringent purity testing and bullion standards in Saddar Sarafa. Guaranteeing certified 22K (.916) and 24K pure gold with unmatched honesty and lifetime trust.',
    highlight: 'Certified Hallmark Standard'
  },
  {
    year: 'Modern Era',
    title: 'Generational 3D CAD Atelier',
    location: 'Flagship Showroom #2',
    description: 'The sons joined the atelier, bringing high-precision 3D computer-aided design together with ancestral hand-carving. Clients preview photorealistic 3D models before molten gold casting.',
    highlight: 'Heritage Meets Innovation'
  }
]

const PILLARS = [
  {
    icon: <ShieldCheck className="size-5 text-amber-700 dark:text-amber-400" />,
    title: 'Lifetime Hallmark Guarantee',
    description: 'Every piece is crafted in certified 22K (.916) or 21K (.875) gold with verified assay hallmarks and authentic buy-back transparency.'
  },
  {
    icon: <Gem className="size-5 text-amber-700 dark:text-amber-400" />,
    title: 'Mughal Filigree & Hand-Forged Kadas',
    description: 'Handcrafted wire by wire using antique soldering techniques that preserve centuries of traditional South Asian jewelry heritage.'
  },
  {
    icon: <Award className="size-5 text-amber-700 dark:text-amber-400" />,
    title: 'Ethical Diamonds & Heritage Polki',
    description: 'Only 100% natural, conflict-free diamonds and jadau uncut polki stones set securely by specialized master artisans.'
  },
  {
    icon: <MapPin className="size-5 text-amber-700 dark:text-amber-400" />,
    title: 'Single Authentic Boutique',
    description: 'We operate exclusively from Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. No duplicate branches.'
  }
]

export function BrandChronicle({ onOpenAppointment }) {
  const whatsappUrl = STORE_INFO.whatsapp.inquiryUrl(
    'Hello Khalil & Sons, I would like to learn more about your brand history and bespoke bridal jewelry.'
  )

  return (
    <section className="relative w-full max-w-7xl xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 md:mb-20">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-800 dark:text-amber-400 font-medium font-mono">
          Three Decades of Goldsmithing • Saddar, Karachi
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-foreground tracking-tight">
          The Journey of Khalil & Sons
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
          From a humble artisanal bench in Murshid Bazaar to one of Karachi’s most respected family-owned jewelry ateliers. Discover the milestones that shaped our heritage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 md:mb-24">
        {ERAS.map((era) => (
          <div
            key={era.year}
            className="group relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-serif font-light text-amber-800 dark:text-amber-400">
                  {era.year}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  {era.highlight}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-foreground tracking-tight">
                {era.title}
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                {era.location}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                {era.description}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-border/50 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-400 font-mono">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>Authentic Karigar Lineage</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-16 md:mb-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono font-medium">
            Our Guarantees
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground">
            Built on Trust, Purity & Transparency
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h4 className="text-sm font-medium text-foreground tracking-tight">
                {pillar.title}
              </h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-card p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
            <MapPin className="size-3.5" />
            <span>{STORE_INFO.address.short}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground">
            Visit Our Saddar Karachi Atelier
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Experience our handcrafted jewelry collections in person or sit down with our goldsmiths to design your custom wedding set.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-amber-700" />
              <span>{STORE_INFO.phone.landlineFormatted}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-emerald-600" />
              <span>{STORE_INFO.phone.mobile}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <LuxuryButton
              variant="gold"
              className="w-full"
              icon={<MessageCircle className="size-4 text-amber-200" />}
            >
              WhatsApp Atelier
            </LuxuryButton>
          </a>
          {onOpenAppointment && (
            <LuxuryButton
              onClick={onOpenAppointment}
              variant="gold"
              className="w-full sm:w-auto"
              icon={<Calendar className="size-4 text-amber-200" />}
            >
              Book Private Visit
            </LuxuryButton>
          )}
        </div>
      </div>
    </section>
  )
}
