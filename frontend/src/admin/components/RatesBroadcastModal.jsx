import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Users, Sparkles, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ratesApi } from '@/api/ratesApi';
import { toast } from 'sonner';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesBroadcastModal({ isOpen, onClose, rates, onBroadcastSuccess }) {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await ratesApi.getBroadcastStats();
        if (res?.success && res.data) {
          setStats(res.data);
        }
      } catch {
        toast.error('Unable to fetch registered client counts.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [isOpen]);

  if (!isOpen) return null;

  const gold = rates?.gold || {};
  const silver = rates?.silver || {};

  const handleSend = async () => {
    setIsBroadcasting(true);
    try {
      const res = await ratesApi.sendBroadcast({ recipientFilter });
      if (res?.success) {
        toast.success(res.message || 'Bullion rates broadcast sent successfully.');
        if (onBroadcastSuccess) onBroadcastSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to dispatch email broadcast.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const recipientCount = recipientFilter === 'due'
    ? (stats?.dueUsers ?? 0)
    : (stats?.totalUsers ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isBroadcasting}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md p-1"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Mail className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">
              Broadcast Bullion Rates via Email
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Notify registered atelier collectors with today's certified valuations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              Registered Clients
            </span>
            <span className="text-xl font-serif font-light text-foreground">
              {loadingStats ? '...' : (stats?.totalUsers || 0)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
              Active in Vault
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              Monthly Due
            </span>
            <span className="text-xl font-serif font-light text-foreground">
              {loadingStats ? '...' : (stats?.dueUsers || 0)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
              &gt; 30 days since last email
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
            Target Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setRecipientFilter('all')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                recipientFilter === 'all'
                  ? 'border-amber-500/50 bg-amber-500/10 text-foreground'
                  : 'border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              <span className="font-medium block text-foreground">All Registered Clients</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Deliver to {stats?.totalUsers || 0} clients
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRecipientFilter('due')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                recipientFilter === 'due'
                  ? 'border-amber-500/50 bg-amber-500/10 text-foreground'
                  : 'border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              <span className="font-medium block text-foreground">Monthly Digest Due</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Deliver to {stats?.dueUsers || 0} due clients
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/80 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px] pb-1 border-b border-border/40">
            <span>Email Subject:</span>
            <span className="text-foreground font-medium truncate max-w-[280px]">
              Today's Gold & Bullion Market Valuation
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
            <span>Included Benchmark:</span>
            <span className="text-foreground font-medium">
              24K: {formatPkr(gold['24K']?.tola)} | 22K: {formatPkr(gold['22K']?.tola)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
            <span>Interactive CTA:</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium inline-flex items-center gap-1">
              Direct Link to /rates <ExternalLink className="size-3" />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isBroadcasting}
            className="text-xs font-mono h-9 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSend}
            disabled={isBroadcasting || recipientCount === 0}
            className="bg-foreground text-background hover:opacity-90 text-xs font-mono h-9 px-4 cursor-pointer"
          >
            <Send className={`size-3.5 mr-1.5 ${isBroadcasting ? 'animate-spin' : ''}`} />
            {isBroadcasting
              ? 'Dispatching Emails...'
              : `Send to ${recipientCount} ${recipientCount === 1 ? 'Client' : 'Clients'}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
