import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';

export function CartOrderSuccess({ order, onClose }) {
  if (!order) return null;

  const orderNum = order.orderNumber || 'KS-PENDING';
  const customerName = order.customer?.name || 'Valued Patron';
  const phone = order.customer?.phone || '';
  const fulfillment = order.fulfillmentType || 'Delivery';
  const total = Number(order.totalAmount) || 0;

  const handleWhatsAppNotify = () => {
    const lines = [
      `Hello Khalil & Sons Jewellers,`,
      ``,
      `I have placed an order on your online atelier:`,
      `🔖 *Order Ref:* ${orderNum}`,
      `👤 *Name:* ${customerName}`,
      `📞 *Phone:* ${phone}`,
      `📦 *Fulfillment:* ${fulfillment}`,
      `💰 *Estimated Total:* ${formatPKR(total)}`,
      ``,
      `Kindly verify piece availability, gold rate-lock eligibility, and advise on payment / advance details.`
    ];
    openWhatsAppChat(lines.join('\n'));
  };

  return (
    <div className="py-8 px-2 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="size-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
        <CheckCircle2 className="size-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-mono tracking-widest uppercase text-amber-700 dark:text-amber-300 mb-2">
        <span>AU · 916.6</span>
        <span>•</span>
        <span>Registered Atelier Order</span>
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-light text-foreground mb-1">
        Order Recorded
      </h3>
      <p className="text-xs text-muted-foreground font-light max-w-xs mb-5">
        Your bespoke order has been lodged in our atelier registry. Our client concierge is verifying availability and gold rate-lock.
      </p>

      <div className="w-full rounded-xl border border-border/80 bg-background p-4 text-left space-y-3 mb-6 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Order Reference</span>
          <span className="font-mono text-xs font-semibold text-foreground tracking-wider">{orderNum}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground block">Order Status</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {order.orderStatus || 'Pending'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Payment Status</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border border-zinc-500/20">
              {order.paymentStatus || 'Unpaid'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-mono">
          <span className="text-muted-foreground">Fulfillment:</span>
          <span className="text-foreground font-medium">{fulfillment}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">Valuation Total:</span>
          <span className="font-serif font-medium text-foreground text-sm">{formatPKR(total)}</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        <button
          type="button"
          onClick={handleWhatsAppNotify}
          className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="size-4" />
          <span>Confirm on WhatsApp ({orderNum})</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 px-4 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
