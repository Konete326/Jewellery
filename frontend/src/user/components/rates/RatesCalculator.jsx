import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '@/constants/storeInfo';
import { openWhatsAppChat } from '@/utils/whatsapp';

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
    return silver[karat === '999' || karat === '24K' ? '24K' : '22K'] || silver['22K'] || silver['24K'] || { tola: 6284, gram: 538.8 };
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
    const metalLabel = metal === 'gold' ? `Gold (${karat})` : (karat === '925' ? '925 Pure Silver' : 'Fine Silver 999');
    const message = `Hello Khalil & Sons Jewellers,\nI calculated an estimate on your website for:\n• Metal: ${metalLabel}\n• Weight: ${weight} ${unitLabel} (~${grams.toFixed(2)} grams)\n• Today's Estimated Raw Metal Value: PKR ${totalEstimate.toLocaleString('en-PK')}\n\nI would like to inquire about custom crafting and making charges for this specification.`;
    openWhatsAppChat(message, STORE_INFO?.phone?.mobileRaw || '923333213613');
  };

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-6 sm:p-10 shadow-xs mb-12">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="size-3.5 text-amber-700 dark:text-amber-400" />
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
                  onClick={() => { setMetal('silver'); setKarat('925'); }}
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
                {metal === 'gold' ? 'Karat Standard' : 'Silver Purity'}
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
                  [
                    { id: '925', label: '925 Pure Silver' },
                    { id: '999', label: 'Fine Silver (999)' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setKarat(s.id)}
                      className={`flex-1 py-2 px-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                        karat === s.id
                          ? 'border-foreground bg-foreground text-background font-semibold'
                          : 'border-border/80 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {s.label}
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
          <motion.div
            key={`${metal}-${karat}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-xs ${
              metal === 'silver'
                ? 'border-slate-400/40 bg-gradient-to-br from-slate-500/10 via-card to-background'
                : 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-background'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className={`text-xs font-mono uppercase tracking-widest block ${
                metal === 'silver' ? 'text-slate-700 dark:text-slate-300' : 'text-amber-800 dark:text-amber-300'
              }`}>
                Estimated Raw Bullion Value
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                metal === 'silver'
                  ? 'bg-slate-500/15 text-slate-800 dark:text-slate-200 border-slate-500/30'
                  : 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30'
              }`}>
                <span className={`size-1.5 rounded-full shrink-0 ${metal === 'silver' ? 'bg-slate-500' : 'bg-amber-600'}`} />
                {metal === 'silver' ? `Silver (${karat}) Calculated` : `Gold (${karat}) Calculated`}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-tight my-2">
              PKR {totalEstimate.toLocaleString('en-PK')}
            </div>

            <div className="space-y-1.5 py-3 border-y border-border/60 text-xs text-muted-foreground font-light mb-4">
              <div className="flex justify-between">
                <span>Selected Metal:</span>
                <span className="font-mono text-foreground font-medium">
                  {metal === 'gold' ? `Gold (${karat})` : (karat === '925' ? '925 Pure Silver' : 'Fine Silver (999)')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unit Benchmark Rate:</span>
                <span className="font-mono text-foreground">
                  PKR {Math.round(currentRateItem?.tola || 0).toLocaleString('en-PK')} / tola
                </span>
              </div>
              <div className="flex justify-between">
                <span>Per Gram Rate:</span>
                <span className="font-mono text-foreground">
                  PKR {Math.round(currentRateItem?.gram || 0).toLocaleString('en-PK')} / g
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-foreground hover:bg-neutral-800 text-background text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>Inquire This Estimate via WhatsApp</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
