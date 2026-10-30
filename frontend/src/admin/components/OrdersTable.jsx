import React from 'react';
import {
  PackageCheck,
  Eye,
  Trash2,
  Lock,
  MessageCircle,
  Truck,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';

function getOrderStatusBadge(status) {
  switch (status) {
    case 'Pending':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'Confirmed':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'Processing':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'Ready':
      return 'border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300';
    case 'Delivered':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'Cancelled':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400';
    default:
      return 'border-border/80 bg-muted/40 text-muted-foreground';
  }
}

function getPaymentStatusBadge(status) {
  switch (status) {
    case 'Paid':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'Partial':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'Unpaid':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400';
    case 'Refunded':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300';
    default:
      return 'border-border/80 bg-muted/40 text-muted-foreground';
  }
}

export function OrdersTable({
  orders = [],
  onViewOrder,
  onRequestDelete,
  actionLoadingId
}) {
  if (orders.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-8">
        <PackageCheck className="size-8 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="font-serif text-base font-semibold text-foreground mb-1">
          No Orders Found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light">
          No orders match your current filter. When clientele submit jewellery bookings, they will appear here.
        </p>
      </div>
    );
  }

  const handleQuickWhatsApp = (order) => {
    const custName = order.customer?.name || 'Valued Patron';
    const num = order.orderNumber;
    const msg = `Dear *${custName}*,\n\nGreetings from *Khalil & Sons Jewellers*, Saddar, Karachi.\n\nWe have received your Order *${num}* and our atelier master goldsmiths are verifying details and gold rate-lock eligibility. We will update you shortly.`;
    const cleanPhone = (order.customer?.phone || '').replace(/[^\d+]/g, '');
    openWhatsAppChat(msg, cleanPhone);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/80 bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Fulfillment</th>
              <th className="py-3 px-4">Pieces</th>
              <th className="py-3 px-4">Total & Balance</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((order) => {
              const totalPieces = order.items?.reduce(
                (sum, it) => sum + (Number(it.quantity) || 1),
                0
              ) || 0;
              const isLocked = Boolean(order.goldRateLock?.isLocked);

              return (
                <tr
                  key={order._id || order.orderNumber}
                  className="hover:bg-muted/15 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-semibold text-foreground text-xs sm:text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                          <Lock className="size-2.5" />
                          <span>Rate Locked</span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col min-w-[140px]">
                      <span className="font-medium text-foreground text-xs">
                        {order.customer?.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {order.customer?.phone}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {order.customer?.email}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {order.fulfillmentType === 'Showroom Pickup' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-border/80 bg-muted/30 text-foreground">
                        <Store className="size-2.5" />
                        <span>Pickup</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-border/80 bg-muted/30 text-foreground">
                        <Truck className="size-2.5" />
                        <span>Delivery</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-foreground">
                        {totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {order.items?.map((it) => it.title).join(', ')}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col font-mono">
                      <span className="font-semibold text-foreground text-xs sm:text-sm">
                        {formatPKR(order.totalAmount)}
                      </span>
                      {Number(order.balanceDue) > 0 ? (
                        <span className="text-[10px] text-rose-600 dark:text-rose-400">
                          Due: {formatPKR(order.balanceDue)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Settled
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${getOrderStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${getPaymentStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || 'Unpaid'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuickWhatsApp(order)}
                        title="Quick WhatsApp message"
                        className="size-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 cursor-pointer"
                      >
                        <MessageCircle className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onViewOrder(order)}
                        className="h-7 px-2.5 text-[11px] gap-1 cursor-pointer"
                      >
                        <Eye className="size-3" />
                        <span>Manage</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={actionLoadingId === order._id}
                        onClick={() => onRequestDelete(order)}
                        title="Remove order"
                        className="size-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
