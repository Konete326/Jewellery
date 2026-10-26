import React from 'react';
import { Award, ShieldCheck, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';

export function RatesKnowledgeGuide() {
  const guides = [
    {
      karat: '24K Gold (999 Purity)',
      title: 'Pure Bullion Standard',
      description: 'Contains 99.9% pure elemental gold. Because pure 24K gold is inherently malleable and soft, it is cast into investment bullion biscuits, bars, and commemorative coins rather than wearable prong-set bridal jewellery.'
    },
    {
      karat: '22K Gold (916 Purity)',
      title: 'Artisanal Bridal Standard',
      description: 'Contains 91.67% pure gold alloyed with 8.33% silver and copper. This exact alloy ratio grants supreme ductility and tensile strength for hand-forged Mughal filigree, solid kadas, and wedding necklaces.'
    },
    {
      karat: '21K Gold (875 Purity)',
      title: 'Heritage South Asian Alloy',
      description: 'Contains 87.5% gold. Popular across vintage Karachi and Middle Eastern jewel markets for traditional churyan and antique polish designs that endure generation after generation.'
    },
    {
      karat: '18K Gold (750 Purity)',
      title: 'Diamond & Solitaire Mounts',
      description: 'Contains 75.0% pure gold. Provides maximum structural hardness necessary to hold natural brilliant-cut diamonds, baguettes, and fine precious gemstones securely without loose prongs.'
    }
  ];

  return (
    <div className="w-full space-y-10 mb-16">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-800 dark:text-amber-400 font-mono font-medium">
            Artisan Purity Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
            Understanding Gold Karats & Hallmark Purity
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Every piece crafted at Khalil & Sons is verified with laser assay hallmarking, ensuring collectors receive exact certified purity with full lifetime buy-back integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/70 bg-background/50 p-6 flex flex-col justify-between hover:border-border transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 font-semibold">
                    {g.karat}
                  </span>
                  <Award className="size-4 text-amber-700 dark:text-amber-400" />
                </div>
                <h3 className="text-base font-medium text-foreground tracking-tight mb-2">
                  {g.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {g.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-foreground tracking-tight mb-1">
              Visit the Saddar Boutique for Live In-Store Appraisals
            </h3>
            <p className="text-xs text-muted-foreground font-light max-w-xl">
              Inspect physical 22K and 24K gold bullion pieces, verify hallmarks with our digital spectrometers, and discuss bespoke wedding jewellery at our flagship showroom in Murshid Sunaar Tower.
            </p>
          </div>
        </div>

        <a
          href={STORE_INFO.social.googleMapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background hover:opacity-90 text-xs uppercase tracking-wider font-semibold shrink-0 transition-opacity"
        >
          <MapPin className="size-3.5" />
          <span>Get Showroom Directions</span>
        </a>
      </div>
    </div>
  );
}
