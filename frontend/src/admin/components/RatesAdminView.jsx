import React, { useState, useEffect, useCallback } from 'react';
import { ratesApi } from '@/api/ratesApi';
import { RatesAdminOverview } from './RatesAdminOverview';
import { RatesAdminOverrideForm } from './RatesAdminOverrideForm';
import { RatesAdminHistoryTable } from './RatesAdminHistoryTable';
import { toast } from 'sonner';

export function RatesAdminView() {
  const [rates, setRates] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
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
    } catch (err) {
      toast.error('Failed to load bullion rates data.');
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
      const res = await ratesApi.syncRates('Artisan Admin');
      if (res?.success && res.data) {
        setRates(res.data);
        toast.success(res.message || 'Synchronized with Karachi Sarafa Market.');
        const histRes = await ratesApi.getHistory(30);
        if (histRes?.data) setHistory(histRes.data);
      }
    } catch (err) {
      toast.error('Could not sync with Sarafa market source.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveOverride = async (payload) => {
    setIsSaving(true);
    try {
      const res = await ratesApi.updateOverride({
        ...payload,
        updatedBy: 'Artisan Admin'
      });
      if (res?.success && res.data) {
        setRates(res.data);
        toast.success(res.message || 'Rates updated and auto-calculated.');
        const histRes = await ratesApi.getHistory(30);
        if (histRes?.data) setHistory(histRes.data);
      }
    } catch (err) {
      toast.error('Failed to update benchmark rates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await ratesApi.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success('Rate log removed.');
    } catch (err) {
      toast.error('Failed to delete log entry.');
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
    <div className="space-y-8">
      <RatesAdminOverview
        rates={rates}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      <RatesAdminOverrideForm
        rates={rates}
        onSave={handleSaveOverride}
        onReset={handleSync}
        isSaving={isSaving}
      />

      <RatesAdminHistoryTable
        history={history}
        onDeleteLog={handleDeleteLog}
        onReapplyRate={handleReapply}
      />
    </div>
  );
}
