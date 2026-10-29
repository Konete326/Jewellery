import React from 'react';
import { Award, ShieldCheck, AlertCircle } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function ProfileSecurityBentoCard({
  formData,
  onChange,
  isYearValid = true,
  className
}) {
  const user = getAuthUser();

  const handleAssayChange = (e) => {
    onChange('assayStandard', e.target.value.slice(0, 100));
  };

  const handleYearChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange('establishedYear', digits);
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
              Assay Standards & Director
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Hallmark purity guarantee & access privileges
            </p>
          </div>

          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Verified Director
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-2 rounded-lg border border-border/70 bg-muted/20 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-8 rounded-full border border-border bg-background flex items-center justify-center font-serif text-xs font-semibold text-foreground shrink-0 shadow-2xs">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-medium text-foreground block truncate">
                  {user?.name || 'Atelier Director'}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block truncate">
                  {user?.email || 'admin@gmail.com'}
                </span>
              </div>
            </div>

            <span className="text-[9px] font-mono text-muted-foreground px-1.5 py-0.5 rounded border border-border/60 bg-muted shrink-0">
              Active Session
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Award className="size-2.5 text-muted-foreground" />
                <span>Assay Purity Guarantee Policy</span>
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.assayStandard || '').length}/100
              </span>
            </div>
            <input
              type="text"
              value={formData.assayStandard || ''}
              onChange={handleAssayChange}
              placeholder="Certified 22K (916.6), 21K (875.0) & 18K (750.0) Hallmark Guaranteed"
              className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Established Heritage Year (YYYY)
              </label>
              {!isYearValid && (
                <span className="text-[9px] font-mono text-rose-600 inline-flex items-center gap-0.5">
                  <AlertCircle className="size-2.5" />
                  1900-2099
                </span>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={formData.establishedYear || ''}
              onChange={handleYearChange}
              placeholder="1992"
              className={`w-full h-8 px-2.5 rounded-md border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 ${
                !isYearValid
                  ? 'border-rose-500 focus-visible:ring-rose-500/30'
                  : 'border-border/80 focus-visible:ring-foreground/20'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 mt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="size-2.5" />
          <span>Assay Laser Standard</span>
        </span>
        <span>Karachi Central Vault</span>
      </div>
    </div>
  );
}
