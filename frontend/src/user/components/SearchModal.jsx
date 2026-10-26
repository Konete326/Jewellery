import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Gem, Compass, Star, Tag } from 'lucide-react';
import { galleryApi } from '@/api/galleryApi';
import { filterPages, BOUTIQUE_PAGES } from './search/searchData';

export function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pieces, setPieces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    (async () => {
      try {
        const res = await galleryApi.getAll({ silent: true });
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (isMounted) setPieces(list);
      } catch {
        if (isMounted) setPieces([]);
      }
    })();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const query = searchTerm.trim().toLowerCase();

  const matchingPieces = useMemo(() => {
    if (!query) return [];
    return pieces.filter((p) => {
      const matchText = (
        (p.title || '') + ' ' +
        (p.description || '') + ' ' +
        (p.category || '')
      ).toLowerCase();

      const matchesQuery = matchText.includes(query);
      if (!matchesQuery) return false;

      if (selectedCategory === 'all') return true;
      return (p.category || '').toLowerCase().includes(selectedCategory);
    }).slice(0, 8);
  }, [pieces, query, selectedCategory]);

  const matchingPages = useMemo(() => {
    if (!query) return [];
    if (selectedCategory !== 'all' && selectedCategory !== 'pages') return [];
    return filterPages(query).slice(0, 4);
  }, [query, selectedCategory]);

  const totalResultsCount = matchingPieces.length + matchingPages.length;

  const handleSelectPiece = (pieceId) => {
    onClose();
    setSearchTerm('');
    navigate(`/gallery/${pieceId}`);
  };

  const handleSelectPage = (path) => {
    onClose();
    setSearchTerm('');
    if (path.startsWith('/#')) {
      const hash = path.replace('/', '');
      window.location.hash = hash;
    } else {
      navigate(path);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (matchingPieces.length > 0) {
      handleSelectPiece(matchingPieces[0]._id || matchingPieces[0].id);
    } else if (matchingPages.length > 0) {
      handleSelectPage(matchingPages[0].path);
    } else if (query) {
      onClose();
      navigate(`/gallery?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-border/80 bg-background text-foreground shadow-2xl overflow-hidden mt-6 md:mt-12 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/80 bg-muted/20">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <form onSubmit={handleFormSubmit} className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search handcrafted jewellery, bridal sets, or boutique pages..."
              className="w-full bg-transparent text-base sm:text-lg font-light placeholder:text-muted-foreground/60 outline-none"
            />
          </form>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs uppercase font-mono tracking-wider text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border/60 bg-muted/10 overflow-x-auto text-xs font-mono scrollbar-none">
          <span className="text-muted-foreground uppercase text-[10px] tracking-wider shrink-0">Filter:</span>
          {[
            { id: 'all', label: 'All Results' },
            { id: 'bridal', label: 'Bridal Sets' },
            { id: 'bangles', label: 'Bangles & Kadas' },
            { id: 'rings', label: 'Solitaire Rings' },
            { id: 'pages', label: 'Boutique Pages' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {query ? (
            totalResultsCount > 0 ? (
              <>
                {matchingPieces.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground block">
                      Masterpieces & Heirlooms ({matchingPieces.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchingPieces.map((piece) => {
                        const id = piece._id || piece.id;
                        return (
                          <div
                            key={id}
                            onClick={() => handleSelectPiece(id)}
                            className="group flex items-center gap-3.5 p-2.5 rounded-2xl border border-border/70 hover:border-amber-500/50 bg-card hover:bg-muted/40 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                          >
                            <img
                              src={piece.imageUrl || piece.src || '/assets/logo.png'}
                              alt={piece.title}
                              className="size-14 rounded-xl object-cover border border-border/80 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 block truncate">
                                {piece.category || '22K Gold Piece'}
                              </span>
                              <h4 className="text-sm font-medium text-foreground truncate group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                                {piece.title}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <Star className="size-3 fill-amber-500 text-amber-500" />
                                <span className="font-mono text-[11px]">{piece.averageRating ? piece.averageRating.toFixed(1) : '5.0'}</span>
                                <span className="text-[10px] text-muted-foreground font-light">• In Stock</span>
                              </div>
                            </div>
                            <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all mr-1" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {matchingPages.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground block">
                      Boutique Pages & Services ({matchingPages.length})
                    </span>
                    <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-card overflow-hidden">
                      {matchingPages.map((page) => (
                        <div
                          key={page.id}
                          onClick={() => handleSelectPage(page.path)}
                          className="group flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors cursor-pointer gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                              <Compass className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-foreground group-hover:underline">
                                  {page.title}
                                </h4>
                                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  {page.category}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-light truncate mt-0.5">
                                {page.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Gem className="size-10 text-muted-foreground/40 mx-auto" />
                <h3 className="font-serif text-lg font-light text-foreground">
                  No masterpieces or pages matching &ldquo;{searchTerm}&rdquo;
                </h3>
                <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
                  Try searching with keywords like &ldquo;Bridal&rdquo;, &ldquo;Bangles&rdquo;, &ldquo;Kundan&rdquo;, &ldquo;Solitaire&rdquo;, &ldquo;Rates&rdquo;, or &ldquo;Saddar&rdquo;.
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 py-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground block">
                Popular Atelier Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Bridal Sets',
                  '22K Gold Bangles',
                  'Kundan Choker',
                  'Solitaire Diamond Band',
                  'Mughal Polki Jhumkas',
                  'Live Gold Rates',
                  'Saddar Showroom'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchTerm(tag)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs text-foreground transition-colors cursor-pointer"
                  >
                    <Tag className="size-3 text-amber-700 dark:text-amber-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-border/60">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Featured Boutique Destinations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {BOUTIQUE_PAGES.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPage(p.path)}
                      className="p-3 rounded-xl border border-border/70 hover:border-amber-500/40 bg-card hover:bg-muted/30 transition-all cursor-pointer"
                    >
                      <span className="font-medium text-foreground block">{p.title}</span>
                      <span className="text-[11px] text-muted-foreground font-light truncate block">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-[11px] text-muted-foreground font-mono">
          <span>Press Enter to select</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
