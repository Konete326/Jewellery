import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/google-icon';
import { getAuthUser, loginWithGoogle } from '@/lib/auth';
import { getLocalVaultIds, toggleVaultPiece, fetchVaultFullItems } from '@/lib/wishlist';
import { getPersonalizedWhatsAppInquiry } from '@/utils/whatsapp';
import { STORE_INFO } from '@/constants/storeInfo';
import { toast } from 'sonner';

export function AtelierVaultDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getAuthUser());
  const [googleLoading, setGoogleLoading] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const fullList = await fetchVaultFullItems();
      if (fullList && fullList.length) {
        setItems(fullList);
      } else {
        const localIds = getLocalVaultIds();
        if (localIds.length > 0) {
          const res = await fetch('/api/gallery').then((r) => r.json()).catch(() => null);
          const all = res?.data?.items || res?.data || [];
          const filtered = all.filter((p) => localIds.includes(String(p._id || p.id)));
          setItems(filtered);
        } else {
          setItems([]);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUser(getAuthUser());
      loadItems();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleVaultChange = () => {
      if (isOpen) loadItems();
    };
    const handleAuthChange = (e) => {
      setUser(e.detail || getAuthUser());
      if (isOpen) loadItems();
    };

    window.addEventListener('khalil_vault_change', handleVaultChange);
    window.addEventListener('khalil_auth_change', handleAuthChange);

    return () => {
      window.removeEventListener('khalil_vault_change', handleVaultChange);
      window.removeEventListener('khalil_auth_change', handleAuthChange);
    };
  }, [isOpen]);

  const handleRemove = async (piece) => {
    await toggleVaultPiece(piece);
    setItems((prev) => prev.filter((p) => String(p._id || p.id) !== String(piece._id || piece.id)));
  };

  const handleGoogleConnect = async () => {
    try {
      setGoogleLoading(true);
      const signedIn = await loginWithGoogle();
      setUser(signedIn);
      toast.success(`Vault linked to ${signedIn.name}`, {
        description: 'Your saved pieces are now preserved on Google'
      });
      loadItems();
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google Sign-In failed', { description: err.message });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInquireAllWhatsApp = () => {
    if (!items.length) return;
    const userName = user?.name ? `I am *${user.name}*` : 'A customer';
    const lines = items.map(
      (p, i) => `${i + 1}. *${p.title}* (${p.category || 'Jewellery'}) - KS-${String(p._id || p.id).slice(-6).toUpperCase()}`
    );
    const msg = `Hello Khalil & Sons, ${userName}. I would like to inquire about my saved Atelier Vault pieces:\n\n${lines.join('\n')}\n\nPlease share price estimates, gold purity, and viewing appointments.`;
    window.open(STORE_INFO.whatsapp.inquiryUrl(msg), '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
      >
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Heart className="size-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Atelier Vault
              </h3>
              <p className="text-[11px] text-muted-foreground -mt-0.5">
                {items.length} saved {items.length === 1 ? 'heirloom' : 'heirlooms'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {!user && (
          <div className="px-5 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-border/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="size-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
              <span className="text-foreground truncate text-[11px]">
                Sync vault with Google to access across devices
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={googleLoading}
              onClick={handleGoogleConnect}
              className="h-7 text-[11px] px-2.5 shrink-0 cursor-pointer"
            >
              <GoogleIcon className="size-3 mr-1.5" />
              <span>{googleLoading ? 'Linking...' : 'Link'}</span>
            </Button>
          </div>
        )}

        {user && (
          <div className="px-5 py-2.5 bg-muted/40 border-b border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span className="truncate text-[11px]">
              Vault linked to <strong>{user.name}</strong> ({user.email})
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 divide-y divide-border/60 space-y-4">
          {loading && (
            <div className="py-16 text-center text-xs text-muted-foreground">
              Loading saved pieces...
            </div>
          )}

          {!loading && !items.length && (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="size-14 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground">
                <Heart className="size-6 text-muted-foreground/60" />
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-foreground">
                  Your Vault is Empty
                </h4>
                <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  Save your favorite bridal necklaces, polki sets, and gold bangles to compare and inquire privately.
                </p>
              </div>
              <Button
                asChild
                size="sm"
                onClick={onClose}
                className="mt-2 bg-foreground text-background text-xs uppercase tracking-widest"
              >
                <Link to="/gallery">Explore Collections</Link>
              </Button>
            </div>
          )}

          {!loading &&
            items.map((piece) => {
              const waUrl = getPersonalizedWhatsAppInquiry({ piece });
              const pieceId = piece._id || piece.id;

              return (
                <div key={pieceId} className="pt-4 first:pt-0 flex items-center gap-3.5 group">
                  <Link
                    to={`/gallery/${pieceId}`}
                    onClick={onClose}
                    className="shrink-0 relative overflow-hidden rounded-xl size-18 border border-border bg-muted/30"
                  >
                    <img
                      src={piece.imageUrl || piece.src}
                      alt={piece.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block truncate">
                      {piece.category || 'Bridal Sets'}
                    </span>
                    <Link
                      to={`/gallery/${pieceId}`}
                      onClick={onClose}
                      className="font-serif text-sm font-semibold text-foreground hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {piece.title}
                    </Link>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      Ref: KS-{String(pieceId).slice(-6).toUpperCase()}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        <MessageCircle className="size-3" />
                        <span>Inquire</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleRemove(piece)}
                        aria-label="Remove piece from vault"
                        className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/20 space-y-2">
            <Button
              onClick={handleInquireAllWhatsApp}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageCircle className="size-4" />
              <span>Inquire All ({items.length}) on WhatsApp</span>
            </Button>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span>Personalized inquiry with goldsmith team</span>
              <button onClick={onClose} className="hover:text-foreground transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
