import React from 'react';
import { cn } from '@/lib/utils';

export function ProfileIdentityBentoCard({
  formData,
  onChange,
  className
}) {
  const handleNameChange = (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s&.',\-]/g, '').slice(0, 60);
    onChange('name', sanitized);
  };

  const handleTaglineChange = (e) => {
    onChange('tagline', e.target.value.slice(0, 120));
  };

  const handleFounderChange = (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z\s.'\-]/g, '').slice(0, 50);
    onChange('founder', sanitized);
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-2 mb-3 border-b border-border/60">
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-tight">
              Boutique Identity
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Official salon branding & hallmark credentials
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded border border-border bg-muted/40 font-semibold text-foreground">
              AU · 999.0
            </span>
            <span className="px-1.5 py-0.5 rounded border border-border bg-muted/40 font-semibold text-foreground">
              AU · 916.6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg border border-border/70 bg-muted/20">
          <div className="size-11 rounded-lg border border-border/80 bg-background p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons Official Logo"
              className="size-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-semibold text-foreground truncate">
                {formData.name || 'Khalil & Sons Jewellers'}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground px-1.5 py-0.2 rounded bg-muted border border-border/60 shrink-0">
                Official Monogram
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-light">
              Master goldsmithing registered in Murshid Sunaar Tower, Saddar.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Boutique Trade Name
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.name || '').length}/60
              </span>
            </div>
            <input
              type="text"
              value={formData.name || ''}
              onChange={handleNameChange}
              placeholder="Khalil & Sons Jewellers"
              className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs font-serif focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Heritage Tagline & Headline
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.tagline || '').length}/120
              </span>
            </div>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={handleTaglineChange}
              placeholder="Master Goldsmithing & Bridal Jewellery Heirlooms"
              className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Founder & Master Goldsmith
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.founder || '').length}/50
              </span>
            </div>
            <input
              type="text"
              value={formData.founder || ''}
              onChange={handleFounderChange}
              placeholder="Mr. Khalil Ahmed"
              className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 mt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>Lifetime Karat Warranty</span>
        <span>Est. {formData.establishedYear || '1992'}</span>
      </div>
    </div>
  );
}
