import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ArrowRight, Building2, Store, Truck, Clock, ShieldCheck, Copy, Check } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { getVerifiedStoreProfile } from '@/utils/storeConfig';
import { toast } from 'sonner';

export function CartOrderSuccess({
  order,
  paymentAccounts = [],
  selectedAccount = null,
  storeProfile: propStoreProfile = null,
  onClose
}) {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);

  if (!order) return null;

  const storeProfile = propStoreProfile || getVerifiedStoreProfile();

  const orderNum = order.orderNumber || 'KS-PENDING';
  const customerName = order.customer?.name || 'Valued Patron';
  const phone = order.customer?.phone || '';
  const total = Number(order.totalAmount) || 0;
  const transactionRef = order.paymentDetails?.transactionRef || '';
  const bankName = order.paymentDetails?.bankName || selectedAccount?.bankName || 'Bank Transfer';
  const paymentStatus = order.paymentStatus || 'Unpaid';
  const orderStatus = order.orderStatus || 'Pending';
  const isDelivery = String(order.fulfillmentType || '').toLowerCase() === 'delivery';

  const goldRateLock = order.goldRateLock || {};
  const minAdvanceRequired = Number(goldRateLock.minAdvanceRequired) || 0;
  const pureGoldValue = Number(goldRateLock.pureGoldValue) || 0;
  const isRateLocked = Boolean(goldRateLock.isLocked);
  const lockedRate = Number(goldRateLock.lockedRate) || 0;
  const approvedAdvance = Number(order.advancePaid) || 0;

  const isPendingApproval = Boolean(transactionRef) && paymentStatus === 'Unpaid';

  const defaultAccount = selectedAccount || paymentAccounts.find((a) => a.isDefault) || paymentAccounts[0];

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleWhatsAppNotify = () => {
    const itemsLines = (order.items || []).map((it) => {
      const itemSize = it.size || it.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1];
      const sizeStr = itemSize ? ` [Size: ${itemSize}]` : '';
      const cleanTitle = (it.title || 'Masterpiece').replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();
      return `   • ${cleanTitle}${sizeStr} (Qty: ${it.quantity})`;
    });

    const fulfillmentText = isDelivery
      ? `Delivery (${order.customer?.shippingAddress || 'Karachi'})`
      : `Showroom Pickup (${storeProfile.hub || 'Saddar, Karachi'})`;

    const totalText = total > 0 ? formatPKR(total) : 'Pending Valuation';

    const lines = [
      `Hello Khalil & Sons Jewellers,`,
      ``,
      `I have placed an order:`,
      `🔖 *Order Ref:* ${orderNum}`,
      `👤 *Name:* ${customerName}`,
      `📞 *Phone:* ${phone}`,
      `🏢 *Fulfillment:* ${fulfillmentText}`,
      itemsLines.length > 0 ? `💎 *Pieces:*\n${itemsLines.join('\n')}` : '',
      `💰 *Total:* ${totalText}`,
      minAdvanceRequired > 0 ? `⚖️ *Advance Required:* ${formatPKR(minAdvanceRequired)}` : '',
      transactionRef ? `💳 *Bank Ref / UTR:* ${transactionRef} (${bankName})` : '',
      ``,
      `Kindly verify piece availability, gold rate-lock eligibility, and fulfillment schedule.`
    ].filter(Boolean);
    openWhatsAppChat(lines.join('\n'));
  };

  const handleTrackLive = () => {
    if (onClose) onClose();
    navigate('/track-order', {
      state: {
        initialOrderNumber: orderNum,
        initialPhone: phone
      }
    });
  };

  return (
    <div className="py-6 px-1 sm:px-2 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="size-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
        <CheckCircle2 className="size-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-mono tracking-widest uppercase text-amber-700 dark:text-amber-300 mb-2">
        <span>AU · 916.6</span>
        <span>•</span>
        <span>{isDelivery ? 'Delivery Order' : 'Showroom Pickup Order'}</span>
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-light text-foreground mb-1">
        Order Lodged Successfully
      </h3>
      <p className="text-xs text-muted-foreground font-light max-w-sm mb-4 leading-relaxed">
        {isDelivery
          ? 'Your order has been recorded for delivery. Our concierge will contact you to verify delivery details.'
          : 'Collect your jewellery from our Saddar Karachi showroom once our master goldsmiths complete verification and assay hallmarking.'}
      </p>

      <div className="w-full rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-left space-y-2.5 mb-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
            {isDelivery ? (
              <>
                <Truck className="size-3.5 text-amber-600" />
                <span>Delivery Details</span>
              </>
            ) : (
              <>
                <Store className="size-3.5 text-amber-600" />
                <span>Showroom Pickup Details</span>
              </>
            )}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30 font-semibold">
            {isDelivery ? (order.customer?.city || 'Karachi') : (storeProfile.hub || 'Saddar Karachi')}
          </span>
        </div>

        <div className="space-y-1 text-xs font-mono">
          {isDelivery ? (
            <>
              <div className="font-semibold text-foreground">Address: {order.customer?.shippingAddress || 'Karachi'}</div>
              <div className="text-muted-foreground text-[11px] leading-relaxed">
                City: {order.customer?.city || 'Karachi'}
              </div>
              <div className="text-muted-foreground text-[10px] pt-1 border-t border-amber-500/20 leading-relaxed font-sans">
                Our concierge team will telephone {phone} to coordinate safe dispatch.
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold text-foreground">{storeProfile.name}</div>
              <div className="text-muted-foreground text-[11px] leading-relaxed">
                {storeProfile.address}
              </div>
              <div className="text-foreground/90 text-[11px] flex items-center gap-1 pt-0.5">
                <Clock className="size-3 text-amber-600" />
                <span>Hours: {storeProfile.openingHours}</span>
              </div>
              <div className="text-muted-foreground text-[10px] pt-1 border-t border-amber-500/20 leading-relaxed font-sans">
                Please present your order reference (<strong>{orderNum}</strong>) upon collection at our showroom concierge desk.
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full rounded-xl border border-border/80 bg-background p-4 text-left space-y-3 mb-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Order Reference</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-foreground tracking-wider">{orderNum}</span>
            <button
              type="button"
              onClick={() => handleCopy(orderNum, 'Order Reference')}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Copy Reference"
            >
              {copiedField === 'Order Reference' ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground block">Order Status</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {orderStatus}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Payment Status</span>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
              paymentStatus === 'Paid'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                : paymentStatus === 'Partial'
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
                : 'bg-muted text-muted-foreground border-border/60'
            }`}>
              {isPendingApproval ? 'Deposit Pending Verification' : paymentStatus}
            </span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="pt-2 border-t border-border/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
              Ordered Pieces ({order.items.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it, idx) => {
                const itemSize = it.size || it.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1];
                const cleanTitle = (it.title || 'Masterpiece').replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono py-1 border-b border-border/30 last:border-0">
                    <div className="truncate pr-2">
                      <span className="text-foreground font-medium">{cleanTitle}</span>
                      {itemSize && (
                        <span className="ml-1 text-[10px] text-amber-700 dark:text-amber-400 font-sans">
                          (Size {itemSize})
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground shrink-0">Qty: {it.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-mono">
          <span className="text-muted-foreground">Order Total:</span>
          <span className="font-serif font-medium text-foreground text-sm">
            {total > 0 ? formatPKR(total) : 'Pending Consultation'}
          </span>
        </div>
      </div>

      <div className="w-full space-y-2">
        <button
          type="button"
          onClick={handleTrackLive}
          className="w-full h-11 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2 font-semibold shadow-2xs"
        >
          <Building2 className="size-4" />
          <span>Track Order Status ({orderNum})</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppNotify}
          className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="size-4" />
          <span>Notify Atelier Concierge on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 px-4 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Continue Exploring Jewellery</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
