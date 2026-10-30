import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PackageCheck,
  Search,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LumaSpin } from '@/components/ui/luma-spin';
import { toast } from 'sonner';
import {
  fetchOrders,
  updateOrder,
  deleteOrder
} from '@/api/orderApi';
import { OrdersMetrics } from './OrdersMetrics';
import { OrdersTable } from './OrdersTable';
import { OrderDetailModal } from './OrderDetailModal';
import { OrderDeleteModal } from './OrderDeleteModal';

const ORDER_STATUS_TABS = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Ready',
  'Delivered',
  'Cancelled'
];

const PAYMENT_STATUS_FILTERS = ['All', 'Unpaid', 'Partial', 'Paid', 'Refunded'];

export function OrdersAdminView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchOrders({ limit: 100 });
      const items = res?.data?.items || res?.data || (Array.isArray(res) ? res : []);
      setOrders(Array.isArray(items) ? items : []);
    } catch (err) {
      toast.error('Failed to load orders', {
        description: err.message || 'Please verify backend database connection.'
      });
      setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSaveOrder = async (id, updatedData) => {
    setModalLoading(true);
    try {
      await updateOrder(id, updatedData);
      toast.success('Order updated successfully', {
        description: `Order ${inspectingOrder?.orderNumber} status and payments saved.`
      });
      setInspectingOrder(null);
      await loadOrders(true);
    } catch (err) {
      toast.error('Failed to update order', {
        description: err.message || 'Unable to save order changes.'
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    setDeleteLoading(true);
    try {
      await deleteOrder(deletingOrder._id);
      toast.success('Order removed', {
        description: `Order ${deletingOrder.orderNumber} deleted from database.`
      });
      setDeletingOrder(null);
      await loadOrders(true);
    } catch (err) {
      toast.error('Failed to delete order', {
        description: err.message || 'Unable to delete order.'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.customer?.email?.toLowerCase().includes(q) ||
        order.customer?.phone?.toLowerCase().includes(q) ||
        order.items?.some((it) => it.title?.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (orderStatusFilter !== 'All' && order.orderStatus !== orderStatusFilter) {
        return false;
      }

      if (paymentStatusFilter !== 'All' && order.paymentStatus !== paymentStatusFilter) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, orderStatusFilter, paymentStatusFilter]);

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h1 className="font-serif text-2xl font-light text-foreground tracking-tight">
            Orders & Atelier Commissions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Verify orders, availability, gold rate-locks, advance payments, workshop crafting, and delivery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadOrders()}
            disabled={loading}
            className="h-9 px-3 text-xs cursor-pointer gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <OrdersMetrics orders={orders} />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ORDER_STATUS_TABS.map((tab) => {
          const isActive = orderStatusFilter === tab;
          const count =
            tab === 'All'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setOrderStatusFilter(tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isActive
                    ? 'bg-background/20 text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ref, client name, phone..."
            className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0 hidden sm:inline">
            Payment:
          </span>
          {PAYMENT_STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setPaymentStatusFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                paymentStatusFilter === filter
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background border-border/80 text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[220px] flex flex-col items-center justify-center gap-2">
          <LumaSpin size={28} />
          <p className="text-xs text-muted-foreground font-light">Loading orders inventory...</p>
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onViewOrder={(order) => setInspectingOrder(order)}
          onRequestDelete={(order) => setDeletingOrder(order)}
        />
      )}

      <OrderDetailModal
        isOpen={Boolean(inspectingOrder)}
        onClose={() => setInspectingOrder(null)}
        onSave={handleSaveOrder}
        order={inspectingOrder}
        loading={modalLoading}
      />

      <OrderDeleteModal
        isOpen={Boolean(deletingOrder)}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteConfirm}
        order={deletingOrder}
        loading={deleteLoading}
      />
    </div>
  );
}
