import React from 'react';
import { CreditCard, Receipt, CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';

export function OrderPaymentsLedgerSection({
  order,
  payments = [],
  loadingPayments,
  onInspectReceipt,
  onApprovePayment,
  onRejectPayment,
  actionLoading
}) {
  const approvedTotal = payments
    .filter((p) => p.status === 'Approved')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const rejectedPayments = payments.filter((p) => p.status === 'Rejected');
  const rejectedTotal = rejectedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const balanceDue = order?.balanceDue !== undefined ? Number(order.balanceDue) : 0;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-3.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
          <CreditCard className="size-3.5 text-amber-600 shrink-0" />
          <span>Payment Ledger & Financial Audit (Admin View)</span>
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">
          Payment Status: <strong className="text-foreground">{order?.paymentStatus || 'Unpaid'}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">Total Order</span>
          <span className="font-semibold text-foreground text-xs block mt-0.5">
            {formatPKR(order?.totalAmount || 0)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[10px] uppercase text-emerald-800 dark:text-emerald-300 block font-medium">
            Approved Paid
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs block mt-0.5">
            {formatPKR(approvedTotal || order?.advancePaid || 0)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5">
          <span className="text-[10px] uppercase text-amber-800 dark:text-amber-300 block font-medium">
            Pending Approval ({pendingPayments.length})
          </span>
          <span className="font-bold text-amber-700 dark:text-amber-400 text-xs block mt-0.5">
            {formatPKR(pendingTotal)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-[10px] uppercase text-muted-foreground block">Balance Due</span>
          <span className="font-bold text-rose-700 dark:text-rose-400 text-xs block mt-0.5">
            {formatPKR(balanceDue)}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <span className="font-mono uppercase tracking-wider text-[11px] text-muted-foreground block">
          Submitted Bank Transactions ({payments.length})
        </span>

        {loadingPayments ? (
          <div className="py-6 text-center text-xs text-muted-foreground font-mono">
            Loading verified payment ledger...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-4 text-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
            No bank payment transactions submitted yet.
          </div>
        ) : (
          <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-background overflow-hidden">
            {payments.map((p) => {
              const bankSnapshot = p.bankAccountSnapshot || {};
              const isPending = p.status === 'Pending';
              const isApproved = p.status === 'Approved';
              const isRejected = p.status === 'Rejected';

              return (
                <div
                  key={p._id}
                  className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-foreground text-sm">
                        {formatPKR(p.amount)}
                      </span>
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] uppercase border border-border bg-muted/30 text-muted-foreground">
                        {p.paymentType || 'Advance'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full font-mono text-[10px] font-semibold border ${
                          isApproved
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : isRejected
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {isApproved && <CheckCircle className="size-2.5" />}
                        {isRejected && <XCircle className="size-2.5" />}
                        {isPending && <Clock className="size-2.5" />}
                        <span>{p.status}</span>
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-muted-foreground space-y-0.5">
                      <p>
                        Target Bank: <strong className="text-foreground">{bankSnapshot.bankName || 'Atelier Account'}</strong>
                        {bankSnapshot.accountTitle ? ` (${bankSnapshot.accountTitle})` : ''}
                      </p>
                      <p>
                        TID / Ref: <span className="text-foreground">{p.paymentReference || 'N/A'}</span>
                        <span className="mx-1.5">•</span>
                        <span>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onInspectReceipt(p)}
                      className="h-7 px-2.5 text-[11px] gap-1 cursor-pointer"
                    >
                      <Receipt className="size-3 text-amber-600" />
                      <span>Receipt</span>
                    </Button>

                    {isPending && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={actionLoading}
                          onClick={() => onApprovePayment(p)}
                          className="h-7 px-2.5 text-[11px] text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={actionLoading}
                          onClick={() => onRejectPayment(p)}
                          className="h-7 px-2.5 text-[11px] text-rose-700 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
