import React from 'react';
import { ShieldCheck, Lock, Unlock } from 'lucide-react';

export function OrderVerificationSection({ formData, onChange }) {
  const isAvailabilityVerified = Boolean(formData.isAvailabilityVerified);
  const goldRateLock = formData.goldRateLock || {};
  const isLocked = Boolean(goldRateLock.isLocked);

  const handleAvailabilityToggle = (e) => {
    onChange((prev) => ({
      ...prev,
      isAvailabilityVerified: e.target.checked
    }));
  };

  const handleRateLockToggle = (e) => {
    const checked = e.target.checked;
    onChange((prev) => ({
      ...prev,
      goldRateLock: {
        ...prev.goldRateLock,
        isLocked: checked,
        lockedAt: checked ? new Date() : null
      }
    }));
  };

  const handleRateChange = (e) => {
    const val = Number(e.target.value) || 0;
    onChange((prev) => ({
      ...prev,
      goldRateLock: {
        ...prev.goldRateLock,
        lockedRate: val
      }
    }));
  };

  const handleKaratChange = (e) => {
    const val = e.target.value;
    onChange((prev) => ({
      ...prev,
      goldRateLock: {
        ...prev.goldRateLock,
        karat: val
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono uppercase tracking-wider text-[11px] text-foreground font-medium flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-amber-600 shrink-0" />
            <span>Inventory Verification</span>
          </span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAvailabilityVerified}
              onChange={handleAvailabilityToggle}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {isAvailabilityVerified
            ? 'Stock availability & workshop materials verified by master goldsmith.'
            : 'Pending workshop confirmation of metal purity and gemstone stock.'}
        </p>
      </div>

      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono uppercase tracking-wider text-[11px] text-foreground font-medium flex items-center gap-1.5">
            {isLocked ? (
              <Lock className="size-3.5 text-amber-600 shrink-0" />
            ) : (
              <Unlock className="size-3.5 text-muted-foreground shrink-0" />
            )}
            <span>Gold Rate-Lock Agreement</span>
          </span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={handleRateLockToggle}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {isLocked ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 border-t border-border/60">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Locked Rate / Tola (PKR)
              </label>
              <input
                type="number"
                value={goldRateLock.lockedRate || ''}
                onChange={handleRateChange}
                placeholder="e.g. 422000"
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Assay Standard
              </label>
              <select
                value={goldRateLock.karat || '22K'}
                onChange={handleKaratChange}
                className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground cursor-pointer focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
              >
                <option value="24K">24K Pure (.999)</option>
                <option value="22K">22K Bridal (.916)</option>
                <option value="21K">21K Heritage (.875)</option>
                <option value="18K">18K Modern (.750)</option>
              </select>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Floating market rate applied. Toggle to freeze bullion benchmark price.
          </p>
        )}
      </div>
    </div>
  );
}
