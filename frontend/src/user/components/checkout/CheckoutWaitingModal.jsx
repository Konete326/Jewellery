import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, CheckCircle2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';
import { Button } from '@/components/ui/button';

export function CheckoutWaitingModal({ isOpen, onClose, orderData }) {
  const navigate = useNavigate();

  if (!isOpen || !orderData) return null;

  const orderNumber = orderData.orderNumber || 'KS-ATELIER';
  const totalAmount = Number(orderData.totalAmount) || 0;
  const advancePaid = Number(orderData.advancePaid) || 0;
  const balanceDue = Number(orderData.balanceDue) || Math.max(0, totalAmount - advancePaid);
  const isBankTransfer = advancePaid > 0 || orderData.paymentDetails?.transactionRef;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-[10px] uppercase tracking-widest">
            <span>AU · 916.6</span>
            <span className="text-muted-foreground/40">•</span>
            <span>RESERVATION LOGGED</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center sm:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold block">
              Awaiting Atelier &amp; Finance Verification
            </span>
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Order {orderNumber}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your bespoke reservation has been securely recorded. An official verification email has been dispatched to your inbox.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Order Valuation:</span>
              <span className="font-serif font-semibold text-foreground">{formatPKR(totalAmount)}</span>
            </div>

            {isBankTransfer ? (
              <>
                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                  <span>Advance Deposit:</span>
                  <span className="font-semibold">{formatPKR(advancePaid)}</span>
                </div>
                {orderData.paymentDetails?.transactionRef && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Transaction UTR:</span>
                    <span className="text-foreground">{orderData.paymentDetails.transactionRef}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-border/60 text-foreground font-semibold">
                  <span>Balance at Showroom:</span>
                  <span className="font-serif">{formatPKR(balanceDue)}</span>
                </div>
              </>
            ) : (
              <div className="pt-1 border-t border-border/60 text-amber-800 dark:text-amber-300 font-semibold">
                <span>Settlement: Full payment on inspection at Saddar Showroom</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-1 text-xs">
            <p className="font-semibold text-amber-800 dark:text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              Showroom Collection Address
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi.
              Please present your order reference number upon arrival.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                navigate('/shop');
              }}
              className="flex-1 h-10 text-xs font-mono uppercase tracking-wider gap-2 cursor-pointer"
            >
              <ShoppingBag className="size-3.5" />
              <span>Continue Shopping</span>
            </Button>

            <Button
              type="button"
              onClick={() => {
                onClose();
                navigate('/track-order', { state: { orderNumber } });
              }}
              className="flex-1 h-10 text-xs font-mono uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 gap-2 cursor-pointer shadow-xs"
            >
              <span>Track Order</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}