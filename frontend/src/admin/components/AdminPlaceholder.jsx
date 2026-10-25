import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export function AdminPlaceholder({ title, description, category, icon: Icon = Compass }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
        <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 shadow-xs">
          <Icon className="size-8" />
        </div>


        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
          {title} Module in Development
        </h3>

        <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
          This specialized atelier module is currently being crafted for our master horologists and artisan jewelers. Advanced tooling will become available in the upcoming release.
        </p>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>Atelier Architecture V2.4 • Production Ready Core</span>
        </div>
      </div>
    </div>
  );
}
