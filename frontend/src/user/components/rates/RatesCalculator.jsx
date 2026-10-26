import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';

const TOLA_IN_GRAMS = 11.6638;

export function RatesCalculator({ rates }) {
  const [metal, setMetal] = useState('gold');
  const [karat, setKarat] = useState('22K');
  const [unit, setUnit] = useState('tola');
  const [weight, setWeight] = useState(1);

  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const currentRateItem = useMemo(() => {
    if (metal === 'gold') {
      return gold[karat] || gold['24K'] || { tola: 419000, gram: 35923 };
    }
    return silver[karat === '22K' ? '22K' : '24K'] || silver['24K'] || { tola: 6794, gram: 582.49 };
  }, [metal, karat, gold, silver]);

  const grams = useMemo(() => {
    const val = Number(weight) || 0;
    if (unit === 'tola') return val * TOLA_IN_GRAMS;
    if (unit === 'gram') return val;
    if (unit === 'masha') return (val / 12) * TOLA_IN_GRAMS;
    if (unit === 'ratti') return (val / 96) * TOLA_IN_GRAMS;
    return val * TOLA_IN_GRAMS;
  }, [weight, unit]);

  const totalEstimate = useMemo(() => {
    const gramPrice = currentRateItem?.gram || 0;
    return Math.round(grams * gramPrice);
  }, [grams, currentRateItem]);

  const handleWhatsAppInquiry = () => {
    const unitLabel = unit === 'tola' ? 'Tola' : unit === 'gram' ? 'Grams' : unit === 'masha' ? 'Masha' : 'Ratti';
    const message = `Assalam o Alaikum Khalil & Sons Jewellers,\nI calculated an estimate on your website for:\n• Metal: ${metal === 'gold' ? 'Gold' : 'Silver'} (${karat})\n• Weight: ${weight} ${unitLabel} (~${grams.toFixed(2)} grams)\n• Today's Estimated Raw Metal Value: Rs. ${totalEstimate.toLocaleString('en-PK')}\n\nI would like to inquire about custom crafting and making charges for this specification.`;
    const url = `https://wa.me/${STORE_INFO.phone.mobileRaw}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-6 sm:p-10 shadow-xs mb-12">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="size-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Calculator className="size-4" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-amber-800 dark:text-amber-400 font-mono font-medium">
          Live Valuation Calculator
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight mb-2">
        Instant Karat & Weight Calculator
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground font-light mb-8 max-w-2xl">
        Enter your desired weight in Pakistani Tolas, Grams, Masha, or Ratti to estimate today&apos;s pure bullion metal value based on live Karachi Sarafa benchmark rates.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Precious Metal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setMetal('gold'); setKarat('22K'); }}
                  className={`py-2 px-3 rounded-xl border text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                    metal === 'gold'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'border-border/80 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Gold
                </button>
                <button
                  type="button"
                  onClick={() => { setMetal('silver'); setKarat('24K'); }}
                  className={`py-2 px-3 rounded-xl border text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                    metal === 'silver'
                      ? 'border-slate-500 bg-slate-500/10 text-slate-900 dark:text-slate-200 font-semibold'
                      : 'border-border/80 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Silver
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Karat Standard
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {metal === 'gold' ? (
                  ['24K', '22K', '21K', '18K'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKarat(k)}
                      className={`flex-1 min-w-[50px] py-2 px-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                        karat === k
                          ? 'border-foreground bg-foreground text-background font-semibold'
                          : 'border-border/80 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {k}
                    </button>
                  ))
                ) : (
                  ['24K (Fine)', '22K (925)'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKarat(k.startsWith('24') ? '24K' : '22K')}
                      className={`flex-1 py-2 px-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                        karat.startsWith(k.slice(0, 2))
                          ? 'border-foreground bg-foreground text-background font-semibold'
                          : 'border-border/80 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {k}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Weight Value
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Unit of Measurement
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'tola', label: 'Tola' },
                  { id: 'gram', label: 'Gram' },
                  { id: 'masha', label: 'Masha' },
                  { id: 'ratti', label: 'Ratti' }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnit(u.id)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                      unit === u.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold'
                        : 'border-border/80 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground font-mono">
            Equivalent weight in metric grams: <span className="text-foreground font-medium">{grams.toFixed(3)} g</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-background p-6 sm:p-8 flex flex-col justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-800 dark:text-amber-300 block mb-1">
              Estimated Raw Bullion Value
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-tight my-2">
              Rs. {totalEstimate.toLocaleString('en-PK')}
            </div>

            <div className="space-y-1.5 py-3 border-y border-border/60 text-xs text-muted-foreground font-light mb-4">
              <div className="flex justify-between">
                <span>Selected Metal:</span>
                <span className="font-mono text-foreground">{metal === 'gold' ? 'Gold' : 'Silver'} ({karat})</span>
              </div>
              <div className="flex justify-between">
                <span>Unit Benchmark Rate:</span>
                <span className="font-mono text-foreground">Rs. {Math.round(currentRateItem?.tola || 0).toLocaleString('en-PK')} / tola</span>
              </div>
              <div className="flex justify-between">
                <span>Per Gram Rate:</span>
                <span className="font-mono text-foreground">Rs. {Math.round(currentRateItem?.gram || 0).toLocaleString('en-PK')} / g</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>Inquire This Estimate via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
