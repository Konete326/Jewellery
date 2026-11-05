import React from 'react';
import {
  Eye,
  Trash2,
  Lock,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';

export function OrderMobileCard({
  order,
  onViewOrder,
  onRequestDelete,
  actionLoadingId,
  getOrderStatusBadge,
  getPaymentStatusBadge
}) {
  const totalPieces = order.items?.reduce(
    (sum, it) => sum + (Number(it.quantity) || 1),
    0
  ) || 0;
  const isLocked = Boolean(order.goldRateLock?.isLocked);

  const itemsSummary = order.items?.map((it) => {
    const s = it.size || it.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1];
    const cleanTitle = (it.title || 'Masterpiece').replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();
    return s ? `${cleanTitle} (${s})` : cleanTitle;
  }).join(', ');

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3 hover:border-foreground/20 transition-colors">
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground text-sm">
              {order.orderNumber}
            </span>
            {isLocked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-amber-600/30 bg-amber-500/10 text-[9px] font-mono text-amber-700 dark:text-amber-400">
                <Lock className="size-2.5" />
                <span>Rate Locked</span>
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold border ${getOrderStatusBadge(
              order.orderStatus
            )}`}
          >
            {order.orderStatus === 'Ready'
              ? 'Ready for Pickup'
              : order.orderStatus === 'Delivered'
              ? 'Collected'
              : order.orderStatus || 'Pending'}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold border ${getPaymentStatusBadge(
              order.paymentStatus
            )}`}
          >
            {order.paymentStatus || 'Unpaid'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
            Client
          </span>
          <span className="font-medium text-foreground text-xs block truncate">
            {order.customer?.name || 'Valued Patron'}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono block">
            {order.customer?.phone || '—'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
            Fulfillment
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-border/80 bg-muted/30 text-foreground mt-0.5">
            <Store className="size-2.5 text-amber-600" />
            <span>Showroom Pickup</span>
          </span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            {order.customer?.city || 'Karachi'}
          </span>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-2.5 border border-border/50 text-xs">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-mono text-muted-foreground">
            Pieces: <strong className="text-foreground">{totalPieces}</strong>
          </span>
          <span className="font-mono font-semibold text-foreground">
            {formatPKR(order.totalAmount)}
          </span>
        </div>
        {itemsSummary && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 truncate">
            {itemsSummary}
          </p>
        )}
        <div className="flex items-center justify-between text-[11px] border-t border-border/50 pt-1.5 mt-1.5">
          <span className="text-muted-foreground font-mono">
            Advance: {formatPKR(order.advancePaid || 0)}
          </span>
          {Number(order.balanceDue) > 0 ? (
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
              Due: {formatPKR(order.balanceDue)}
            </span>
          ) : (
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              Settled
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => onViewOrder(order)}
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer flex-1 justify-center bg-foreground text-background hover:bg-foreground/90"
        >
          <Eye className="size-3.5" />
          <span>Manage Order</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={actionLoadingId === order._id}
          onClick={() => onRequestDelete(order)}
          title="Remove order"
          className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

