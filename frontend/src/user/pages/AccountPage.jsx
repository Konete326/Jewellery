import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/user/components/Footer';
import { AtelierVaultDrawer } from '@/components/vault/AtelierVaultDrawer';
import { CartDrawer } from '@/user/components/CartDrawer';
import { getAuthUser, logoutUser } from '@/lib/auth';
import { SavedAddressesSection } from '@/user/components/addresses/SavedAddressesSection';
import { MapPin, LogOut, ChevronRight, ShieldCheck, Heart, Building2 } from 'lucide-react';

export function AccountPage() {
  const [user] = useState(getAuthUser());
  const [activeTab, setActiveTab] = useState('addresses');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  const handleSignOut = () => {
    logoutUser();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">My Account</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-serif font-semibold text-xl flex items-center justify-center shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-lg font-medium text-foreground truncate">
                    {user?.name || 'Customer'}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {user?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-semibold">
                      AU · 916.6 CUSTOMER
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-foreground text-background font-semibold shadow-2xs'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="size-4" />
                    <span>Saved Addresses</span>
                  </div>
                  <ChevronRight className="size-3.5 opacity-60" />
                </button>

                <Link
                  to="/track-order"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>Track Order</span>
                  </div>
                  <ChevronRight className="size-3.5 opacity-60" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsVaultOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="size-4 text-rose-500" />
                    <span>Saved Items (Wishlist)</span>
                  </div>
                  <ChevronRight className="size-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 text-xs text-muted-foreground font-sans space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-foreground font-medium">
                <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                <span>Account Privacy Guarantee</span>
              </div>
              <p className="text-[11px] font-light leading-relaxed">
                All saved profile and address details are securely stored for account management and showroom consultations.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="p-5 sm:p-7 rounded-2xl border border-border/80 bg-card shadow-xs">
              <SavedAddressesSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AtelierVaultDrawer isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
