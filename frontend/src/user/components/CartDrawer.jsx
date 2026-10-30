import React, { useState } from 'react';
import { X, Gem, MessageCircle, Truck, Building2, Loader2, ArrowRight } from 'lucide-react';
import { formatPKR, sanitizePhoneInput, sanitizeNameInput } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { createOrder } from '@/api/orderApi';
import { toast } from 'sonner';
import { CartDrawerItem } from './CartDrawerItem';
import { CartOrderSuccess } from './CartOrderSuccess';

export function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateQuantity,
  onClearCart
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('Delivery');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [specialNote, setSpecialNote] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
  const estimatedSubtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.numericPrice) || 0;
    return sum + price * qty;
  }, 0);

  const handleClose = () => {
    setShowCheckoutForm(false);
    setOrderPlacedData(null);
    onClose();
  };

  const handleWhatsAppFallback = () => {
    if (items.length === 0) return;

    const greeting = customerName.trim()
      ? `Hello Khalil & Sons, I am *${customerName.trim()}*${customerPhone.trim() ? ` (${customerPhone.trim()})` : ''}.`
      : 'Hello Khalil & Sons,';

    const itemsSummary = items
      .map((item, index) => {
        const qty = Number(item.quantity) || 1;
        const lineTotal = formatPKR((Number(item.numericPrice) || 0) * qty);
        return `${index + 1}. *${item.name || item.title}*\n   Category: ${item.category || 'Fine Jewellery'}\n   Estimated Rate: ${item.price || formatPKR(item.numericPrice)}\n   Quantity: ${qty}\n   Line Estimated: ${lineTotal}`;
      })
      .join('\n\n');

    const totalFormatted = formatPKR(estimatedSubtotal);

    const message = `${greeting}\n\nI would like to place an inquiry / order for the following jewellery pieces:\n\n${itemsSummary}\n\n━━━━━━━━━━━━━━━━━━━━\nTotal Pieces: ${totalQuantity}\nEstimated Total: ${totalFormatted} (Karachi Sarafa Linked)\n${specialNote.trim() ? `Note: ${specialNote.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━\n\nPlease confirm availability and gold rate-lock eligibility.`;

    openWhatsAppChat(message);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (fulfillmentType === 'Delivery' && !shippingAddress.trim()) {
      toast.error('Please provide your shipping address');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          shippingAddress: fulfillmentType === 'Delivery' ? shippingAddress.trim() : 'Murshid Sunaar Tower, Saddar, Karachi',
          city: fulfillmentType === 'Delivery' ? (city.trim() || 'Karachi') : 'Karachi'
        },
        fulfillmentType,
        items: items.map((item) => ({
          productId: String(item.id || item._id || 'item-' + Math.random().toString(36).slice(2, 7)),
          title: item.name || item.title || 'Fine Jewellery Piece',
          category: item.category || 'Fine Jewellery',
          purity: item.purity || '22K',
          quantity: Math.max(1, Number(item.quantity) || 1),
          price: Number(item.numericPrice) || 0,
          imageUrl: item.image || item.imageUrl || ''
        })),
        totalAmount: estimatedSubtotal,
        customerNote: specialNote.trim() || undefined
      };

      const res = await createOrder(payload);
      const created = res?.data || res;
      setOrderPlacedData(created);
      if (onClearCart) onClearCart();
      toast.success(`Order ${created.orderNumber || 'placed'} successfully lodged.`);
    } catch (err) {
      toast.error(err?.message || 'Could not place order directly. Connecting via WhatsApp...');
      handleWhatsAppFallback();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 animate-in fade-in duration-200"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
        onClick={handleClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10">
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              {orderPlacedData ? 'Order Confirmation' : 'Atelier Bag'}
            </h2>
            {!orderPlacedData && (
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                {totalQuantity} {totalQuantity === 1 ? 'Piece' : 'Pieces'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orderPlacedData ? (
            <CartOrderSuccess order={orderPlacedData} onClose={handleClose} />
          ) : items.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center px-4">
              <div className="size-12 rounded-full border border-border/80 bg-muted/40 flex items-center justify-center mb-3">
                <Gem className="size-5 text-muted-foreground/60" />
              </div>
              <h3 className="font-serif text-base text-foreground font-light mb-1">
                Your Atelier Bag is Empty
              </h3>
              <p className="text-xs text-muted-foreground font-light max-w-xs mb-6 leading-relaxed">
                Explore our certified 22K gold bridal sets, necklaces, bangles, and solitaires to select your masterpieces.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors cursor-pointer shadow-xs"
              >
                Browse Jewellery
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartDrawerItem
                key={item.id}
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))
          )}
        </div>

        {!orderPlacedData && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border/80 bg-muted/30 space-y-3.5">
            <div className="space-y-1.5 pb-2 border-b border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Estimated Valuation</span>
                <span className="text-foreground">{formatPKR(estimatedSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Sarafa Rate Lock</span>
                <span className="text-emerald-700 dark:text-emerald-400">Locked on Confirmation</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-sm font-light text-foreground">Estimated Total</span>
                <span className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight">
                  {formatPKR(estimatedSubtotal)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground block pt-0.5">
                Final bullion rate locked by atelier desk upon order verification.
              </span>
            </div>

            {showCheckoutForm ? (
              <form onSubmit={handleSubmitOrder} className="space-y-3 pt-1 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('Delivery')}
                    className={`h-9 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      fulfillmentType === 'Delivery'
                        ? 'border-foreground bg-foreground text-background font-medium'
                        : 'border-border/80 bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Truck className="size-3.5" />
                    <span>White-Glove Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('Showroom Pickup')}
                    className={`h-9 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      fulfillmentType === 'Showroom Pickup'
                        ? 'border-foreground bg-foreground text-background font-medium'
                        : 'border-border/80 bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Building2 className="size-3.5" />
                    <span>Showroom Pickup</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(sanitizeNameInput(e.target.value))}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(sanitizePhoneInput(e.target.value))}
                      placeholder="+92 333 1234567"
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="patron@gmail.com"
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                </div>

                {fulfillmentType === 'Delivery' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="House / Street, Phase / Block"
                        className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Karachi"
                        className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Special Note / Ring Size
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value.slice(0, 140))}
                    placeholder="Optional ring size, kada diameter, or note..."
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    disabled={isSubmitting}
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] h-10 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                    <span>{isSubmitting ? 'Recording Order...' : 'Place Order'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="size-4" />
                  <span>Proceed to Reserve & Order</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>Murshid Sunaar Tower, Saddar</span>
                  {onClearCart && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="hover:text-destructive transition-colors cursor-pointer underline underline-offset-2"
                    >
                      Clear Bag
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
