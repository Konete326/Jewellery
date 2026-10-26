import React, { useState, useEffect, useMemo } from 'react';
import { Save, RotateCcw, Check, Sparkles, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const TOLA_GRAMS = 11.6638;

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminOverrideForm({ rates, onSave, onReset, isSaving }) {
  const [gold24kTola, setGold24kTola] = useState('');
  const [silver24kTola, setSilver24kTola] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(true);

  useEffect(() => {
    if (rates?.gold?.['24K']?.tola) {
      setGold24kTola(String(rates.gold['24K'].tola));
    }
    if (rates?.silver?.['24K']?.tola) {
      setSilver24kTola(String(rates.silver['24K'].tola));
    }
    if (rates?.isManualOverride !== undefined) {
      setIsManualOverride(Boolean(rates.isManualOverride));
    }
  }, [rates]);

  const g24 = Number(gold24kTola) || 0;
  const s24 = Number(silver24kTola) || 0;

  const preview = useMemo(() => {
    const g22 = Math.round(g24 * (22 / 24));
    const g21 = Math.round(g24 * (21 / 24));
    const g18 = Math.round(g24 * (18 / 24));
    const g10g = Math.round((g24 / TOLA_GRAMS) * 10);
    const g1g = Math.round(g24 / TOLA_GRAMS);

    const s10g = Math.round((s24 / TOLA_GRAMS) * 10 * 10) / 10;
    const s1g = Math.round((s24 / TOLA_GRAMS) * 100) / 100;
    const s22 = Math.round(s24 * 0.925);

    return { g22, g21, g18, g10g, g1g, s10g, s1g, s22 };
  }, [g24, s24]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!g24 || g24 <= 0) return;
    onSave({
      gold24kTola: g24,
      silver24kTola: s24 || 6794,
      isManualOverride
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-serif font-light text-foreground">
            Artisan Rate Override & Auto-Calculation
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Enter 24K Gold or Silver base price per Tola. All other karats (22K, 21K, 18K) and weights (10g, 1g) auto-recalculate instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="manual-override-toggle"
            checked={isManualOverride}
            onCheckedChange={(val) => setIsManualOverride(Boolean(val))}
          />
          <label htmlFor="manual-override-toggle" className="text-xs font-mono font-medium text-foreground cursor-pointer select-none">
            Lock as Active Benchmark
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
            24K Pure Gold Price / Tola (PKR)
          </label>
          <Input
            type="number"
            step="100"
            min="1000"
            required
            value={gold24kTola}
            onChange={(e) => setGold24kTola(e.target.value)}
            placeholder="e.g. 420000"
            className="font-mono text-base bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
            24K Pure Silver Price / Tola (PKR)
          </label>
          <Input
            type="number"
            step="10"
            min="100"
            required
            value={silver24kTola}
            onChange={(e) => setSilver24kTola(e.target.value)}
            placeholder="e.g. 6800"
            className="font-mono text-base bg-background"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
          Auto-Calculated Rates Preview (Live across User Storefront)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-card border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase">22K Bridal / Tola</span>
            <span className="text-sm font-semibold text-foreground">{formatPkr(preview.g22)}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase">21K Heritage / Tola</span>
            <span className="text-sm font-semibold text-foreground">{formatPkr(preview.g21)}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase">18K Solitaire / Tola</span>
            <span className="text-sm font-semibold text-foreground">{formatPkr(preview.g18)}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase">24K Gold / Gram</span>
            <span className="text-sm font-semibold text-foreground">{formatPkr(preview.g1g)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isSaving}
          className="cursor-pointer text-xs"
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          Reset to Scraped Market Rates
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-foreground text-background hover:opacity-90 cursor-pointer text-xs uppercase tracking-wider font-semibold"
        >
          <Save className="size-3.5 mr-1.5" />
          {isSaving ? 'Saving...' : 'Save & Publish Rates'}
        </Button>
      </div>
    </form>
  );
}
