import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { fetchBankLedger } from '@/api/paymentAccountsApi';
import { formatPKR } from '@/utils/pricing';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function BankAccountLedgerModal({ isOpen, onClose, account }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadLedger = async () => {
    if (!account?._id) return;
    setLoading(true);
    try {
      const res = await fetchBankLedger(account._id);
      setData(res?.data || null);
    } catch (err) {
      toast.error('Failed to load bank ledger transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && account?._id) {
      loadLedger();
    } else {
      setData(null);
    }
  }, [isOpen, account?._id]);

  if (!isOpen || !account) return null;

  const summary = data?.summary || {
    receivedAmount: 0,
    pendingAmount: 0,
    rejectedAmount: 0,
    countApproved: 0,
    countPending: 0,
    countRejected: 0,
    totalTransactions: 0
  };
  const transactions = data?.transactions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-mono text-[10px] uppercase tracking-widest">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>BANK ACCOUNT LEDGER</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {account.bankName} — {account.accountTitle}
            </h3>
            <p className="text-xs font-mono text-muted-foreground">
              Account: {account.accountNumber} {account.iban ? `| IBAN: ${account.iban}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLedger}
              disabled={loading}
              className="h-8 px-2 text-xs font-mono cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-border bg-muted/20">
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-800 dark:text-emerald-300">
              Verified Revenue
            </span>
            <p className="text-lg font-serif font-semibold text-emerald-800 dark:text-emerald-300">
              {formatPKR(summary.receivedAmount)}
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">
              {summary.countApproved} approved {summary.countApproved === 1 ? 'deposit' : 'deposits'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-mono text-amber-800 dark:text-amber-300">
              Awaiting Verification
            </span>
            <p className="text-lg font-serif font-semibold text-amber-800 dark:text-amber-300">
              {formatPKR(summary.pendingAmount)}
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">
              {summary.countPending} pending approval
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
              Total Deposits
            </span>
            <p className="text-lg font-serif font-semibold text-foreground">
              {summary.totalTransactions}
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">
              Across all patron orders
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <LumaSpin variant="amber" size={28} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="font-serif text-sm font-semibold text-foreground">No ledger transactions</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Customer deposits directed to this bank account will automatically be logged here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-3 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">
                        {tx.orderNumber || 'KS-ORDER'}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                          tx.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                            : tx.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Patron: {tx.customer?.name || 'Customer'} {tx.customer?.phone ? `• ${tx.customer.phone}` : ''}
                    </p>
                    {tx.paymentReference && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        UTR / Ref: <span className="text-foreground">{tx.paymentReference}</span>
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="font-serif text-base font-semibold text-foreground">
                      {formatPKR(tx.amount)}
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono cursor-pointer">
            Close Ledger
          </Button>
        </div>
      </div>
    </div>
  );
}