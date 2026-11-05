import React, { useState } from 'react';
import { X, Check, Copy, Receipt, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';
import { toast } from 'sonner';

export function PaymentReceiptModal({ isOpen, onClose, payment, order }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !payment) return null;

  const bankSnapshot = payment.bankAccountSnapshot || {};
  const status = payment.status || 'Pending';
  const receiptNum = payment.receiptNumber || `KS-RCP-${payment._id?.toString().slice(-8).toUpperCase()}`;

  const handleCopyReceipt = () => {
    const text = [
      `KHALIL & SONS JEWELLERS - PAYMENT RECEIPT`,
      `Receipt No: ${receiptNum}`,
      `Order No: ${order?.orderNumber || payment.orderNumber}`,
      `Customer: ${payment.customer?.name || order?.customer?.name}`,
      `Amount: ${formatPKR(payment.amount)}`,
      `Payment Type: ${payment.paymentType || 'Advance'}`,
      `Status: ${status}`,
      `Bank: ${bankSnapshot.bankName || 'N/A'} (${bankSnapshot.accountTitle || ''})`,
      `Reference: ${payment.paymentReference || 'N/A'}`,
      `Date: ${new Date(payment.createdAt).toLocaleString('en-US')}`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Receipt details copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-default w-full h-full border-0 p-0 focus:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-border/80 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="size-4 text-amber-600" />
            <div>
              <h3 className="font-serif text-base font-medium text-foreground">
                Payment Deposit Receipt
              </h3>
              <p className="text-[10px] font-mono text-muted-foreground">
                Official Atelier Verification Record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="p-3.5 rounded-xl border border-border/80 bg-background flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Official Receipt Number
              </span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {receiptNum}
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Verification Status
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono text-xs font-medium ${
                  status === 'Approved'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : status === 'Rejected'
                    ? 'text-rose-700 dark:text-rose-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {status === 'Approved' && <CheckCircle2 className="size-3" />}
                {status === 'Rejected' && <XCircle className="size-3" />}
                {status === 'Pending' && <Clock className="size-3" />}
                <span>{status}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/15 font-mono">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">Order Number</span>
              <span className="font-semibold text-foreground text-xs">
                {order?.orderNumber || payment.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">Deposit Date</span>
              <span className="text-foreground text-xs">
                {new Date(payment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">Client Name</span>
              <span className="text-foreground text-xs font-sans">
                {payment.customer?.name || order?.customer?.name || 'Valued Patron'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">Contact Phone</span>
              <span className="text-foreground text-xs">
                {payment.customer?.phone || order?.customer?.phone || 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/80 bg-background space-y-2">
            <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block">
              Receiving Bank Account Details
            </span>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-medium text-foreground">{bankSnapshot.bankName || 'Atelier Bank'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Title:</span>
                <span className="text-foreground">{bankSnapshot.accountTitle || 'Khalil & Sons'}</span>
              </div>
              {bankSnapshot.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account No:</span>
                  <span className="text-foreground">{bankSnapshot.accountNumber}</span>
                </div>
              )}
              {bankSnapshot.iban && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IBAN:</span>
                  <span className="text-foreground">{bankSnapshot.iban}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-border/50">
                <span className="text-muted-foreground">Deposit Ref / TID:</span>
                <span className="font-semibold text-foreground">
                  {payment.paymentReference || 'Direct Transfer'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-600/30 bg-amber-500/5 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] uppercase text-amber-700 dark:text-amber-400 block font-medium">
                Payment Amount ({payment.paymentType || 'Advance'})
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatPKR(payment.amount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">Remaining Order Balance</span>
              <span className="text-xs font-semibold text-foreground">
                {formatPKR(order?.balanceDue || 0)}
              </span>
            </div>
          </div>

          {status === 'Approved' && (
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] space-y-0.5">
              <p>Approved By: {payment.approvedBy || 'Administrator'}</p>
              {payment.approvedAt && (
                <p>Approved At: {new Date(payment.approvedAt).toLocaleString('en-US')}</p>
              )}
            </div>
          )}

          {status === 'Rejected' && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-300 text-[11px] space-y-0.5">
              <p className="font-semibold font-mono">Rejection Notice</p>
              <p className="leading-relaxed">
                Reason: {payment.rejectionReason || 'Payment unverified or rejected by administrator.'}
              </p>
              {payment.rejectedAt && (
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  Rejected At: {new Date(payment.rejectedAt).toLocaleString('en-US')}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-border/80 bg-muted/20 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyReceipt}
            className="h-8 px-3 text-xs gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-amber-600" /> : <Copy className="size-3.5" />}
            <span>Copy Receipt Summary</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 text-xs cursor-pointer bg-foreground text-background"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
