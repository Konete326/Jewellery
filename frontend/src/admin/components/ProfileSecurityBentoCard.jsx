import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Award, ShieldAlert, KeyRound } from 'lucide-react';
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
        'bg-background border-border/80 relative w-full overflow-hidden rounded-xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between',
        'supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
              Assay & Credentials
            </Badge>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">
            Director Privileges
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full border border-border bg-card flex items-center justify-center font-serif text-base font-semibold text-foreground shrink-0 shadow-xs">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-foreground block truncate">
                  {user?.name || 'Atelier Director'}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {user?.email || 'admin@gmail.com'}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] shrink-0 text-emerald-700 dark:text-emerald-400">
              Admin Active
            </Badge>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <Award className="size-3 text-muted-foreground" />
                <span>Assay & Purity Guarantee Policy</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.assayStandard || ''}
              onChange={(e) => onChange('assayStandard', e.target.value)}
              placeholder="Certified 22K (916.6) & 24K (999.0) Hallmark Guaranteed"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <KeyRound className="size-3" />
          <span>Role-Based Access Control</span>
        </span>
        <span>Karachi Central Vault</span>
      </div>
    </div>
  );
}
