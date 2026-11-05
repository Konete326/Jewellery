import React from 'react';
import { Ruler, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSizingOptions, getSizingMeta } from '@/utils/jewellerySizing';

export function JewellerySizeSelector({
  sizingType,
  selectedSize,
  onSelectSize,
  onOpenGuide,
  hasError = false
}) {
  const options = getSizingOptions(sizingType);
  const meta = getSizingMeta(sizingType);

  if (!sizingType || options.length === 0 || !meta) return null;

  const currentOption = options.find((opt) => opt.id === selectedSize);

  return (
    <div
      className={cn(
        'mt-5 p-4 rounded-2xl border transition-all duration-200',
        hasError
          ? 'border-amber-500/80 bg-amber-500/5 ring-1 ring-amber-500/30'
          : 'border-border/80 bg-card/40'
      )}
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
            {meta.label}
          </span>
          {currentOption && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-foreground text-background">
              <Check className="size-2.5" />
              <span>{currentOption.label}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenGuide && onOpenGuide(meta.guideTab)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <Ruler className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="underline underline-offset-4 tracking-wide">
            Measurement Guide
          </span>
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
        {options.map((opt) => {
          const isSelected = selectedSize === opt.id;
          const subMetric = opt.diameterMm
            ? `${opt.diameterMm}mm`
            : opt.cm
            ? `${opt.cm}cm`
            : '';

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSize && onSelectSize(opt.id)}
              className={cn(
                'min-h-[44px] py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-2xs',
                isSelected
                  ? 'border-foreground bg-foreground text-background font-medium shadow-xs scale-102 ring-1 ring-foreground/20'
                  : 'border-border/80 bg-background text-foreground hover:bg-muted hover:border-foreground/30'
              )}
            >
              <span className="text-xs font-mono tracking-tight font-medium">
                {opt.id}
              </span>
              {subMetric && (
                <span
                  className={cn(
                    'text-[9px] font-mono tracking-tighter',
                    isSelected ? 'text-background/80' : 'text-muted-foreground'
                  )}
                >
                  {subMetric}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasError && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-amber-700 dark:text-amber-300">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>Please select a size to proceed with handcrafted goldsmithing.</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/50">
        <span>Bespoke quarter & custom sizes made upon request</span>
        <span className="font-serif">Karachi Sarafa Standard</span>
      </div>
    </div>
  );
}

