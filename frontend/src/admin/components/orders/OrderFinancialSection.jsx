import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'Partial', 'Paid', 'Refunded'];

export function OrderFinancialSection({ formData, onChange }) {
  const paymentDetails = formData.paymentDetails || {};

  const handleAdvanceChange = (val) => {
    const advance = Math.max(0, Number(val) || 0);
    const total = Number(formData.totalAmount) || 0;
    const balance = Math.max(0, total - advance);

    onChange((prev) => ({
      ...prev,
      advancePaid: advance,
      balanceDue: balance,
      paymentStatus:
        advance === 0
          ? 'Unpaid'
          : advance >= total
          ? 'Paid'
          : 'Partial'
    }));
  };

  const handleStatusChange = (val) => {
    onChange((prev) => ({
      ...prev,
      paymentStatus: val
    }));
  };

  const handleMethodChange = (val) => {
    onChange((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        method: val
      }
    }));
  };

  const handleRefChange = (val) => {
    onChange((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        transactionRef: val
      }
    }));
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
          <CreditCard className="size-3.5 text-amber-600 shrink-0" />
          <span>Payment Ledger & Settlement</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Payment Status
          </label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          >
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Advance Paid (PKR)
          </label>
          <input
            type="number"
            value={formData.advancePaid}
            onChange={(e) => handleAdvanceChange(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Balance Due (PKR)
          </label>
          <div className="w-full bg-muted/40 border border-input rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-foreground select-none truncate">
            {formatPKR(formData.balanceDue)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-border/60">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Payment Channel
          </label>
          <input
            type="text"
            value={paymentDetails.method || ''}
            onChange={(e) => handleMethodChange(e.target.value)}
            placeholder="e.g. Meezan Bank / Raast / Cash"
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Deposit Reference / Transaction ID
          </label>
          <input
            type="text"
            value={paymentDetails.transactionRef || ''}
            onChange={(e) => handleRefChange(e.target.value)}
            placeholder="e.g. TID-9821820"
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
