import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { Skiper54 } from '../components/Skiper54';
import { ImageGallery } from '@/components/ui/image-gallery';
import InkHeadline from '@/components/ui/ink-headline';
import { GalleryPagination } from '../components/GalleryPagination';
import { galleryApi } from '@/api/galleryApi';
import { updatePageSEO } from '@/utils/seo';
import { Sparkles } from 'lucide-react';

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
    updatePageSEO({
      title: 'Haute Joaillerie Gallery & Bridal Heirlooms',
      description: 'Explore the complete Khalil & Sons fine jewellery collection. Certified 22K/24K gold bridal sets, Polki diamond heirlooms, kadas, and gulubands in Saddar, Karachi.',
      keywords: 'jewellery gallery Karachi, 22K gold bridal sets, Pakistani gold jewellery, polki collection, handcrafted kadas Karachi'
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      setIsInitialLoading(true);
      try {
        const res = await galleryApi.getAll({ page: 1, limit: PAGE_SIZE });
        if (!isMounted) return;
        if (res?.data && res.data.length > 0) {
          setGalleryItems(res.data);
          setTotalCount(res.total ?? res.data.length);
          setHasMore(Boolean(res.hasMore));
        } else {
          setGalleryItems([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } catch {
        if (isMounted) {
          setGalleryItems([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchInitial();
    return () => {
      isMounted = false;
    };
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
        setHasMore(false);
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
            <InkHeadline
              as="h1"
              by="word"
              trigger="inView"
              duration={1600}
              stagger={220}
              inkColor="#2d3435"
              className="font-headline text-3xl sm:text-4xl md:text-5xl text-[#2d3435] leading-tight font-light mb-2.5"
            >
              Haute Joaillerie & Bridal Gallery
            </InkHeadline>
            <p className="text-[#5a6061] text-xs sm:text-sm leading-relaxed font-light max-w-md mx-auto">
              Explore our handcrafted gold and diamond jewellery collection, created with fine craftsmanship and authentic quality.
            </p>
          </div>
        </section>

        {galleryItems.length > 0 && (
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
        )}

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

            {isInitialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="aspect-square bg-neutral-200/70 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="rounded-2xl border border-neutral-300/80 bg-white p-12 text-center max-w-md mx-auto shadow-sm">
                <Sparkles className="size-8 text-amber-600 mx-auto mb-4" />
                <h3 className="font-headline text-2xl text-[#2d3435] mb-2 font-normal">
                  Catalog Updating
                </h3>
                <p className="text-sm text-[#5a6061] leading-relaxed font-light">
                  Our master goldsmiths are adding pieces to the online showcase. Pieces published from the Admin Panel will appear here.
                </p>
              </div>
            ) : (
              <>
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

                <GalleryPagination
                  hasMore={hasMore}
                  isLoading={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  total={totalCount || galleryItems.length}
                  loadedCount={galleryItems.length}
                  autoLoadOnScroll={true}
                />
              </>
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
