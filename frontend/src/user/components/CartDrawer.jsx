import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { formatPKR, sanitizeQuantity, sanitizePhoneInput, sanitizeNameInput } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { STORE_INFO } from '@/constants/storeInfo';
import { cn } from '@/lib/utils';

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
  const [specialNote, setSpecialNote] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
  const estimatedSubtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.numericPrice) || 0;
    return sum + price * qty;
  }, 0);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const greeting = customerName.trim()
      ? `Hello Khalil & Sons, I am *${customerName.trim()}*${customerPhone.trim() ? ` (${customerPhone.trim()})` : ''}.`
      : 'Hello Khalil & Sons,';

    const itemsSummary = items
      .map((item, index) => {
        const qty = Number(item.quantity) || 1;
        const lineTotal = formatPKR((Number(item.numericPrice) || 0) * qty);
        return `${index + 1}. *${item.name || item.title}*\n   🏷️ Category: ${item.category || 'Fine Jewellery'}\n   ⚖️ Estimated Rate: ${item.price || formatPKR(item.numericPrice)}\n   🔢 Quantity: ${qty}\n   💵 Line Estimated: ${lineTotal}`;
      })
      .join('\n\n');

    const totalFormatted = formatPKR(estimatedSubtotal);

    const message = `${greeting}\n\nI would like to place an inquiry / order for the following jewellery pieces from your online catalog:\n\n${itemsSummary}\n\n━━━━━━━━━━━━━━━━━━━━\n💎 *Total Pieces:* ${totalQuantity}\n💰 *Estimated Total:* ${totalFormatted} (Karachi Sarafa Linked)\n${specialNote.trim() ? `📝 *Note:* ${specialNote.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━\n\nPlease confirm piece availability, final gold gram weight, and arrange an in-store viewing or bespoke delivery from your Saddar boutique.`;

    openWhatsAppChat(message);
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
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10">
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-lg sm:text-xl font-light text-foreground">
              Atelier Bag
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
              {totalQuantity} {totalQuantity === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center px-4">
              <div className="size-12 rounded-full border border-border/80 bg-muted/40 flex items-center justify-center mb-3">
                <Gem className="size-5 text-muted-foreground/60" />
              </div>
              <h3 className="font-serif text-base text-foreground font-light mb-1">
                Your Atelier Bag is Empty
              </h3>
              <p className="text-xs text-muted-foreground font-light max-w-xs mb-6 leading-relaxed">
                Explore our certified 22K & 24K gold bridal sets, necklaces, bangles, and solitaires to select your masterpieces.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors cursor-pointer shadow-xs"
              >
                Browse Jewellery
              </button>
            </div>
          ) : (
            items.map((item) => {
              const qty = Number(item.quantity) || 1;
              const unitPrice = Number(item.numericPrice) || 0;
              const lineTotal = unitPrice * qty;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/80 bg-background flex gap-3.5 shadow-2xs hover:border-foreground/30 transition-colors"
                >
                  <div className="size-20 rounded-lg overflow-hidden border border-border/80 bg-muted/20 shrink-0 relative">
                    <img
                      src={item.image || item.imageUrl || '/assets/products/choker-ruby-01.jpg'}
                      alt={item.name || item.title}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/products/choker-ruby-01.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-xs sm:text-sm font-medium text-foreground truncate">
                          {item.name || item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemove && onRemove(item.id)}
                          className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-muted-foreground">
                        <span>{item.category || 'Fine Jewellery'}</span>
                        <span>•</span>
                        <span>AU · 22K</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-2">
                      <div className="flex items-center gap-1 border border-border/80 rounded-md bg-muted/30 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => onDecrement && onDecrement(item.id)}
                          className="p-1 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                          disabled={qty <= 1}
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <input
                          type="text"
                          value={qty}
                          onChange={(e) => {
                            if (onUpdateQuantity) {
                              const clean = sanitizeQuantity(e.target.value);
                              onUpdateQuantity(item.id, clean);
                            }
                          }}
                          className="w-7 text-center text-xs font-mono bg-transparent text-foreground focus-visible:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => onIncrement && onIncrement(item.id)}
                          className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-medium text-foreground block">
                          {formatPKR(lineTotal)}
                        </span>
                        {qty > 1 && (
                          <span className="text-[9px] font-mono text-muted-foreground block">
                            {formatPKR(unitPrice)} ea
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border/80 bg-muted/30 space-y-3.5">
            <div className="space-y-1.5 pb-2 border-b border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Estimated Valuation</span>
                <span className="text-foreground">{formatPKR(estimatedSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Sarafa Rate Surcharge</span>
                <span className="text-emerald-700 dark:text-emerald-400">Linked to Spot</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-sm font-light text-foreground">Estimated Total</span>
                <span className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight">
                  {formatPKR(estimatedSubtotal)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground block pt-0.5">
                Exact price determined at time of order by daily Karachi Sarafa gold rate & net gram weight.
              </span>
            </div>

            {showCheckoutForm ? (
              <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(sanitizeNameInput(e.target.value))}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(sanitizePhoneInput(e.target.value))}
                    placeholder="+92 333 1234567"
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Special Inscription / Sizing Note
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value.slice(0, 120))}
                    placeholder="Optional ring size, kada diameter, or wedding date..."
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="flex-[2] h-10 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>Send Order to WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="size-4" />
                  <span>Inquire & Reserve via WhatsApp</span>
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
