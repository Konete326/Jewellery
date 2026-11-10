import React, { useState, useEffect } from 'react';
import { X, Gem, Building2, Truck, Loader2, ArrowRight, ShieldCheck, Copy, Check, MessageCircle } from 'lucide-react';
import { formatPKR, sanitizePhoneInput, sanitizeNameInput, sanitizeQuantity, isItemPriceConfirmed } from '@/utils/pricing';
import { createOrder } from '@/api/orderApi';
import { fetchActivePaymentAccounts } from '@/api/paymentAccountsApi';
import { storeProfileApi } from '@/api/storeProfileApi';
import { getVerifiedStoreProfile } from '@/utils/storeConfig';
import { getAuthUser } from '@/lib/auth';
import { clearLocalCart, getLocalCart, saveLocalCart, getCartStorageKey } from '@/utils/cartStorage';
import { broadcastCartUpdate } from '@/utils/tabSync';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { toast } from 'sonner';
import { CartDrawerItem } from './CartDrawerItem';
import { CartOrderSuccess } from './CartOrderSuccess';

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
  const isControlled = Array.isArray(propsItems);
  const [internalItems, setInternalItems] = useState(() => getLocalCart());

  const authUser = getAuthUser();
  const [customerName, setCustomerName] = useState(() => authUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => authUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(() => authUser?.email || '');
  const [fulfillmentType, setFulfillmentType] = useState('Delivery');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [specialNote, setSpecialNote] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);

  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [copiedField, setCopiedField] = useState(null);
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
      if (nextUser) {
        if (nextUser.name && !customerName) setCustomerName(nextUser.name);
        if (nextUser.phone && !customerPhone) setCustomerPhone(nextUser.phone);
        if (nextUser.email && !customerEmail) setCustomerEmail(nextUser.email);
      }
    };
    window.addEventListener('khalil_cart_change', handleCartChange);
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('khalil_cart_change', handleCartChange);
      window.removeEventListener('khalil_auth_change', handleAuthChange);
    };
  }, [isControlled, customerName, customerPhone, customerEmail]);

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
        .map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: (Number(item.quantity) || 1) - 1 } : item
        )
        .filter((item) => item.quantity > 0);
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

  const onUpdateQuantity = (id, newQty) => {
    if (propsOnUpdateQuantity) {
      propsOnUpdateQuantity(id, newQty);
    } else {
      const safeQty = sanitizeQuantity(newQty);
      const next = internalItems.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: safeQty } : item
      );
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
      setInternalItems([]);
      clearLocalCart();
      broadcastCartUpdate(0, []);
    }
  };

  const items = isControlled ? propsItems : internalItems;

  useEffect(() => {
    if (!isOpen) return;
    let isSubscribed = true;

    fetchActivePaymentAccounts()
      .then((res) => {
        if (!isSubscribed) return;
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setPaymentAccounts(list);
        if (list.length > 0 && !selectedAccountId) {
          const defaultAcc = list.find((a) => a.isDefault) || list[0];
          setSelectedAccountId(defaultAcc._id || defaultAcc.id);
        }
      })
      .catch(() => {});

    const fetchProfile = storeProfileApi?.getPublic
      ? storeProfileApi.getPublic()
      : (storeProfileApi?.getProfile ? storeProfileApi.getProfile() : Promise.resolve(null));

    fetchProfile
      .then((res) => {
        if (!isSubscribed) return;
        const data = res?.data || res;
        if (data) {
          setStoreProfile(getVerifiedStoreProfile(data));
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, selectedAccountId]);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

  const confirmedSubtotal = items.reduce((sum, item) => {
    if (!isItemPriceConfirmed(item)) return sum;
    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.price || item.numericPrice) || 0);
    return sum + price * qty;
  }, 0);

  const estimatedTotal = items.reduce((sum, item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.price || item.numericPrice) || 0);
    return sum + price * qty;
  }, 0);

  const hasUnconfirmedItems = items.some((item) => !isItemPriceConfirmed(item));

  const selectedAccount = paymentAccounts.find(
    (a) => (a._id || a.id) === selectedAccountId
  ) || paymentAccounts[0];

  const minAdvanceRequired = !hasUnconfirmedItems && confirmedSubtotal > 0 ? Math.round(confirmedSubtotal * 0.9) : 0;

  const handleClose = () => {
    setShowCheckoutForm(false);
    setOrderPlacedData(null);
    onClose();
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const buildWhatsAppInquiryMessage = (cleanName, cleanPhone) => {
    const itemsSummary = items
      .map((item, index) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const isConfirmed = isItemPriceConfirmed(item);
        const resolvedSize = item.size || item.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1];
        const sizeStr = resolvedSize ? ` [Size: ${resolvedSize}]` : '';
        const cleanTitle = (item.title || item.name || 'Masterpiece').replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();
        const priceNum = Number(item.numericPrice || item.price) || 0;
        const priceLabel = isConfirmed
          ? `Confirmed Rate: ${formatPKR(priceNum)}`
          : `Estimated Rate: ${formatPKR(priceNum)} (Live Rate Pending)`;

        return `${index + 1}. *${cleanTitle}*${sizeStr}\n   Purity: ${item.purity || item.material || '22K'}\n   ${priceLabel}\n   Quantity: ${qty}`;
      })
      .join('\n\n');

    const totalValuation = items.reduce((sum, item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.numericPrice || item.price) || 0);
      return sum + price * qty;
    }, 0);

    const fulfillmentText = fulfillmentType === 'Delivery'
      ? `Delivery to ${shippingAddress.trim() || 'Karachi'}${city.trim() ? `, ${city.trim()}` : ''}`
      : `Showroom Pickup at ${storeProfile.address || 'Murshid Sunaar Tower, Saddar, Karachi'}`;

    const greeting = cleanName
      ? `Hello Khalil & Sons, I am *${cleanName}* (${cleanPhone}).`
      : 'Hello Khalil & Sons,';

    return [
      greeting,
      ``,
      `I would like to inquire about the following jewellery pieces from my cart:`,
      ``,
      itemsSummary,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 Fulfillment Preference: ${fulfillmentText}`,
      `💎 Total Pieces: ${totalQuantity}`,
      `💰 Total Estimated Valuation: ${formatPKR(totalValuation)}`,
      `⚖️ Valuation Note: Unpriced gallery pieces are subject to live gold rate lock and weight verification by atelier desk.`,
      specialNote.trim() ? `📝 Note / Requirements: ${specialNote.trim()}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `Kindly confirm current gold rates, piece availability, and showroom consultation / delivery options.`
    ].filter(Boolean).join('\n');
  };

  const handleWhatsAppInquirySubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const cleanName = sanitizeNameInput(customerName);
    if (!cleanName || cleanName.length < 2) {
      toast.error('Please enter your full name');
      return;
    }

    const cleanPhone = sanitizePhoneInput(customerPhone);
    if (!cleanPhone || cleanPhone.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (fulfillmentType === 'Delivery' && !shippingAddress.trim()) {
      toast.error('Please provide your delivery address');
      return;
    }

    const message = buildWhatsAppInquiryMessage(cleanName, cleanPhone);
    openWhatsAppChat(message);
    toast.success('Inquiry opened in WhatsApp. Our concierge will assist you with live rates.');
  };

  const handleSubmitConfirmedOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (hasUnconfirmedItems) {
      handleWhatsAppInquirySubmit(e);
      return;
    }

    const cleanName = sanitizeNameInput(customerName);
    if (!cleanName || cleanName.length < 2) {
      toast.error('Please enter your full name');
      return;
    }

    const cleanPhone = sanitizePhoneInput(customerPhone);
    if (!cleanPhone || cleanPhone.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (fulfillmentType === 'Delivery' && !shippingAddress.trim()) {
      toast.error('Please provide your delivery address');
      return;
    }

    const cleanEmail = customerEmail.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((it) => {
        const itemQty = Math.max(1, parseInt(it.quantity, 10) || 1);
        const resolvedSize = it.size
          ? String(it.size).replace(/^\[Size:\s*|\]$/gi, '').trim()
          : (it.title?.match(/\[Size:\s*([^\]]+)\]/i)?.[1]?.trim() || undefined);
        const rawId = String(it.productId || it.id || '');
        const cleanProductId = rawId.includes('-') && resolvedSize && rawId.endsWith(`-${resolvedSize}`)
          ? rawId.slice(0, -(resolvedSize.length + 1))
          : rawId;
        const cleanTitle = (it.title || it.name || 'Masterpiece').replace(/\s*\[Size:\s*[^\]]+\]/i, '').trim();

        return {
          productId: cleanProductId,
          title: cleanTitle,
          quantity: itemQty,
          price: Math.max(0, parseInt(it.price || it.numericPrice, 10) || 0),
          imageUrl: it.image || it.imageUrl || '',
          purity: it.purity || it.material || '22K',
          size: resolvedSize || undefined
        };
      });

      const cleanTxRef = transactionRef ? transactionRef.trim() : '';

      const payload = {
        customer: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail || undefined,
          shippingAddress: fulfillmentType === 'Delivery'
            ? shippingAddress.trim()
            : (storeProfile.address || 'Murshid Sunaar Tower, Saddar, Karachi'),
          city: fulfillmentType === 'Delivery'
            ? (city.trim() || 'Karachi')
            : (storeProfile.city || 'Karachi')
        },
        fulfillmentType,
        items: orderItems,
        totalAmount: confirmedSubtotal,
        advancePaid: 0,
        customerNote: specialNote.trim() || undefined,
        paymentDetails: cleanTxRef
          ? {
              method: 'Bank Transfer',
              transactionRef: cleanTxRef,
              bankName: selectedAccount?.bankName || 'Bank Transfer'
            }
          : undefined
      };

      const res = await createOrder(payload);
      const created = res?.data || res;
      setOrderPlacedData(created);

      if (propsOnClearCart) {
        propsOnClearCart();
      } else {
        setInternalItems([]);
        clearLocalCart();
        broadcastCartUpdate(0, []);
      }

      toast.success(`Order ${created.orderNumber || ''} lodged successfully.`);
    } catch (err) {
      toast.error(err?.message || 'Could not place order directly. Connecting via WhatsApp...');
      const cleanName = sanitizeNameInput(customerName);
      const cleanPhone = sanitizePhoneInput(customerPhone);
      const message = buildWhatsAppInquiryMessage(cleanName, cleanPhone);
      openWhatsAppChat(message);
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
              {orderPlacedData ? 'Order Confirmation' : 'Shopping Cart'}
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
            <CartOrderSuccess
              order={orderPlacedData}
              paymentAccounts={paymentAccounts}
              selectedAccount={selectedAccount}
              storeProfile={storeProfile}
              onClose={handleClose}
            />
          ) : items.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center px-4">
              <div className="px-3 py-1.5 rounded bg-black/85 text-amber-300 font-mono text-[10px] tracking-widest border border-amber-500/30 uppercase mb-3">
                AU · 916.6 · ATELIER BAG
              </div>
              <h3 className="font-serif text-base text-foreground font-light mb-1">
                Your Cart is Empty
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
            <div className="space-y-2.5">
              {items.map((item) => (
                <CartDrawerItem
                  key={item.id}
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {!orderPlacedData && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border/80 bg-muted/30 space-y-3.5">
            <div className="space-y-1.5 pb-2 border-b border-border/60">
              {hasUnconfirmedItems ? (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Estimated Valuation</span>
                    <span className="text-foreground">{formatPKR(estimatedTotal)} (Est.)</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground block pt-0.5 leading-relaxed">
                    Cart contains items with unconfirmed prices. Inquiry will be relayed to atelier desk via WhatsApp for live gold rate quotation.
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatPKR(confirmedSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Gold Rate Status</span>
                    <span className="text-emerald-700 dark:text-emerald-400">Locked upon Finance Verification</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif text-sm font-light text-foreground">Total</span>
                    <span className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight">
                      {formatPKR(confirmedSubtotal)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {showCheckoutForm ? (
              <form
                onSubmit={hasUnconfirmedItems ? handleWhatsAppInquirySubmit : handleSubmitConfirmedOrder}
                className="space-y-3 pt-1 animate-in fade-in duration-150"
              >
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
                    <span>Delivery</span>
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
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(sanitizePhoneInput(e.target.value))}
                      placeholder="0300 1234567"
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="patron@example.com"
                      className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                </div>

                {fulfillmentType === 'Delivery' ? (
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
                        placeholder="House / Street, Area, Karachi"
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
                ) : (
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-xs font-mono space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Showroom Pickup Location
                    </span>
                    <span className="font-medium text-foreground block">
                      {storeProfile.address || 'Murshid Sunaar Tower, Saddar, Karachi'}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Special Note / Size Requirements
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value.slice(0, 140))}
                    placeholder="Optional ring size, bangle diameter, or custom note..."
                    className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                  />
                </div>

                {!hasUnconfirmedItems && minAdvanceRequired > 0 && selectedAccount && (
                  <div className="p-3 rounded-xl border border-border/80 bg-card space-y-2 text-xs font-mono shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="size-3 text-emerald-600" />
                        <span>Optional Gold Rate Lock Deposit (90%)</span>
                      </span>
                      <span className="font-semibold text-foreground">{formatPKR(minAdvanceRequired)}</span>
                    </div>

                    <div className="text-[11px] space-y-0.5 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Bank:</span>
                        <span className="text-foreground font-medium">{selectedAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Title:</span>
                        <span className="text-foreground">{selectedAccount.accountTitle}</span>
                      </div>
                      {selectedAccount.accountNumber && (
                        <div className="flex justify-between items-center">
                          <span>Account Number:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-foreground font-semibold">{selectedAccount.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedAccount.accountNumber, 'Account Number')}
                              className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {copiedField === 'Account Number' ? <Check className="size-2.5 text-emerald-600" /> : <Copy className="size-2.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
                          Bank Ref / Transaction ID
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value.slice(0, 50))}
                          placeholder="Optional UTR / Ref"
                          className="w-full h-7 px-2 rounded border border-border/80 bg-background text-foreground text-[11px] focus-visible:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
                          Deposit Amount (PKR)
                        </label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder={String(minAdvanceRequired)}
                          className="w-full h-7 px-2 rounded border border-border/80 bg-background text-foreground text-[11px] focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground block leading-relaxed">
                      Rate lock is activated once your deposit is approved by the finance desk. Advance remains uncredited until verification.
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    disabled={isSubmitting}
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] h-10 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : hasUnconfirmedItems ? (
                      <MessageCircle className="size-3.5" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                    <span>
                      {isSubmitting
                        ? 'Processing...'
                        : hasUnconfirmedItems
                        ? 'Submit Inquiry via WhatsApp'
                        : 'Place Order'}
                    </span>
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
                  {hasUnconfirmedItems ? (
                    <>
                      <MessageCircle className="size-4" />
                      <span>Proceed to Inquiry via WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="size-4" />
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>{storeProfile.hub || 'Saddar, Karachi'}</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="hover:text-destructive transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
