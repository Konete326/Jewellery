import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { MasterpieceHero } from '../components/MasterpieceHero';
import { MasterpieceLightboxModal } from '../components/MasterpieceLightboxModal';
import { BespokeAppointmentModal } from '../components/BespokeAppointmentModal';
import { galleryApi } from '@/api/galleryApi';
import { fetchProductById } from '@/api/productApi';
import { updatePageSEO } from '@/utils/seo';
import { LumaSpin } from '@/components/ui/luma-spin';

export function MasterpieceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const [piece, setPiece] = useState(null);
  const [similarPieces, setSimilarPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadMasterpiece = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await galleryApi.getById(id, { signal: controller.signal });
        if (!isMounted || controller.signal.aborted) return;

        if (res && res.data) {
          const item = res.data;
          if (item.isProduct) {
            navigate(`/product/${id}`, { replace: true });
            return;
          }
          setPiece(item);

          updatePageSEO({
            title: `${item.title} | Masterpiece Living Archive | Khalil & Sons`,
            description: item.description || `Certified bespoke ${item.purity || '22K'} gold masterpiece handcrafted by master goldsmiths at Khalil & Sons atelier, Karachi.`,
            canonical: `https://khalilandsonsjewellers.com/masterpieces/${item._id || item.id}`
          });
        } else {
          try {
            const prodRes = await fetchProductById(id, { signal: controller.signal, silent: true });
            if (!isMounted || controller.signal.aborted) return;
            if (prodRes?.data || prodRes?._id) {
              navigate(`/product/${id}`, { replace: true });
              return;
            }
          } catch {}
          setNotFound(true);
        }
      } catch {
        if (!isMounted || controller.signal.aborted) return;
        try {
          const prodRes = await fetchProductById(id, { signal: controller.signal, silent: true });
          if (!isMounted || controller.signal.aborted) return;
          if (prodRes?.data || prodRes?._id) {
            navigate(`/product/${id}`, { replace: true });
            return;
          }
        } catch {}
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMasterpiece();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    if (!piece) return;

    galleryApi.getAll({ page: 1, limit: 8, silent: true })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const currentId = String(piece._id || piece.id);
        const filtered = list.filter((i) => String(i._id || i.id) !== currentId).slice(0, 4);
        setSimilarPieces(filtered);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [piece]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/masterpieces" className="hover:text-foreground transition-colors">Masterpieces</Link>
          {piece?.category && (
            <>
              <span>/</span>
              <span className="text-muted-foreground">{piece.category}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] font-medium">{piece?.title || 'Archive Piece'}</span>
        </div>

        {loading ? (
          <div className="min-h-[500px] flex items-center justify-center">
            <LumaSpin variant="amber" size={36} />
          </div>
        ) : notFound || !piece ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase tracking-widest">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>LIVING ARCHIVE</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Masterpiece Not Found</h2>
            <p className="text-xs text-muted-foreground">
              This design may be undergoing restoration or archival indexing.
            </p>
            <Link
              to="/masterpieces"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Explore Masterpiece Archive</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            <MasterpieceHero
              piece={piece}
              onOpenLightbox={(img) => {
                setLightboxImage(img);
                setIsLightboxOpen(true);
              }}
              onOpenAppointment={() => setIsAppointmentModalOpen(true)}
            />

            {similarPieces.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-border/80">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-300 block mb-1">
                      Living Archive
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                      More Masterpieces
                    </h3>
                  </div>
                  <Link
                    to="/masterpieces"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View All Masterpieces →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarPieces.map((item) => (
                    <Link
                      key={item._id || item.id}
                      to={`/masterpieces/${item._id || item.id}`}
                      className="group rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-amber-500/50 transition-colors shadow-2xs"
                    >
                      <div className="aspect-square w-full overflow-hidden bg-muted/20">
                        <img
                          src={item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '/assets/products/choker-ruby-01.jpg'}
                          alt={item.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                          {item.purity || '22K'} Gold
                        </span>
                        <p className="font-serif text-xs font-semibold text-foreground truncate group-hover:underline">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MasterpieceLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={lightboxImage}
        title={piece?.title}
      />

      <BespokeAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        piece={piece}
      />
    </div>
  );
}

export default MasterpieceDetailPage;
