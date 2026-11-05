import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';

export function PaymentActionModal({
  isOpen,
  onClose,
  onConfirm,
  payment,
  actionType,
  loading
}) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen || !payment) return null;

  const isApprove = actionType === 'approve';
  const bankName = payment.bankAccountSnapshot?.bankName || 'Atelier Bank';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isApprove) {
      onConfirm(payment._id);
    } else {
      const cleanReason = reason.trim();
      onConfirm(payment._id, cleanReason || 'Payment unverified or rejected by administrator');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        disabled={loading}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-default w-full h-full border-0 p-0 focus:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-border/80 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="size-4 text-rose-600" />
            )}
            <h3 className="font-serif text-base font-medium text-foreground">
              {isApprove ? 'Approve Payment Transaction' : 'Reject Payment Transaction'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-border/80 bg-background font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-semibold text-foreground">{payment.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patron:</span>
              <span className="text-foreground">{payment.customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Amount:</span>
              <span className="font-bold text-foreground">{formatPKR(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Bank:</span>
              <span className="text-foreground">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction TID:</span>
              <span className="text-foreground">{payment.paymentReference || 'N/A'}</span>
            </div>
          </div>

          {isApprove ? (
            <p className="text-muted-foreground leading-relaxed">
              Approving this payment will credit <strong>{formatPKR(payment.amount)}</strong> towards the order's advance ledger, trigger an official customer receipt email, and update gold rate-lock eligibility if the required 90% pure gold advance threshold is met.
            </p>
          ) : (
            <div className="space-y-2">
              <label className="font-mono uppercase text-[10px] text-muted-foreground block">
                Reason for Rejection (Optional)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
                placeholder="Leave blank for standard notice: 'Payment unverified or rejected by administrator'"
                className="w-full bg-background border border-input rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-rose-500/40 focus:border-rose-500/60 outline-none resize-none disabled:opacity-60"
              />
              <p className="text-[11px] text-muted-foreground">
                This notice will be recorded in the order ledger and sent to the client.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="h-8 px-3 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`h-8 px-4 text-xs font-medium cursor-pointer ${
                isApprove
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-rose-700 hover:bg-rose-800 text-white'
              }`}
            >
              {loading && <Loader2 className="size-3 animate-spin mr-1.5" />}
              {loading ? (isApprove ? 'Approving...' : 'Rejecting...') : (isApprove ? 'Confirm Approval' : 'Confirm Rejection')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
