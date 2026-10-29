import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function ProfileSecurityBentoCard({
  formData,
  onChange,
  className
}) {
  const user = getAuthUser();

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
              Assay Standards & Director
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Hallmark purity policies and administrative privileges
            </p>
          </div>

          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Verified Director
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-2.5 rounded-lg border border-border/70 bg-muted/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-full border border-border bg-background flex items-center justify-center font-serif text-sm font-semibold text-foreground shrink-0 shadow-2xs">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-medium text-foreground block truncate">
                  {user?.name || 'Atelier Director'}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {user?.email || 'admin@gmail.com'}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded border border-border/60 bg-muted shrink-0">
              Active Session
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <Award className="size-3 text-muted-foreground" />
                <span>Assay & Purity Guarantee Policy</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.assayStandard || ''}
              onChange={(e) => onChange('assayStandard', e.target.value)}
              placeholder="Certified 22K (916.6), 21K (875.0) & 18K (750.0) Hallmark Guaranteed"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Established Heritage Year
            </label>
            <input
              type="text"
              value={formData.establishedYear || ''}
              onChange={(e) => onChange('establishedYear', e.target.value)}
              placeholder="1992"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="size-3" />
          <span>Assay Laser Standard</span>
        </span>
        <span>Karachi Central Vault</span>
      </div>
    </div>
  );
}
