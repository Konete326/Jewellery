import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileIdentityBentoCard({
  formData,
  onChange,
  className
}) {
  return (
    <div
      className={cn(
        'bg-background border-border/80 relative w-full overflow-hidden rounded-xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between',
        'supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
        className
      )}
    >
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 size-full mix-blend-overlay opacity-30 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] bg-[size:24px]"
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
              Atelier Identity
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
              Est. 1992
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/60 font-semibold text-foreground">
              AU · 999.0
            </span>
            <span className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/60 font-semibold text-foreground">
              AU · 916.6
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5 p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <div className="relative size-16 sm:size-20 rounded-xl border border-border bg-card p-2 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons Official Logo"
              className="size-full object-contain"
            />
            <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-background border border-border/80 shadow-xs text-muted-foreground" title="Official Logo is read-only">
              <Lock className="size-2.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
                {formData.name || 'Khalil & Sons Jewellers'}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/50">
                Read-Only Asset
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">
              Official calligraphic gold monogram registered with Murshid Sunaar Tower assay office.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Boutique Trade Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Khalil & Sons Jewellers"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Atelier Tagline & Heritage Headline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="Master Goldsmithing & Bridal Jewellery Heirlooms"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
          <span>Lifetime Karat Warranty</span>
        </span>
        <span>Founder: {formData.founder || 'Mr. Khalil Ahmed'}</span>
      </div>
    </div>
  );
}
