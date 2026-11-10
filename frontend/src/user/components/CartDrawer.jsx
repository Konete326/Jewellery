import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, MessageCircle } from 'lucide-react';
import { formatPKR, isItemPriceConfirmed } from '@/utils/pricing';
import { storeProfileApi } from '@/api/storeProfileApi';
import { getVerifiedStoreProfile } from '@/utils/storeConfig';
import { getAuthUser, isAuthenticated } from '@/lib/auth';
import { clearLocalCart, getLocalCart, saveLocalCart, getCartStorageKey } from '@/utils/cartStorage';
import { broadcastCartUpdate } from '@/utils/tabSync';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { toast } from 'sonner';
import { CartDrawerItem } from './CartDrawerItem';

export function CartDrawer({
  isOpen,
  onClose,
  items: propsItems,
  onIncrement: propsOnIncrement,
  onDecrement: propsOnDecrement,
  onRemove: propsOnRemove,
  onUpdateQuantity: propsOnUpdateQuantity,
  onClearCart: propsOnClearCart
}) {
  const navigate = useNavigate();
  const isControlled = Array.isArray(propsItems);
  const [internalItems, setInternalItems] = useState(() => getLocalCart());
  const [storeProfile, setStoreProfile] = useState(getVerifiedStoreProfile());

  useEffect(() => {
    if (isOpen && !isControlled) {
      setInternalItems(getLocalCart());
    }
  }, [isOpen, isControlled]);

  useEffect(() => {
    if (isControlled) return;
    const handleCartChange = (e) => {
      const currentKey = getCartStorageKey();
      if (!e.detail?.cartKey || e.detail.cartKey === currentKey) {
        if (Array.isArray(e.detail?.items)) {
          setInternalItems(e.detail.items);
        } else {
          setInternalItems(getLocalCart());
        }
      }
    };
    const handleAuthChange = (e) => {
      const nextUser = e?.detail ?? null;
      setInternalItems(getLocalCart(nextUser));
    };
    window.addEventListener('khalil_cart_change', handleCartChange);
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('khalil_cart_change', handleCartChange);
      window.removeEventListener('khalil_auth_change', handleAuthChange);
    };
  }, [isControlled]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchProfile = storeProfileApi?.getPublic ? storeProfileApi.getPublic() : storeProfileApi.getProfile();
    fetchProfile
      .then((res) => {
        if (res?.data) setStoreProfile((prev) => ({ ...prev, ...res.data }));
      })
      .catch(() => {});
  }, [isOpen]);

  const onIncrement = (id) => {
    if (propsOnIncrement) {
      propsOnIncrement(id);
    } else {
      const next = internalItems.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
      );
      setInternalItems(next);
      saveLocalCart(next);
      const count = next.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      broadcastCartUpdate(count, next);
    }
  };

  const onDecrement = (id) => {
    if (propsOnDecrement) {
      propsOnDecrement(id);
    } else {
      const next = internalItems
        .map((item) => {
          if (String(item.id) !== String(id)) return item;
          const currentQty = Number(item.quantity) || 1;
          return currentQty > 1 ? { ...item, quantity: currentQty - 1 } : null;
        })
        .filter(Boolean);
      setInternalItems(next);
      saveLocalCart(next);
      const count = next.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      broadcastCartUpdate(count, next);
    }
  };

  const onRemove = (id) => {
    if (propsOnRemove) {
      propsOnRemove(id);
    } else {
      const next = internalItems.filter((item) => String(item.id) !== String(id));
      setInternalItems(next);
      saveLocalCart(next);
      const count = next.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      broadcastCartUpdate(count, next);
    }
  };

  const onClearCart = () => {
    if (propsOnClearCart) {
      propsOnClearCart();
    } else {
      clearLocalCart();
      setInternalItems([]);
      broadcastCartUpdate(0, []);
    }
  };

  const displayItems = isControlled ? propsItems : internalItems;
  const itemCount = displayItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const confirmedSubtotal = displayItems.reduce((sum, item) => {
    if (!isItemPriceConfirmed(item)) return sum;
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const hasUnconfirmedItems = displayItems.some((item) => !isItemPriceConfirmed(item));

  const handleProceedToCheckout = () => {
    onClose();
    if (isAuthenticated()) {
      navigate('/checkout');
    } else {
      toast.info('Sign in required to proceed to checkout');
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
    }
  };

  const handleWhatsAppInquiry = () => {
    const lines = [
      'As-salamu alaykum Khalil & Sons Jewellers, I would like to inquire about these pieces in my bag:',
      ''
    ];
    displayItems.forEach((item, idx) => {
      const qty = item.quantity || 1;
      const sizeStr = item.size ? ` (Size: ${item.size})` : '';
      const priceStr = isItemPriceConfirmed(item) ? ` - ${formatPKR(item.price)}` : ' - Price on Consultation';
      lines.push(`${idx + 1}. ${item.title}${sizeStr} x${qty}${priceStr}`);
    });
    if (confirmedSubtotal > 0) {
      lines.push('', `Estimated Subtotal: ${formatPKR(confirmedSubtotal)}`);
    }
    openWhatsAppChat({ message: lines.join('\n') });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold text-foreground tracking-tight">Atelier Bag</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {displayItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-mono text-xs uppercase tracking-widest">
                  <span>AU · 916.6</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>ATELIER BAG</span>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-base font-semibold text-foreground">Your bag is empty</p>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    Discover our handcrafted pure gold heirlooms and bespoke masterpieces.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 h-9 px-4 rounded-xl border border-border bg-muted/30 hover:bg-muted text-xs font-mono uppercase tracking-wider text-foreground transition-colors cursor-pointer"
                >
                  Explore Showcase
                </button>
              </div>
            ) : (
              displayItems.map((item) => (
                <CartDrawerItem
                  key={`${item.id}-${item.size || 'default'}`}
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                  onUpdateQuantity={propsOnUpdateQuantity}
                />
              ))
            )}
          </div>

          {displayItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-border/80 bg-muted/10 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-muted-foreground uppercase tracking-wider">Estimated Valuation</span>
                  <span className="font-semibold text-base text-foreground font-serif">
                    {confirmedSubtotal > 0 ? formatPKR(confirmedSubtotal) : 'On Consultation'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-amber-500/25 bg-amber-500/5 text-[11px] font-mono text-amber-800 dark:text-amber-300">
                  <span className="font-semibold block uppercase tracking-wider text-[10px]">Fulfillment</span>
                  <span>Personal Collection at Saddar, Karachi Showroom.</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {hasUnconfirmedItems ? (
                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="size-4" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full h-11 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="size-4" />
                    <span>Proceed to Checkout</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>{storeProfile.hub || 'Saddar, Karachi'}</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="hover:text-destructive transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}