import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';
import { toast } from 'sonner';
import {
  fetchOrderById,
  fetchOrderPayments,
  approveOrderPayment,
  rejectOrderPayment,
  recordOrderCollection
} from '@/api/orderApi';
import { OrderModalHeader } from './orders/OrderModalHeader';
import { OrderClientDetails } from './orders/OrderClientDetails';
import { OrderItemsList } from './orders/OrderItemsList';
import { OrderRateLockSection } from './orders/OrderRateLockSection';
import { OrderPaymentsLedgerSection } from './orders/OrderPaymentsLedgerSection';
import { OrderWorkflowSection } from './orders/OrderWorkflowSection';
import { PaymentReceiptModal } from './orders/PaymentReceiptModal';
import { PaymentActionModal } from './orders/PaymentActionModal';
import { OrderCollectionConfirmModal } from './orders/OrderCollectionConfirmModal';

export function OrderDetailModal({
  isOpen,
  onClose,
  onSave,
  order,
  loading,
  onRefreshParent
}) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [formData, setFormData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    payment: null
  });

  const [collectionConfirmOpen, setCollectionConfirmOpen] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    payment: null,
    actionType: 'approve'
  });

  const syncOrderData = useCallback((ord) => {
    if (!ord) return;
    setCurrentOrder(ord);
    setFormData({
      orderStatus: ord.orderStatus || 'Pending',
      paymentStatus: ord.paymentStatus || 'Unpaid',
      isAvailabilityVerified: Boolean(ord.isAvailabilityVerified),
      totalAmount: Number(ord.totalAmount) || 0,
      advancePaid: Number(ord.advancePaid) || 0,
      balanceDue:
        ord.balanceDue !== undefined
          ? Number(ord.balanceDue)
          : Math.max(0, (Number(ord.totalAmount) || 0) - (Number(ord.advancePaid) || 0)),
      goldRateLock: {
        isLocked: Boolean(ord.goldRateLock?.isLocked),
        lockedRate: Number(ord.goldRateLock?.lockedRate) || 0,
        karat: ord.goldRateLock?.karat || '22K',
        snapshotRate: Number(ord.goldRateLock?.snapshotRate) || 0,
        pureGoldValue: Number(ord.goldRateLock?.pureGoldValue) || 0,
        minAdvanceRequired: Number(ord.goldRateLock?.minAdvanceRequired) || 0
      },
      internalNotes: ord.internalNotes || '',
      customerNote: ord.customerNote || ''
    });
  }, []);

  const loadLedger = useCallback(async (orderId) => {
    if (!orderId) return;
    setLoadingPayments(true);
    try {
      const res = await fetchOrderPayments(orderId);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setPayments(Array.isArray(list) ? list : []);
    } catch {
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  const refreshOrderFromBackend = useCallback(async (orderId) => {
    if (!orderId) return;
    try {
      const res = await fetchOrderById(orderId);
      const fresh = res?.data || res;
      if (fresh && fresh._id) {
        syncOrderData(fresh);
      }
    } catch {}
  }, [syncOrderData]);

  useEffect(() => {
    if (order && isOpen) {
      syncOrderData(order);
      loadLedger(order._id);
    }
  }, [order, isOpen, syncOrderData, loadLedger]);

  if (!isOpen || !currentOrder || !formData) return null;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(currentOrder.orderNumber);
    setCopied(true);
    toast.success('Order number copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspectReceipt = (payment) => {
    setReceiptModal({
      isOpen: true,
      payment
    });
  };

  const handleOpenApprove = (payment) => {
    setActionModal({
      isOpen: true,
      payment,
      actionType: 'approve'
    });
  };

  const handleOpenReject = (payment) => {
    setActionModal({
      isOpen: true,
      payment,
      actionType: 'reject'
    });
  };

  const handleConfirmPaymentAction = async (paymentId, reason) => {
    setPaymentActionLoading(true);
    try {
      if (actionModal.actionType === 'approve') {
        await approveOrderPayment(currentOrder._id, paymentId);
        toast.success('Payment approved successfully', {
          description: `Transaction verified and added to advance ledger.`
        });
      } else {
        await rejectOrderPayment(currentOrder._id, paymentId, reason);
        toast.success('Payment rejected', {
          description: `Rejection notice recorded in ledger.`
        });
      }

      setActionModal({ isOpen: false, payment: null, actionType: 'approve' });
      await loadLedger(currentOrder._id);
      await refreshOrderFromBackend(currentOrder._id);
      if (onRefreshParent) {
        onRefreshParent();
      }
    } catch (err) {
      toast.error('Action failed', {
        description: err.message || 'Unable to update payment status.'
      });
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    if (newStatus === 'Delivered') {
      setCollectionConfirmOpen(true);
      return;
    }
    setFormData((prev) => ({ ...prev, orderStatus: newStatus }));
    try {
      await onSave(currentOrder._id, {
        ...formData,
        orderStatus: newStatus
      });
      await refreshOrderFromBackend(currentOrder._id);
      if (onRefreshParent) {
        onRefreshParent();
      }
    } catch (err) {
      toast.error('Status update failed', {
        description: err.message || 'Unable to update order status.'
      });
    }
  };

  const handleConfirmCollection = async () => {
    if (collectionLoading) return;
    setCollectionLoading(true);
    try {
      await recordOrderCollection(currentOrder._id);
      toast.success('Order marked as collected by patron', {
        description: 'Status updated to Delivered (Terminal).'
      });
      setCollectionConfirmOpen(false);
      await loadLedger(currentOrder._id);
      await refreshOrderFromBackend(currentOrder._id);
      if (onRefreshParent) {
        onRefreshParent();
      }
    } catch (err) {
      toast.error('Collection recording failed', {
        description: err.message || 'Unable to record showroom collection.'
      });
    } finally {
      setCollectionLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(currentOrder._id, formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <button
          type="button"
          aria-label="Close backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-default w-full h-full border-0 p-0 focus:outline-none"
          tabIndex={-1}
        />

        <div className="relative w-full max-w-3xl h-full sm:h-auto max-h-[96vh] sm:max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <OrderModalHeader
            order={currentOrder}
            copied={copied}
            onCopy={handleCopyOrderNumber}
            onClose={onClose}
            loading={loading}
          />

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-5">
              <OrderClientDetails order={currentOrder} />
              <OrderItemsList items={currentOrder.items || []} />
              <OrderRateLockSection order={currentOrder} />
              <OrderPaymentsLedgerSection
                order={currentOrder}
                payments={payments}
                loadingPayments={loadingPayments}
                onInspectReceipt={handleInspectReceipt}
                onApprovePayment={handleOpenApprove}
                onRejectPayment={handleOpenReject}
                actionLoading={paymentActionLoading}
              />
              <OrderWorkflowSection
                formData={formData}
                onChange={setFormData}
                onQuickStatusChange={handleQuickStatusChange}
                loading={loading}
              />
            </div>

            <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-border/80 bg-muted/20 backdrop-blur-sm flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs font-mono">
                <span className="text-muted-foreground whitespace-nowrap">
                  Total: <strong className="text-foreground">{formatPKR(formData.totalAmount)}</strong>
                </span>
                <span className="text-border hidden sm:inline">|</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  Approved: <strong className="text-emerald-700 dark:text-emerald-400">{formatPKR(formData.advancePaid)}</strong>
                </span>
                <span className="text-border hidden sm:inline">|</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  Due: <strong className={formData.balanceDue > 0 ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}>{formatPKR(formData.balanceDue)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 sm:flex-none h-9 px-4 text-xs cursor-pointer border-border/80"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none h-9 px-5 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer shadow-xs font-medium"
                >
                  {loading ? 'Saving Updates...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <PaymentReceiptModal
        isOpen={receiptModal.isOpen}
        onClose={() => setReceiptModal({ isOpen: false, payment: null })}
        payment={receiptModal.payment}
        order={currentOrder}
      />

      <PaymentActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, payment: null, actionType: 'approve' })}
        onConfirm={handleConfirmPaymentAction}
        payment={actionModal.payment}
        actionType={actionModal.actionType}
        loading={paymentActionLoading}
      />

      <OrderCollectionConfirmModal
        isOpen={collectionConfirmOpen}
        onClose={() => setCollectionConfirmOpen(false)}
        onConfirm={handleConfirmCollection}
        order={currentOrder}
        loading={collectionLoading}
      />
    </>
  );
}
