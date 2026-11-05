import React, { useState, useEffect } from 'react';
import { Navbar } from '@/user/components/Navbar';
import { Footer } from '@/user/components/Footer';
import { SearchModal } from '@/user/components/SearchModal';
import { CartDrawer } from '@/user/components/CartDrawer';
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal';
import { ContactConfirmationModal } from '@/user/components/ContactConfirmationModal';
import { AtelierContactDirectory } from '@/user/components/AtelierContactDirectory';
import { AtelierContactForm } from '@/user/components/AtelierContactForm';
import { AtelierInteractiveMap } from '@/user/components/AtelierInteractiveMap';
import { updatePageSEO } from '@/utils/seo';
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync';
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage';

export function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [cartItems, setCartItems] = useState(() => getLocalCart());

  useEffect(() => {
    updatePageSEO({
      title: 'Contact Showroom | Saddar Karachi',
      description: 'Contact Khalil & Sons Jewellers at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Call +92 21 35670868 or WhatsApp +92 333 3213613 for private consultation.',
      keywords: 'contact Khalil & Sons, jewellery shop Saddar Karachi, Murshid Sunaar Tower location, goldsmith Karachi phone'
    });
  }, []);

  useEffect(() => {
    saveLocalCart(cartItems);
    const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    broadcastCartUpdate(count, cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const nextUser = e?.detail ?? null;
      setCartItems(getLocalCart(nextUser));
    };
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        const currentKey = getCartStorageKey();
        if (!data.cartKey || data.cartKey === currentKey) {
          setCartItems(data.items);
        }
      }
    });
    return unsubscribe;
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  const handleInquirySuccess = (submittedData) => {
    setConfirmationData(submittedData);
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="relative z-10 pt-16 md:pt-20 pb-12 w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-stretch">
          <div className="lg:col-span-5 xl:col-span-5 h-full">
            <AtelierContactDirectory
              onOpenAppointment={() => setIsAppointmentOpen(true)}
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-7 h-full">
            <AtelierContactForm
              onSuccess={handleInquirySuccess}
            />
          </div>
        </div>

        <AtelierInteractiveMap onOpenAppointment={() => setIsAppointmentOpen(true)} />
      </main>

      <Footer />

      <ContactConfirmationModal
        isOpen={Boolean(confirmationData)}
        onClose={() => setConfirmationData(null)}
        inquiryData={confirmationData}
      />

      <BespokeAppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={(id) =>
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item))
          )
        }
        onDecrement={(id) =>
          setCartItems((prev) =>
            prev
              .map((item) => (item.id === id ? { ...item, quantity: (Number(item.quantity) || 1) - 1 } : item))
              .filter((item) => item.quantity > 0)
          )
        }
        onRemove={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
        onUpdateQuantity={(id, qty) =>
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
          )
        }
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}

export default ContactPage;
