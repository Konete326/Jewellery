import React, { useState, useEffect } from 'react';
import { Navbar } from '@/user/components/Navbar';
import { Footer } from '@/user/components/Footer';
import { SearchModal } from '@/user/components/SearchModal';
import { CartDrawer } from '@/user/components/CartDrawer';
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal';
import { ContactConfirmationModal } from '@/user/components/ContactConfirmationModal';
import { AtelierContactDirectory } from '@/user/components/AtelierContactDirectory';
import { AtelierContactForm } from '@/user/components/AtelierContactForm';
import { updatePageSEO } from '@/utils/seo';

export function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    updatePageSEO({
      title: 'Contact Atelier & Showroom | Saddar Karachi',
      description: 'Contact Khalil & Sons Jewellers at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. Call +92 21 35670868 or WhatsApp +92 333 3213613 for private consultation.',
      keywords: 'contact Khalil & Sons, jewellery shop Saddar Karachi, Murshid Sunaar Tower location, goldsmith Karachi phone'
    });
  }, []);

  const handleInquirySuccess = (submittedData) => {
    setConfirmationData(submittedData);
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={0}
      />

      <main className="relative z-10 pt-16 md:pt-20 pb-12 w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-start">
          <div className="lg:col-span-5 xl:col-span-5">
            <AtelierContactDirectory
              onOpenAppointment={() => setIsAppointmentOpen(true)}
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-7">
            <AtelierContactForm
              onSuccess={handleInquirySuccess}
            />
          </div>
        </div>
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
        items={[]}
      />
    </div>
  );
}

export default ContactPage;
