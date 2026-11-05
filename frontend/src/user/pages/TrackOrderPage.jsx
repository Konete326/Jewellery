import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/user/components/Footer';
import { AtelierVaultDrawer } from '@/components/vault/AtelierVaultDrawer';
import { CartDrawer } from '@/user/components/CartDrawer';
import { fetchOrderByNumber } from '@/api/orderApi';
import { TrackOrderSearchForm } from '@/user/components/tracking/TrackOrderSearchForm';
import { TrackOrderStatusTimeline } from '@/user/components/tracking/TrackOrderStatusTimeline';
import { TrackOrderItemsCard } from '@/user/components/tracking/TrackOrderItemsCard';
import { TrackOrderSummaryCard } from '@/user/components/tracking/TrackOrderSummaryCard';
import { TrackOrderErrorCard } from '@/user/components/tracking/TrackOrderErrorCard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function TrackOrderPage() {
  const location = useLocation();
  const resultsRef = useRef(null);

  const [orderNumber, setOrderNumber] = useState(() => {
    return location.state?.initialOrderNumber || '';
  });
  const [phone, setPhone] = useState(() => {
    return location.state?.initialPhone || '';
  });

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const executeTrack = async (targetOrderNum, targetPhone) => {
    const cleanNum = String(targetOrderNum || '').trim();
    const cleanPhone = String(targetPhone || '').trim();

    if (!cleanNum || !cleanPhone) {
      toast.error('Both order number and phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchOrderByNumber(cleanNum, cleanPhone);
      const data = res?.data || res;
      setOrderData(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setOrderData(null);
      setError({
        status: err?.status || 500,
        message: err?.message || 'Verification failed. Please check your order details.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.initialOrderNumber && location.state?.initialPhone) {
      executeTrack(location.state.initialOrderNumber, location.state.initialPhone);
    }
  }, []);

  const handleSearchSubmit = () => {
    executeTrack(orderNumber, phone);
  };

  const handleReset = () => {
    setOrderData(null);
    setError(null);
    setOrderNumber('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-700 dark:text-amber-400 font-semibold">
            AU · 916.6 Order Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Enter your order number and registered phone number to check crafting progress and showroom pickup readiness.
          </p>
        </div>

        <TrackOrderSearchForm
          orderNumber={orderNumber}
          phone={phone}
          onOrderNumberChange={setOrderNumber}
          onPhoneChange={setPhone}
          onSubmit={handleSearchSubmit}
          loading={loading}
          onReset={handleReset}
          hasData={Boolean(orderData)}
        />

        {loading && (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-muted-foreground font-mono">
              Verifying atelier records...
            </p>
          </div>
        )}

        {error && (
          <div ref={resultsRef}>
            <TrackOrderErrorCard
              error={error}
              orderNumber={orderNumber}
              onRetry={handleSearchSubmit}
            />
          </div>
        )}

        {orderData && (
          <div ref={resultsRef} className="space-y-6 animate-in fade-in duration-200">
            <TrackOrderStatusTimeline order={orderData} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <TrackOrderItemsCard items={orderData.items} />
              </div>

              <div className="lg:col-span-5">
                <TrackOrderSummaryCard order={orderData} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AtelierVaultDrawer isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
