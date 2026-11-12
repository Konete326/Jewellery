import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { LayoutGrid } from '@/components/ui/layout-grid';
import { GalleryPagination } from '../components/GalleryPagination';
import { galleryApi } from '@/api/galleryApi';
import { updatePageSEO } from '@/utils/seo';
import { LumaSpin } from '@/components/ui/luma-spin';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

const ARCHIVE_CATEGORIES = [
  'All Pieces',
  'Bridal Sets',
  'Necklaces & Chokers',
  'Bangles & Kadas',
  'Polki & Kundan',
  'Rings & Solitaires',
  'Earrings & Jhumkas'
];

export function MasterpiecesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Pieces');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    updatePageSEO({
      title: 'Masterpiece Living Archive | Certified Gold Heirlooms | Khalil & Sons',
      description: 'Explore the living archive of certified 22K and 24K gold bespoke masterpieces by Khalil & Sons, Saddar, Karachi. Custom commissions and design inquiries.',
      canonical: 'https://khalilandsonsjewellers.com/masterpieces'
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      setIsInitialLoading(true);
      try {
        const res = await galleryApi.getAll({ page: 1, limit: PAGE_SIZE });
        if (!isMounted) return;
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setItems(list);
        setTotalCount(res?.total ?? list.length);
        setHasMore(Boolean(res?.hasMore));
      } catch {
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setIsInitialLoading(false);
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
      const nextList = Array.isArray(res?.data) ? res.data : [];
      if (nextList.length > 0) {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i._id || i.id));
          const newUnique = nextList.filter((i) => !existingIds.has(i._id || i.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(Boolean(res.hasMore));
        if (res.total) setTotalCount(res.total);
      } else {
        setHasMore(false);
      }
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  };

  const matchesCategory = (piece, category) => {
    if (category === 'All Pieces') return true;
    const pCat = (piece.category || '').toLowerCase();
    const pTitle = (piece.title || '').toLowerCase();
    const pDesc = (piece.description || '').toLowerCase();

    if (category === 'Bridal Sets') {
      return pCat.includes('bridal') || pTitle.includes('bridal') || pCat.includes('set') || pTitle.includes('set');
    }
    if (category === 'Necklaces & Chokers') {
      return pCat.includes('necklace') || pCat.includes('choker') || pTitle.includes('necklace') || pTitle.includes('choker') || pCat.includes('mala') || pTitle.includes('mala') || pCat.includes('guluband');
    }
    if (category === 'Bangles & Kadas') {
      return pCat.includes('bangle') || pCat.includes('kada') || pTitle.includes('bangle') || pTitle.includes('kada') || pCat.includes('bracelet');
    }
    if (category === 'Polki & Kundan') {
      return pCat.includes('polki') || pCat.includes('kundan') || pTitle.includes('polki') || pTitle.includes('kundan');
    }
    if (category === 'Rings & Solitaires') {
      return pCat.includes('ring') || pCat.includes('solitaire') || pTitle.includes('ring') || pTitle.includes('band');
    }
    if (category === 'Earrings & Jhumkas') {
      return pCat.includes('earring') || pCat.includes('jhumka') || pTitle.includes('earring') || pTitle.includes('jhumka') || pCat.includes('tops');
    }
    const catLower = category.toLowerCase();
    return pCat.includes(catLower) || pTitle.includes(catLower) || pDesc.includes(catLower);
  };

  const filteredItems = useMemo(() => {
    return items.filter((piece) => matchesCategory(piece, selectedCategory));
  }, [items, selectedCategory]);

  const layoutCards = filteredItems.map((piece, index) => {
    const isSpan2 = index % 5 === 0 || index % 5 === 3;
    const thumbnail = piece.imageUrl || (Array.isArray(piece.images) && piece.images[0]) || '/assets/products/choker-ruby-01.jpg';

    return {
      id: piece._id || piece.id || `card-${index}`,
      className: isSpan2 ? 'md:col-span-2' : 'col-span-1',
      thumbnail,
      title: piece.title || 'Bespoke Heirlooms',
      category: piece.category || '22K Gold Masterpiece',
      description: piece.description || 'Handcrafted bespoke piece from our Saddar Karachi goldsmith atelier.',
      piece
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase tracking-widest">
            <span>AU · 916.6 &amp; AU · 999.0</span>
            <span className="text-muted-foreground/40">•</span>
            <span>LIVING ARCHIVE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
            The Masterpiece Archive
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            A curated showcase of bespoke bridal jewellery, royal necklace sets, and heritage heirlooms created at our Saddar, Karachi atelier. Each design is custom crafted to patron specifications.
          </p>
        </div>

        {isInitialLoading ? (
          <div className="py-24 flex items-center justify-center">
            <LumaSpin variant="amber" size={36} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-3">
            <p className="font-serif text-xl font-semibold text-foreground">Archive Updating</p>
            <p className="text-xs text-muted-foreground">
              New master jewellery commissions are currently being photographed and archived. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {ARCHIVE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = items.filter((p) => matchesCategory(p, cat)).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0',
                      isSelected
                        ? 'bg-foreground text-background shadow-xs font-medium'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                        isSelected
                          ? 'bg-background/20 text-background'
                          : 'bg-muted-foreground/15 text-muted-foreground'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto space-y-4 rounded-2xl border border-border/80 bg-card p-8">
                <p className="font-serif text-lg font-semibold text-foreground">No Pieces Found in {selectedCategory}</p>
                <p className="text-xs text-muted-foreground">
                  Our artisans are currently crafting custom commissions in this category. You can browse all pieces or inquire on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All Pieces')}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  View All Pieces
                </button>
              </div>
            ) : (
              <>
                <LayoutGrid cards={layoutCards} />

                {selectedCategory === 'All Pieces' && (
                  <GalleryPagination
                    hasMore={hasMore}
                    isLoading={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    total={totalCount || items.length}
                    loadedCount={items.length}
                    autoLoadOnScroll={true}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default MasterpiecesPage;
