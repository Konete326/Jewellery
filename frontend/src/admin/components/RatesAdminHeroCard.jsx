import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHeroCard({ rates, onSaveOverride, isSaving }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const currentGold24 = gold['24K']?.tola || 422000;
  const currentSilver24 = silver['24K']?.tola || 6794;

  const [inputGold, setInputGold] = useState('');
  const [inputSilver, setInputSilver] = useState('');
  const [showSilverInput, setShowSilverInput] = useState(false);

  useEffect(() => {
    if (rates?.gold?.['24K']?.tola) {
      setInputGold(String(rates.gold['24K'].tola));
    }
    if (rates?.silver?.['24K']?.tola) {
      setInputSilver(String(rates.silver['24K'].tola));
    }
  }, [rates]);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    const gVal = Number(inputGold);
    const sVal = Number(inputSilver) || currentSilver24;
    if (!gVal || gVal <= 0) return;
    onSaveOverride({
      gold24kTola: gVal,
      silver24kTola: sVal,
      isManualOverride: true
    });
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block">
            Primary Bullion Benchmark
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-tight">
              {formatPkr(gold['24K']?.tola)}
            </span>
            <span className="text-xs font-mono text-muted-foreground">/ 1 Tola (24K Pure)</span>
          </div>
          <div className="text-xs font-mono text-muted-foreground pt-1 flex items-center gap-3">
            <span>10g: {formatPkr(gold['24K']?.tenGram)}</span>
            <span>•</span>
            <span>1g: {formatPkr(gold['24K']?.gram)}</span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              22K Bridal
            </span>
            <span className="text-base font-serif font-light text-foreground block">
              {formatPkr(gold['22K']?.tola)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-1">
              Per Tola
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              21K Heritage
            </span>
            <span className="text-base font-serif font-light text-foreground block">
              {formatPkr(gold['21K']?.tola)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-1">
              Per Tola
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              24K Silver
            </span>
            <span className="text-base font-serif font-light text-foreground block">
              {formatPkr(silver['24K']?.tola)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-1">
              Per Tola
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border/40">
        <form onSubmit={handleApply} className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Quick Price Adjustment
            </span>
            <button
              type="button"
              onClick={() => setShowSilverInput(!showSilverInput)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showSilverInput ? (
                <>Less Options <ChevronUp className="size-3" /></>
              ) : (
                <>Adjust Silver (Rs. {Math.round(currentSilver24).toLocaleString()}) <ChevronDown className="size-3" /></>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                24K Gold / Tola:
              </span>
              <Input
                type="number"
                step="100"
                required
                value={inputGold}
                onChange={(e) => setInputGold(e.target.value)}
                placeholder="422000"
                className="pl-32 font-mono text-sm bg-background/80 h-10"
              />
            </div>

            {showSilverInput && (
              <div className="relative sm:w-60">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                  Silver:
                </span>
                <Input
                  type="number"
                  step="10"
                  value={inputSilver}
                  onChange={(e) => setInputSilver(e.target.value)}
                  placeholder="6794"
                  className="pl-18 font-mono text-sm bg-background/80 h-10"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-foreground text-background hover:opacity-90 font-mono text-xs h-10 px-5 shrink-0 cursor-pointer"
            >
              <Sparkles className="size-3.5 mr-1.5" />
              {isSaving ? 'Updating...' : 'Publish Rate'}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground font-mono">
            Enter 24K benchmark. 22K, 21K, 18K and gram rates recalculate automatically across the boutique storefront.
          </p>
        </form>
      </div>
    </div>
  );
}
