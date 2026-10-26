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

export default function RatesPage() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRates = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await ratesApi.getRates({ silent });
      if (res?.success && res.data) {
        setRates(res.data);
      }
    } catch (e) {
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updatePageSEO({
      title: 'Live Gold & Silver Rates Karachi | Khalil & Sons Jewellers',
      description: 'Check today live 24K, 22K, 21K, and 18K gold and pure silver rates in Karachi Sarafa Market. Certified hallmark pricing by Khalil & Sons Jewellers, Saddar.',
      keywords: 'gold rates karachi, today gold price pakistan, 22k gold rate tola, 24k gold price, silver rate pakistan, sarafa market karachi, khalil and sons'
    });
  }, [fetchRates]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRates(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435] flex flex-col justify-between">
      <Header />

      <main className="relative z-10 pt-24 md:pt-28 pb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
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
