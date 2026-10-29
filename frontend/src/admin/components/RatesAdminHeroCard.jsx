import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'PKR ' + Math.round(num).toLocaleString('en-PK');
}

const DIGITS_ONLY_REGEX = /^\d+$/;

export function RatesAdminHeroCard({ rates, onSaveOverride, isSaving }) {
  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const currentGold24 = gold['24K']?.tola || 422000;
  const currentSilver24 = silver['24K']?.tola || 6794;

  const [inputGold, setInputGold] = useState('');
  const [inputSilver, setInputSilver] = useState('');
  const [touched, setTouched] = useState({ gold: false, silver: false });

  useEffect(() => {
    if (rates?.gold?.['24K']?.tola) {
      setInputGold(String(rates.gold['24K'].tola));
    }
    if (rates?.silver?.['24K']?.tola) {
      setInputSilver(String(rates.silver['24K'].tola));
    }
  }, [rates]);

  const handleGoldChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setInputGold(val);
    if (!touched.gold) setTouched((prev) => ({ ...prev, gold: true }));
  };

  const handleSilverChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setInputSilver(val);
    if (!touched.silver) setTouched((prev) => ({ ...prev, silver: true }));
  };

  const goldNum = Number(inputGold);
  const silverNum = Number(inputSilver);

  const getGoldError = () => {
    if (!inputGold) return '24K gold rate is required';
    if (!DIGITS_ONLY_REGEX.test(inputGold)) return 'Digits only';
    if (goldNum < 150000) return 'Rate too low (Min PKR 150,000 / tola)';
    if (goldNum > 1000000) return 'Rate too high (Max PKR 1,000,000 / tola)';
    return null;
  };

  const getSilverError = () => {
    if (!inputSilver) return 'Silver rate is required';
    if (!DIGITS_ONLY_REGEX.test(inputSilver)) return 'Digits only';
    if (silverNum < 2000) return 'Rate too low (Min PKR 2,000 / tola)';
    if (silverNum > 50000) return 'Rate too high (Max PKR 50,000 / tola)';
    return null;
  };

  const goldError = getGoldError();
  const silverError = getSilverError();
  const isValid = !goldError && !silverError;

  const handleApply = (e) => {
    if (e) e.preventDefault();
    setTouched({ gold: true, silver: true });
    if (!isValid) return;
    onSaveOverride({
      gold24kTola: goldNum,
      silver24kTola: silverNum,
      isManualOverride: true
    });
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            24K Gold / Tola
          </span>
          <span className="text-base sm:text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['24K']?.tola)}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            22K Gold / Tola
          </span>
          <span className="text-base sm:text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['22K']?.tola)}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            21K Gold / Tola
          </span>
          <span className="text-base sm:text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['21K']?.tola)}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            18K Gold / Tola
          </span>
          <span className="text-base sm:text-lg font-serif font-semibold text-foreground block">
            {formatPkr(gold['18K']?.tola || Math.round(currentGold24 * (18 / 24)))}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-muted/30">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
            Silver / Tola
          </span>
          <span className="text-base sm:text-lg font-serif font-semibold text-foreground block">
            {formatPkr(silver['22K']?.tola || currentSilver24)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border/40">
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
            <div className="flex-1 space-y-1">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                  24K Gold:
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  required
                  value={inputGold}
                  onChange={handleGoldChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, gold: true }))}
                  placeholder="e.g. 422000"
                  className={`pl-24 font-mono text-sm bg-background h-10 ${
                    touched.gold && goldError ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                  }`}
                />
              </div>
              {touched.gold && goldError && (
                <p className="text-[11px] text-rose-500 font-mono px-1">{goldError}</p>
              )}
            </div>

            <div className="sm:w-64 space-y-1">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                  Silver:
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={inputSilver}
                  onChange={handleSilverChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, silver: true }))}
                  placeholder="e.g. 6794"
                  className={`pl-16 font-mono text-sm bg-background h-10 ${
                    touched.silver && silverError ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                  }`}
                />
              </div>
              {touched.silver && silverError && (
                <p className="text-[11px] text-rose-500 font-mono px-1">{silverError}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSaving || !isValid}
              className="bg-foreground text-background hover:bg-neutral-800 font-mono text-xs h-10 px-6 shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Update Rates'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}