import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { Skiper54, DEFAULT_SKIPER_IMAGES } from '../components/Skiper54';
import { ImageGallery } from '@/components/ui/image-gallery';
import { GalleryPagination } from '../components/GalleryPagination';
import { galleryApi } from '@/api/galleryApi';

const PAGE_SIZE = 9;

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

  const [galleryItems, setGalleryItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsInitialLoading(true);
      try {
        const res = await galleryApi.getAll({ page: 1, limit: PAGE_SIZE });
        if (res?.data && res.data.length > 0) {
          setGalleryItems(res.data);
          setTotalCount(res.total ?? res.data.length);
          setHasMore(Boolean(res.hasMore));
        } else {
          setGalleryItems(DEFAULT_SKIPER_IMAGES.slice(0, PAGE_SIZE));
          setTotalCount(DEFAULT_SKIPER_IMAGES.length);
          setHasMore(DEFAULT_SKIPER_IMAGES.length > PAGE_SIZE);
        }
      } catch {
        setGalleryItems(DEFAULT_SKIPER_IMAGES.slice(0, PAGE_SIZE));
        setTotalCount(DEFAULT_SKIPER_IMAGES.length);
        setHasMore(DEFAULT_SKIPER_IMAGES.length > PAGE_SIZE);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const res = await galleryApi.getAll({ page: nextPage, limit: PAGE_SIZE });
      if (res?.data && res.data.length > 0) {
        setGalleryItems((prev) => {
          const existingIds = new Set(prev.map((i) => i._id || i.id));
          const newUnique = res.data.filter((i) => !existingIds.has(i._id || i.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(Boolean(res.hasMore));
        if (res.total) setTotalCount(res.total);
      } else {
        const currentCount = galleryItems.length;
        if (currentCount < DEFAULT_SKIPER_IMAGES.length) {
          const fallbackSlice = DEFAULT_SKIPER_IMAGES.slice(currentCount, currentCount + PAGE_SIZE);
          setGalleryItems((prev) => [...prev, ...fallbackSlice]);
          setHasMore(currentCount + fallbackSlice.length < DEFAULT_SKIPER_IMAGES.length);
        } else {
          setHasMore(false);
        }
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
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
              images={galleryItems.length > 0 ? galleryItems : DEFAULT_SKIPER_IMAGES}
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
                  Jewellery Collection
                </span>
                <h2 className="font-headline text-3xl md:text-5xl text-[#2d3435] font-normal">
                  All Jewellery <span className="serif-italic">Pieces</span>
                </h2>
              </div>
              <span className="text-xs tracking-widest text-[#5a6061] uppercase font-mono">
                {totalCount || galleryItems.length} Pieces Available
              </span>
            </div>

            <ImageGallery
              items={galleryItems}
              isLoadingMore={isLoadingMore}
              onItemClick={(piece) => {
                const targetId = piece._id || piece.id;
                if (targetId) {
                  navigate(`/gallery/${targetId}`);
                }
              }}
            />

            {!isInitialLoading && (
              <GalleryPagination
                hasMore={hasMore}
                isLoading={isLoadingMore}
                onLoadMore={handleLoadMore}
                total={totalCount || galleryItems.length}
                loadedCount={galleryItems.length}
                autoLoadOnScroll={true}
              />
            )}
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
        onIncrement={(id) => setCartItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))}
        onDecrement={(id) => setCartItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0))}
        onRemove={(id) => setCartItems((p) => p.filter((i) => i.id !== id))}
      />
    </div>
  );
}
