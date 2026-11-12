import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { ShopGrid } from '../components/shop/ShopGrid';
import { ShopTile } from '../components/shop/ShopTile';
import { ShopThreeItemGrid } from '../components/shop/ShopThreeItemGrid';
import { ShopCollectionsFilter, ShopSortFilter, MobileFilterTrigger, MobileFilterDrawer } from '../components/shop/ShopFilterSidebar';
import { ShopSearchHeader } from '../components/shop/ShopSearchHeader';
import { fetchProducts } from '@/api/productApi';
import { fetchCategories } from '@/api/categoryApi';
import { JEWELLERY_CATEGORIES, normalizeCategory, getCategorySlug, resolveCategoryMeta } from '@/constants/categories';
import { updatePageSEO } from '@/utils/seo';
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync';
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage';
import { getEstimatedPiecePrice, formatPKR, sanitizeQuantity } from '@/utils/pricing';
import { toast } from 'sonner';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Gem } from 'lucide-react';
import { getJewellerySizingType } from '@/utils/jewellerySizing';

export function ShopPage() {
  const navigate = useNavigate();
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getLocalCart());

  const [galleryItems, setGalleryItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState(JEWELLERY_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const selectedCategory = routeCategory
    ? normalizeCategory(routeCategory)
    : (searchParams.get('category') ? normalizeCategory(searchParams.get('category')) : 'all');
  const selectedSort = searchParams.get('sort') || 'featured';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const meta = resolveCategoryMeta(routeCategory);
    if (meta) {
      updatePageSEO({
        title: meta.title,
        description: meta.description,
        url: meta.canonicalUrl
      });
    } else {
      updatePageSEO({
        title: 'Haute Joaillerie & Bridal Collections • Khalil & Sons Jewellers',
        description: 'Explore the complete Khalil & Sons outlet catalog. Certified 22K & 24K hallmarked gold bridal sets, polki necklaces, solitaires, kadas, and artisanal bullion in Saddar, Karachi.',
        url: 'https://khalilandsonsjewellers.com/shop'
      });
    }
  }, [routeCategory]);

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

  useEffect(() => {
    let isMounted = true;

    const loadAllMasterpieces = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          fetchProducts({ limit: 120, isPublished: true }),
          fetchCategories({ isActive: true })
        ]);
        if (!isMounted) return;
        const rawProducts = prodRes.status === 'fulfilled'
          ? (prodRes.value?.data?.items || prodRes.value?.data || [])
          : [];
        const publishedProducts = Array.isArray(rawProducts)
          ? rawProducts.filter((p) => p.isPublished !== false)
          : [];
        setGalleryItems(publishedProducts);
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
      const cat = normalizeCategory(item.category || '');
      if (cat && cat !== 'all') {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    let list = [...galleryItems];

    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      const target = normalizeCategory(selectedCategory).toLowerCase();
      list = list.filter((item) => {
        const itemCat = (item.category || '').trim().toLowerCase();
        const normItemCat = normalizeCategory(itemCat).toLowerCase();
        return (
          itemCat === target ||
          normItemCat === target ||
          itemCat.includes(target) ||
          target.includes(itemCat)
        );
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
    const normalized = normalizeCategory(cat);
    if (routeCategory || (typeof window !== 'undefined' && window.location.pathname.startsWith('/collections'))) {
      if (normalized === 'all') {
        navigate('/shop');
      } else {
        navigate(`/collections/${getCategorySlug(normalized)}`);
      }
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    if (normalized === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', normalized);
    }
    setSearchParams(newParams);
  };

  const handleSelectSort = (sortSlug) => {
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
    setSearchQuery('');
    if (routeCategory) {
      navigate('/shop');
    } else {
      setSearchParams(new URLSearchParams());
    }
  };

  const handleAddToCart = (piece) => {
    if (!piece) return;
    const pieceId = piece._id || piece.id;
    const sizingType = getJewellerySizingType(piece);
    if (sizingType) {
      toast.info(`Please select your bespoke ${sizingType} size`, {
        description: 'Opening piece details for accurate measurement...'
      });
      navigate(`/product/${pieceId}`);
      return;
    }

    const pricing = getEstimatedPiecePrice(piece);
    const purityVal = piece.purity || pricing.purity || '';
    const images = Array.isArray(piece.images) ? piece.images : [];
    const imageSrc = piece.imageUrl || piece.src || images[0] || '/assets/products/choker-ruby-01.jpg';

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(pieceId));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(pieceId) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: pieceId,
          productId: String(pieceId),
          name: piece.title || 'Fine Jewellery Piece',
          title: piece.title || 'Fine Jewellery Piece',
          category: piece.category || 'Fine Jewellery',
          image: imageSrc,
          imageUrl: imageSrc,
          numericPrice: pricing.numericPrice,
          price: pricing.formattedPrice,
          quantity: 1,
          material: purityVal,
          purity: purityVal,
          isEstimated: Boolean(pricing.isEstimated),
          hasConfirmedPrice: Boolean(pricing.hasConfirmedPrice),
          pricingSource: pricing.pricingSource || 'estimate',
          calculatedPrice: piece.calculatedPrice || undefined,
          netWeight: piece.netWeight || undefined,
          grossWeight: piece.grossWeight || undefined,
          makingCharges: piece.makingCharges || undefined,
          size: undefined
        }
      ];
    });

    toast.success(`${piece.title || 'Masterpiece'} added to your bag`, {
      action: {
        label: 'View Bag',
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    const clean = sanitizeQuantity(newQty);
    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, quantity: clean } : item))
    );
  };

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: (Number(item.quantity) || 1) - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    toast.info('Item removed from bag');
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Shopping bag cleared');
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
          <ShopThreeItemGrid
            items={featuredSpotlightItems}
            onAddToCart={handleAddToCart}
          />
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
          <div className="hidden md:block order-first w-full flex-none md:max-w-[200px] md:sticky md:top-24">
            <ShopCollectionsFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              categories={categoriesList}
              countsByCategory={countsByCategory}
              totalCount={galleryItems.length}
            />
          </div>

          <div className="order-last min-h-[50vh] w-full md:order-none flex-1">
            <MobileFilterTrigger
              onClick={() => setIsMobileFilterOpen(true)}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
            />

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
              <ShopGrid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-6">
                {filteredItems.map((piece) => (
                  <ShopGrid.Item key={piece._id || piece.id}>
                    <ShopTile
                      piece={piece}
                      onAddToCart={handleAddToCart}
                    />
                  </ShopGrid.Item>
                ))}
              </ShopGrid>
            )}
          </div>

          <div className="hidden md:block order-none flex-none md:order-last md:w-[160px] md:sticky md:top-24">
            <ShopSortFilter
              selectedSort={selectedSort}
              onSelectSort={handleSelectSort}
            />
          </div>
        </div>
      </main>

      <Footer />

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        categories={categoriesList}
        countsByCategory={countsByCategory}
        totalCount={filteredItems.length}
        selectedSort={selectedSort}
        onSelectSort={handleSelectSort}
        onResetAll={handleResetAll}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
