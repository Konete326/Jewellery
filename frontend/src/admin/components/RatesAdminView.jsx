import React, { useState, useEffect, useCallback } from 'react';
import { ratesApi } from '@/api/ratesApi';
import { RatesAdminHeader } from './RatesAdminHeader';
import { RatesAdminHeroCard } from './RatesAdminHeroCard';
import { RatesAdminHistoryList } from './RatesAdminHistoryList';
import { toast } from 'sonner';

export function RatesAdminView() {
  const [rates, setRates] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [rateRes, histRes] = await Promise.all([
        ratesApi.getRates(),
        ratesApi.getHistory(30)
      ]);
      if (rateRes?.success && rateRes.data) {
        setRates(rateRes.data);
      }
      if (histRes?.success && Array.isArray(histRes.data)) {
        setHistory(histRes.data);
      }
    } catch {
      toast.error('Failed to load rates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await ratesApi.syncRates('Admin');
      if (res?.success && res.data) {
        setRates(res.data);
        toast.success(res.message || 'Synchronized with Sarafa Market');
        const histRes = await ratesApi.getHistory(30);
        if (histRes?.data) setHistory(histRes.data);
      }
    } catch {
      toast.error('Could not sync with Sarafa market');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestoreMarket = async () => {
    setIsRestoring(true);
    try {
      const res = await ratesApi.syncRates('Admin (Revert)');
      if (res?.success && res.data) {
        setRates(res.data);
        toast.success('Restored to live market rate');
        const histRes = await ratesApi.getHistory(30);
        if (histRes?.data) setHistory(histRes.data);
      }
    } catch {
      toast.error('Could not restore live rate');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSaveOverride = async (payload) => {
    setIsSaving(true);
    try {
      const res = await ratesApi.updateOverride({
        ...payload,
        updatedBy: 'Admin'
      });
      if (res?.success && res.data) {
        setRates(res.data);
        toast.success('Rates updated');
        const histRes = await ratesApi.getHistory(30);
        if (histRes?.data) setHistory(histRes.data);
      }
    } catch {
      toast.error('Failed to update rates');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await ratesApi.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success('Record removed');
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const handleReapply = async (logItem) => {
    if (!logItem?.gold24kTola) return;
    await handleSaveOverride({
      gold24kTola: logItem.gold24kTola,
      silver24kTola: logItem.silver24kTola || 6794,
      isManualOverride: true
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <RatesAdminHeader
        rates={rates}
        onSync={handleSync}
        isSyncing={isSyncing}
        onRestoreMarket={handleRestoreMarket}
        isRestoring={isRestoring}
      />

      <RatesAdminHeroCard
        rates={rates}
        onSaveOverride={handleSaveOverride}
        isSaving={isSaving}
      />

      <RatesAdminHistoryList
        history={history}
        onDeleteLog={handleDeleteLog}
        onReapplyRate={handleReapply}
      />
    </div>
  );
}
