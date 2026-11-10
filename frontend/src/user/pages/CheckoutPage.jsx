import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';
import { CheckoutPaymentSection } from '../components/checkout/CheckoutPaymentSection';
import { CheckoutWaitingModal } from '../components/checkout/CheckoutWaitingModal';
import { getLocalCart, saveLocalCart, clearLocalCart } from '@/utils/cartStorage';
import { broadcastCartUpdate } from '@/utils/tabSync';
import { fetchActivePaymentAccounts } from '@/api/paymentAccountsApi';
import { ratesApi } from '@/api/ratesApi';
import { createOrder } from '@/api/orderApi';
import { getAuthUser } from '@/lib/auth';
import { formatPKR, isItemPriceConfirmed } from '@/utils/pricing';
import { updatePageSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [items, setItems] = useState(() => getLocalCart());
  const [goldRates, setGoldRates] = useState(null);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const [customerName, setCustomerName] = useState(() => authUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(() => authUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(() => authUser?.phone || '');
  const [customerNote, setCustomerNote] = useState('');

  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [depositAmount, setDepositAmount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    updatePageSEO({
      title: 'Checkout & Showroom Reservation | Khalil & Sons Jewellers',
      noIndex: true
    });

    ratesApi.getRates().then((res) => {
      if (res?.data) setGoldRates(res.data);
    }).catch(() => {});

    fetchActivePaymentAccounts().then((res) => {
      if (Array.isArray(res?.data) && res.data.length > 0) {
        setPaymentAccounts(res.data);
        const defaultAcc = res.data.find((a) => a.isDefault) || res.data[0];
        setSelectedAccountId(defaultAcc._id);
      }
    }).catch(() => {});
  }, []);

  const subtotal = items.reduce((sum, item) => {
    if (!isItemPriceConfirmed(item)) return sum;
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  const minAdvanceRequired = Math.round(subtotal * 0.9);

  useEffect(() => {
    if (paymentMode === 'Bank Transfer' && !depositAmount && minAdvanceRequired > 0) {
      setDepositAmount(String(minAdvanceRequired));
    }
  }, [paymentMode, minAdvanceRequired, depositAmount]);

  const numericDeposit = paymentMode === 'Bank Transfer' ? Number(depositAmount) || 0 : 0;
  const balanceDue = Math.max(0, subtotal - numericDeposit);

  const onIncrement = (id) => {
    const next = items.map((i) =>
      String(i.id) === String(id) ? { ...i, quantity: (Number(i.quantity) || 1) + 1 } : i
    );
    setItems(next);
    saveLocalCart(next);
    broadcastCartUpdate(next.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0), next);
  };

  const onDecrement = (id) => {
    const next = items
      .map((i) => {
        if (String(i.id) !== String(id)) return i;
        const currentQty = Number(i.quantity) || 1;
        return currentQty > 1 ? { ...i, quantity: currentQty - 1 } : null;
      })
      .filter(Boolean);
    setItems(next);
    saveLocalCart(next);
    broadcastCartUpdate(next.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0), next);
  };

  const onRemove = (id) => {
    const next = items.filter((i) => String(i.id) !== String(id));
    setItems(next);
    saveLocalCart(next);
    broadcastCartUpdate(next.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0), next);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      toast.error('Please complete all required patron contact fields');
      return;
    }

    if (paymentMode === 'Bank Transfer') {
      if (!selectedAccountId) {
        toast.error('Please select a receiving bank account');
        return;
      }
      if (!numericDeposit || numericDeposit <= 0) {
        toast.error('Please enter a valid deposit amount');
        return;
      }
      if (!transactionRef.trim()) {
        toast.error('Please enter your Bank Reference / UTR Number');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const selectedAccount = paymentAccounts.find((a) => a._id === selectedAccountId);
      const payload = {
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          city: 'Karachi'
        },
        fulfillmentType: 'Showroom Pickup',
        items: items.map((i) => ({
          productId: i.id || i._id,
          title: i.title,
          category: i.category || 'Bridal Sets',
          purity: i.purity || '22K',
          size: i.size || '',
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
          imageUrl: i.imageUrl || i.image || i.src || ''
        })),
        totalAmount: subtotal,
        advancePaid: numericDeposit,
        balanceDue,
        customerNote: customerNote.trim(),
        paymentMode,
        ...(paymentMode === 'Bank Transfer' ? {
          initialPayment: {
            bankAccountId: selectedAccountId,
            amount: numericDeposit,
            paymentReference: transactionRef.trim(),
            paymentType: 'Bank Transfer',
            notes: 'Showroom Reservation Advance'
          },
          paymentDetails: {
            method: 'Bank Transfer',
            transactionRef: transactionRef.trim(),
            bankName: selectedAccount?.bankName || 'Bank Transfer'
          }
        } : {
          paymentDetails: {
            method: 'Showroom Payment'
          }
        })
      };

      const res = await createOrder(payload);
      if (res?.data) {
        clearLocalCart();
        setItems([]);
        broadcastCartUpdate(0, []);
        setOrderPlacedData(res.data);
      } else {
        throw new Error(res?.message || 'Failed to record reservation');
      }
    } catch (err) {
      toast.error(err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-2 mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3" />
            <span>Return to Showcase</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-[10px] uppercase tracking-widest mb-2">
                <span>AU · 916.6</span>
                <span className="text-muted-foreground/40">•</span>
                <span>SHOWROOM RESERVATION &amp; CHECKOUT</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Secure Checkout &amp; Reservation
              </h1>
            </div>
            <p className="text-xs font-mono text-muted-foreground max-w-xs sm:text-right">
              All bespoke orders are verified at our Saddar, Karachi atelier.
            </p>
          </div>
        </div>

        {items.length === 0 && !orderPlacedData ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase tracking-widest">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>ATELIER BAG</span>
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-semibold text-foreground">Your bag is empty</h2>
              <p className="text-xs text-muted-foreground">
                Please add pure gold heirlooms from our collection before proceeding to checkout.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <ShoppingBag className="size-3.5" />
              <span>Explore Showcase</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <CheckoutPaymentSection
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerEmail={customerEmail}
                setCustomerEmail={setCustomerEmail}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerNote={customerNote}
                setCustomerNote={setCustomerNote}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                paymentAccounts={paymentAccounts}
                selectedAccountId={selectedAccountId}
                setSelectedAccountId={setSelectedAccountId}
                depositAmount={depositAmount}
                setDepositAmount={setDepositAmount}
                transactionRef={transactionRef}
                setTransactionRef={setTransactionRef}
                subtotal={subtotal}
                minAdvanceRequired={minAdvanceRequired}
              />
            </div>

            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <CheckoutOrderSummary
                items={items}
                goldRates={goldRates}
                subtotal={subtotal}
                depositAmount={numericDeposit}
                balanceDue={balanceDue}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
              />

              <Button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Showroom Reservation</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <CheckoutWaitingModal
        isOpen={Boolean(orderPlacedData)}
        onClose={() => setOrderPlacedData(null)}
        orderData={orderPlacedData}
      />
    </div>
  );
}