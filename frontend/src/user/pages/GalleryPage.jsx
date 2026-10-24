import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { Skiper54 } from '../components/Skiper54';
import { LuxuryButton } from '../components/LuxuryButton';
import { NeuralNoise } from '@/components/ui/neural-noise';
import { SparklesIcon } from '@/components/ui/sparkles';
import { galleryApi } from '@/api/galleryApi';

const DEFAULT_GALLERY_FALLBACK = [
  {
    _id: 'default-1',
    title: 'The Aurelian Signet',
    description: '18K Hand-hammered Florentine gold with raw uncut diamond centerpiece',
    imageUrl: '/images/image-01.jpg'
  },
  {
    _id: 'default-2',
    title: 'Venetian Mist Choker',
    description: 'South Sea cultured pearls interwoven with hand-pulled Venetian gold filigree',
    imageUrl: '/images/image-02.jpg'
  },
  {
    _id: 'default-3',
    title: 'Etruscan Serpent Armlet',
    description: 'Intricately chased 22K solid yellow gold with Burmese emerald eyes',
    imageUrl: '/images/image-03.jpg'
  },
  {
    _id: 'default-4',
    title: 'Renaissance Solstice Tiara',
    description: 'Platinum & 18K gold archival commission forged with Renaissance chasing techniques',
    imageUrl: '/images/banner.jpg'
  }
];

export function GalleryPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryApi.getAll();
        if (res?.data && res.data.length > 0) {
          setGalleryItems(res.data);
        } else {
          setGalleryItems(DEFAULT_GALLERY_FALLBACK);
        }
      } catch {
        setGalleryItems(DEFAULT_GALLERY_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="relative z-10 bg-[#f9f9f9]">
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-20 text-center overflow-hidden">
          <NeuralNoise
            position="absolute"
            zIndex={0}
            color={[0.9, 0.72, 0.28]}
            opacity={0.18}
            speed={0.0006}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-medium tracking-widest uppercase mb-4">
              <SparklesIcon size={12} />
              <span>Living Archive • Florence Atelier</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl text-[#2d3435] leading-tight font-light mb-6">
              The Haute Joaillerie <span className="serif-italic">Gallery</span>
            </h1>
            <p className="text-[#5a6061] text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
              A curated exhibition of our limited-edition commissions and handcrafted masterworks, forged with patient Renaissance goldcraft.
            </p>
          </div>
        </section>

        <section className="relative px-4 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <Skiper54
              images={galleryItems}
              autoplay={true}
              loop={true}
              showNavigation={true}
              showPagination={true}
            />
          </div>
        </section>

        <section className="py-20 px-6 md:px-20 bg-[#f2f4f4] border-t border-neutral-200/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#5f5e5e] font-medium block mb-2">
                  Permanent Collection
                </span>
                <h2 className="font-headline text-3xl md:text-5xl text-[#2d3435] font-normal">
                  All Exhibition <span className="serif-italic">Pieces</span>
                </h2>
              </div>
              <span className="text-xs tracking-widest text-[#5a6061] uppercase">
                {galleryItems.length} Masterpiece{galleryItems.length !== 1 ? 's' : ''} Documented
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((piece, index) => (
                <div
                  key={piece._id || index}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
                    <img
                      src={piece.imageUrl || piece.src}
                      alt={piece.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-600 font-mono font-medium block mb-1">
                        Plate #{String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-headline text-xl text-[#2d3435] font-medium mb-2">
                        {piece.title}
                      </h3>
                      {piece.description && (
                        <p className="text-xs text-[#5a6061] font-light leading-relaxed mb-6">
                          {piece.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-neutral-100">
                      <LuxuryButton
                        as="a"
                        href="mailto:concierge@khalilandsons.com?subject=Inquiry%20Regarding%20Gallery%20Commission"
                        size="sm"
                        variant="dark"
                        className="w-full"
                      >
                        Inquire About Commission
                      </LuxuryButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={(id) => setCartItems(p => p.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))}
        onDecrement={(id) => setCartItems(p => p.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0))}
        onRemove={(id) => setCartItems(p => p.filter(i => i.id !== id))}
      />
    </div>
  );
}
