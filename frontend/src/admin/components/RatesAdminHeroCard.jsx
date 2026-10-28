import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHeroCard({ rates, onSaveOverride, isSaving }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const currentGold24 = gold['24K']?.tola || 422000;
  const currentSilver24 = silver['24K']?.tola || 6794;

  const [inputGold, setInputGold] = useState('');
  const [inputSilver, setInputSilver] = useState('');

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
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            24K Gold / Tola
          </span>
          <span className="text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['24K']?.tola)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            22K Gold / Tola
          </span>
          <span className="text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['22K']?.tola)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            21K Gold / Tola
          </span>
          <span className="text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['21K']?.tola)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            18K Gold / Tola
          </span>
          <span className="text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['18K']?.tola || Math.round(currentGold24 * (18 / 24)))}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            Silver / Tola
          </span>
          <span className="text-lg font-serif font-semibold text-foreground block">
            {formatPkr(silver['22K']?.tola || currentSilver24)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border/40">
        <form onSubmit={handleApply} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
              24K Gold:
            </span>
            <Input
              type="number"
              step="100"
              required
              value={inputGold}
              onChange={(e) => setInputGold(e.target.value)}
              placeholder="422000"
              className="pl-24 font-mono text-sm bg-background h-10"
            />
          </div>

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
              className="pl-16 font-mono text-sm bg-background h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="bg-foreground text-background hover:bg-neutral-800 font-mono text-xs h-10 px-5 shrink-0 cursor-pointer shadow-xs"
          >
            {isSaving ? 'Updating...' : 'Update Rates'}
          </Button>
        </form>
      </div>
    </div>
  );
}
