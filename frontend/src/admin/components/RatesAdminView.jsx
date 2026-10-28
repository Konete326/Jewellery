import React, { useState, useEffect, useCallback } from 'react';
import { ratesApi } from '@/api/ratesApi';
import { RatesAdminHeader } from './RatesAdminHeader';
import { RatesAdminHeroCard } from './RatesAdminHeroCard';
import { RatesAdminHistoryList } from './RatesAdminHistoryList';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { toast } from 'sonner';

export function RatesAdminView() {
  const [rates, setRates] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [isDeletingLog, setIsDeletingLog] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!logToDelete) return;
    setIsDeletingLog(true);
    try {
      const id = logToDelete._id || logToDelete.id;
      await ratesApi.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success('Record removed');
      setLogToDelete(null);
    } catch {
      toast.error('Failed to delete record');
    } finally {
      setIsDeletingLog(false);
    }
  };

  const handleReapply = async (logItem, tab = 'gold') => {
    if (!logItem) return;
    const currentGold = rates?.gold?.['24K']?.tola || 422000;
    const currentSilver = rates?.silver?.['24K']?.tola || 6794;
    await handleSaveOverride({
      gold24kTola: tab === 'gold' ? logItem.gold24kTola : currentGold,
      silver24kTola: tab === 'silver' ? logItem.silver24kTola : currentSilver,
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
        onRequestDelete={(item) => setLogToDelete(item)}
        onReapplyRate={handleReapply}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(logToDelete)}
        onClose={() => setLogToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={
          logToDelete
            ? `rate entry (PKR ${(logToDelete.gold24kTola || logToDelete.silver24kTola)?.toLocaleString()})`
            : 'rate record'
        }
        itemType="rate record"
        loading={isDeletingLog}
      />
    </div>
  );
}