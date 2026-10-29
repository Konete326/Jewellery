import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { ShopGrid } from '../components/shop/ShopGrid';
import { ShopTile } from '../components/shop/ShopTile';
import { ShopThreeItemGrid } from '../components/shop/ShopThreeItemGrid';
import { ShopCollectionsFilter, ShopSortFilter } from '../components/shop/ShopFilterSidebar';
import { ShopSearchHeader } from '../components/shop/ShopSearchHeader';
import { galleryApi } from '@/api/galleryApi';
import { fetchCategories } from '@/api/categoryApi';
import { JEWELLERY_CATEGORIES } from '@/constants/categories';
import { updatePageSEO } from '@/utils/seo';
import { broadcastCartUpdate, subscribeToTabSync } from '@/utils/tabSync';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Gem } from 'lucide-react';

export function ShopPage() {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [categoriesList, setCategoriesList] = useState(JEWELLERY_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const initialCategory = routeCategory
    ? routeCategory.replace(/-/g, ' ')
    : searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(routeCategory.replace(/-/g, ' '));
    }
  }, [routeCategory]);

  useEffect(() => {
    updatePageSEO({
      title: 'Haute Joaillerie & Bridal Collections • Khalil & Sons Jewellers',
      description: 'Explore the complete Khalil & Sons boutique catalog. Certified 22K & 24K hallmarked gold bridal sets, polki necklaces, solitaires, kadas, and artisanal bullion in Saddar, Karachi.',
      keywords: 'jewellery shop Karachi, buy 22k gold bridal jewellery, certified gold Karachi, Khalil & Sons online catalog'
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems));
      const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      broadcastCartUpdate(count, cartItems);
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        setCartItems(data.items);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAllMasterpieces = async () => {
      setLoading(true);
      try {
        const [galleryRes, catRes] = await Promise.allSettled([
          galleryApi.getAll({ limit: 120 }),
          fetchCategories({ isActive: true })
        ]);
        if (!isMounted) return;
        if (galleryRes.status === 'fulfilled' && galleryRes.value?.data && Array.isArray(galleryRes.value.data)) {
          setGalleryItems(galleryRes.value.data);
        } else {
          setGalleryItems([]);
        }
        if (catRes.status === 'fulfilled' && catRes.value?.data && Array.isArray(catRes.value.data)) {
          const names = catRes.value.data.map((c) => c.name);
          if (names.length > 0) {
            setCategoriesList(names);
          }
        }
      } catch {
        if (isMounted) setGalleryItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const res = await fetchCategories({ isActive: true });
        const list = res?.data;
        if (Array.isArray(list) && list.length > 0) {
          const names = list.map((c) => c.name).filter(Boolean);
          if (names.length > 0) {
            setCategoriesList(names);
          }
        }
      } catch {}
    };

    loadAllMasterpieces();
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const countsByCategory = useMemo(() => {
    const counts = {};
    galleryItems.forEach((item) => {
      const cat = item.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    let list = [...galleryItems];

    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      const target = selectedCategory.trim().toLowerCase();
      list = list.filter((item) => {
        const itemCat = (item.category || '').trim().toLowerCase();
        return itemCat === target || itemCat.includes(target) || target.includes(itemCat);
      });
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch;
      });
    }

    switch (selectedSort) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        list.sort((a, b) => (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0));
        break;
      case 'title-asc':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }, [galleryItems, selectedCategory, searchQuery, selectedSort]);

  const featuredSpotlightItems = useMemo(() => {
    return galleryItems.slice(0, 3);
  }, [galleryItems]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSelectSort = (sortSlug) => {
    setSelectedSort(sortSlug);
    const newParams = new URLSearchParams(searchParams);
    if (sortSlug === 'featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sortSlug);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (!query) {
      newParams.delete('q');
    } else {
      newParams.set('q', query);
    }
    setSearchParams(newParams);
  };

  const handleResetAll = () => {
    setSelectedCategory('all');
    setSelectedSort('featured');
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory.toLowerCase() !== 'all') ||
    Boolean(searchQuery) ||
    selectedSort !== 'featured';

  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="relative z-10 pt-24 md:pt-28 pb-16 w-full max-w-[1880px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {!hasActiveFilters && featuredSpotlightItems.length >= 3 && !loading && (
          <ShopThreeItemGrid items={featuredSpotlightItems} />
        )}

        <ShopSearchHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryClear={() => handleSelectCategory('all')}
          totalResults={filteredItems.length}
          hasActiveFilters={hasActiveFilters}
          onResetAll={handleResetAll}
        />

        <div className="flex flex-col gap-8 md:flex-row items-start">
          <div className="order-first w-full flex-none md:max-w-[200px] md:sticky md:top-24">
            <ShopCollectionsFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              categories={categoriesList}
              countsByCategory={countsByCategory}
              totalCount={galleryItems.length}
            />
          </div>

          <div className="order-last min-h-[50vh] w-full md:order-none flex-1">
            {loading ? (
              <div className="py-24 flex items-center justify-center">
                <LumaSpin variant="amber" size={28} />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-border/80 bg-card p-12 text-center max-w-md mx-auto shadow-2xs">
                <Gem className="size-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-serif text-xl text-foreground mb-1.5 font-light">
                  No Masterpieces Found
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light mb-5">
                  No jewellery creations matched your current search filters. Try refining your keyword or clearing active filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  View All Masterpieces
                </button>
              </div>
            ) : (
              <ShopGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredItems.map((piece) => (
                  <ShopGrid.Item key={piece._id || piece.id}>
                    <ShopTile piece={piece} />
                  </ShopGrid.Item>
                ))}
              </ShopGrid>
            )}
          </div>

          <div className="order-none flex-none md:order-last md:w-[160px] md:sticky md:top-24">
            <ShopSortFilter
              selectedSort={selectedSort}
              onSelectSort={handleSelectSort}
            />
          </div>
        </div>
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
