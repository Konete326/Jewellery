import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/user/components/Footer';
import { ratesApi } from '@/api/ratesApi';
import {
  RatesHero,
  RatesCardsGrid,
  RatesTableSection,
  RatesCalculator,
  RatesKnowledgeGuide
} from '@/user/components/rates';
import { updatePageSEO } from '@/utils/seo';
import { broadcastRatesUpdate } from '@/utils/tabSync';

const CACHE_KEY = 'khalil_sarafa_rates_cache';

const BENCHMARK_RATES = {
  gold: {
    '24K': { tola: 419000, tenGram: 359230, gram: 35923, ounce: 1018405 },
    '22K': { tola: 384083, tenGram: 329294, gram: 32929, ounce: 0 },
    '21K': { tola: 366625, tenGram: 314326, gram: 31433, ounce: 0 },
    '18K': { tola: 314250, tenGram: 269423, gram: 26942, ounce: 0 }
  },
  silver: {
    '24K': { tola: 6794, tenGram: 5824.9, gram: 582.49, ounce: 0 },
    '22K': { tola: 6284, tenGram: 5388, gram: 538.8, ounce: 0 }
  },
  marketSource: 'Karachi Sarafa Jewellers Association (gold.pk)',
  marketStatus: 'Open',
  isManualOverride: false,
  lastSyncedAt: new Date().toISOString()
};

let memoryRatesCache = null;

function getInitialRates() {
  if (memoryRatesCache) return memoryRatesCache;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.gold?.['24K']?.tola) {
        memoryRatesCache = parsed;
        return parsed;
      }
    }
  } catch {}
  return BENCHMARK_RATES;
}

export default function RatesPage() {
  const [rates, setRates] = useState(getInitialRates);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRates = useCallback(async (silent = true) => {
    try {
      const res = await ratesApi.getRates({ silent });
      if (res?.success && res.data) {
        setRates(res.data);
        memoryRatesCache = res.data;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
        } catch {}
        broadcastRatesUpdate(res.data);
      }
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updatePageSEO({
      title: 'Live Gold & Silver Rates Karachi | Khalil & Sons Jewellers',
      description: 'Check today live 24K, 22K, 21K, and 18K gold and pure silver rates in Karachi Sarafa Market. Certified hallmark pricing by Khalil & Sons Jewellers, Saddar.',
      keywords: 'gold rates karachi, today gold price pakistan, 22k gold rate tola, 24k gold price, silver rate pakistan, sarafa market karachi, khalil and sons'
    });

    const handleRatesChange = (e) => {
      if (e?.detail?.rates) {
        setRates(e.detail.rates);
        memoryRatesCache = e.detail.rates;
      }
    };
    window.addEventListener('khalil_rates_change', handleRatesChange);

    const intervalId = setInterval(() => {
      fetchRates(true);
    }, 45000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('khalil_rates_change', handleRatesChange);
    };
  }, [fetchRates]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRates(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435] flex flex-col justify-between">
      <Header />

      <main className="relative z-10 pt-24 md:pt-28 pb-16 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex-1">
        <nav className="mb-6 flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Sarafa Market Rates</span>
        </nav>

        <RatesHero
          rates={rates}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <RatesCardsGrid rates={rates} />

        <RatesTableSection rates={rates} />

        <RatesCalculator rates={rates} />

        <RatesKnowledgeGuide />
      </main>

      <Footer />
    </div>
  );
}
