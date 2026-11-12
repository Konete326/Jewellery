import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal, Gem } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 180, behavior: 'smooth' });
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

  const matchesSearch = (piece, query) => {
    if (!query || !query.trim()) return true;
    const q = query.trim().toLowerCase();
    const pTitle = (piece.title || '').toLowerCase();
    const pCat = (piece.category || '').toLowerCase();
    const pDesc = (piece.description || '').toLowerCase();
    return pTitle.includes(q) || pCat.includes(q) || pDesc.includes(q);
  };

  const filteredItems = useMemo(() => {
    return items.filter((piece) => matchesCategory(piece, selectedCategory) && matchesSearch(piece, searchQuery));
  }, [items, selectedCategory, searchQuery]);

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

      <main className="flex-1 w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
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
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
              <div className="relative flex-1">
                <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search masterpieces by title or design..."
                  className="w-full h-10 pl-10 pr-9 rounded-xl border border-border/70 bg-background text-foreground text-xs font-mono placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="relative sm:w-64 shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-9 appearance-none rounded-xl border border-border/70 bg-background text-foreground text-xs font-mono uppercase tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 cursor-pointer"
                >
                  {ARCHIVE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-background text-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto space-y-4 rounded-2xl border border-border/80 bg-card p-8">
                <Gem className="size-8 text-muted-foreground mx-auto mb-2 opacity-60" />
                <p className="font-serif text-lg font-semibold text-foreground">No Pieces Found</p>
                <p className="text-xs text-muted-foreground">
                  No masterpiece jewellery matched your current search or category filter. Try clearing keywords or viewing all pieces.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All Pieces');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-foreground/90 transition-colors"
                >
                  View All Pieces
                </button>
              </div>
            ) : (
              <>
                <LayoutGrid cards={layoutCards} />

                {selectedCategory === 'All Pieces' && !searchQuery && (
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
