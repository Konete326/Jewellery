import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { Skiper54, DEFAULT_SKIPER_IMAGES } from '../components/Skiper54';
import { LuxuryButton } from '../components/LuxuryButton';
import { GlobalGoldEffect } from '../components/GlobalGoldEffect';
import { galleryApi } from '@/api/galleryApi';

export function GalleryPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('khalil_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [galleryItems, setGalleryItems] = useState(DEFAULT_SKIPER_IMAGES);

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryApi.getAll();
        if (res?.data && res.data.length > 0) {
          const dbItems = res.data;
          const merged = dbItems.length >= 6
            ? dbItems
            : [...dbItems, ...DEFAULT_SKIPER_IMAGES.slice(0, Math.max(0, 8 - dbItems.length))];
          setGalleryItems(merged);
        } else {
          setGalleryItems(DEFAULT_SKIPER_IMAGES);
        }
      } catch {
        setGalleryItems(DEFAULT_SKIPER_IMAGES);
      }
    };
    fetchGallery();
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <GlobalGoldEffect />
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="relative z-10">
        <section className="relative pt-18 pb-4 md:pt-22 md:pb-6 px-4 sm:px-6 md:px-12 text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-mono font-medium block mb-1.5">
              Handcrafted Gold & Diamond Jewellery
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-[#2d3435] leading-tight font-light mb-2.5">
              Jewellery <span className="serif-italic">Gallery</span>
            </h1>
            <p className="text-[#5a6061] text-xs sm:text-sm leading-relaxed font-light max-w-md mx-auto">
              Explore our handcrafted gold and diamond jewellery collection, created with fine craftsmanship and authentic quality.
            </p>
          </div>
        </section>

        <section className="relative w-full px-0 pb-20 overflow-hidden">
          <div className="w-full">
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
                {galleryItems.length} Masterpieces Documented
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((piece, index) => (
                <div
                  key={piece._id || index}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div
                    onClick={() => {
                      const targetId = piece._id || piece.id || `default-${index + 1}`;
                      navigate(`/gallery/${targetId}`);
                    }}
                    className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative cursor-pointer"
                  >
                    <img
                      src={piece.imageUrl || piece.src}
                      alt={piece.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-widest text-amber-600 font-mono font-medium block">
                          Plate #{String(index + 1).padStart(2, '0')}
                        </span>
                        {(piece.averageRating >= 4 || piece.rating >= 4) && (
                          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-800 text-[11px] font-mono">
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                            <span>{(piece.averageRating || piece.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <h3
                        onClick={() => {
                          const targetId = piece._id || piece.id || `default-${index + 1}`;
                          navigate(`/gallery/${targetId}`);
                        }}
                        className="font-headline text-xl text-[#2d3435] font-medium mb-2 hover:text-amber-700 transition-colors cursor-pointer"
                      >
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
                        as="button"
                        onClick={() => {
                          const targetId = piece._id || piece.id || `default-${index + 1}`;
                          navigate(`/gallery/${targetId}`);
                        }}
                        size="sm"
                        variant="dark"
                        className="w-full"
                      >
                        Acquire Masterpiece
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
