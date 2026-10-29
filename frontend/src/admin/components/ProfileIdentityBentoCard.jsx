import React from 'react';
import { cn } from '@/lib/utils';

export function ProfileIdentityBentoCard({
  formData,
  onChange,
  className
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-medium text-foreground tracking-tight">
              Boutique Identity
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Official salon branding and hallmark credentials
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded-md border border-border bg-muted/40 font-semibold text-foreground">
              AU · 999.0
            </span>
            <span className="px-2 py-0.5 rounded-md border border-border bg-muted/40 font-semibold text-foreground">
              AU · 916.6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 mb-4 p-3 rounded-lg border border-border/70 bg-muted/20">
          <div className="size-14 rounded-lg border border-border/80 bg-background p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons Official Logo"
              className="size-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-semibold text-foreground truncate">
                {formData.name || 'Khalil & Sons Jewellers'}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border/60 shrink-0">
                Official Monogram
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate font-light">
              Master goldsmithing registered in Murshid Sunaar Tower, Saddar.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Boutique Trade Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Khalil & Sons Jewellers"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs font-serif focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Heritage Tagline & Headline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="Master Goldsmithing & Bridal Jewellery Heirlooms"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Founder & Master Goldsmith
            </label>
            <input
              type="text"
              value={formData.founder || ''}
              onChange={(e) => onChange('founder', e.target.value)}
              placeholder="Mr. Khalil Ahmed"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>Lifetime Karat Warranty</span>
        <span>Est. {formData.establishedYear || '1992'}</span>
      </div>
    </div>
  );
}
