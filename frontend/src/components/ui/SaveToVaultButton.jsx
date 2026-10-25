import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isPieceSavedInVault, toggleVaultPiece } from '@/lib/wishlist';
import { toast } from 'sonner';

export function SaveToVaultButton({
  piece,
  className = '',
  variant = 'icon',
  showText = false
}) {
  const pieceId = piece ? String(piece._id || piece.id || '') : '';
  const [saved, setSaved] = useState(isPieceSavedInVault(pieceId));
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!pieceId) return;
    setSaved(isPieceSavedInVault(pieceId));

    const handleVaultChange = (e) => {
      const ids = e.detail?.ids;
      if (Array.isArray(ids)) {
        setSaved(ids.includes(pieceId));
      } else {
        setSaved(isPieceSavedInVault(pieceId));
      }
    };

    window.addEventListener('khalil_vault_change', handleVaultChange);
    return () => window.removeEventListener('khalil_vault_change', handleVaultChange);
  }, [pieceId]);

  if (!piece) return null;

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    const res = await toggleVaultPiece(piece);
    setSaved(res.saved);

    if (res.saved) {
      toast.success('Saved to Atelier Vault', {
        description: `"${piece.title || 'Masterpiece'}" preserved in your collection.`
      });
    } else {
      toast.info('Removed from Vault', {
        description: `"${piece.title || 'Masterpiece'}" removed.`
      });
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={saved ? 'Remove from Atelier Vault' : 'Save to Atelier Vault'}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
          saved
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            : 'bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/80'
        } ${className}`}
      >
        <Heart
          className={`size-3.5 transition-transform ${
            saved ? 'fill-rose-500 text-rose-500' : 'text-current'
          } ${animating ? 'scale-125' : ''}`}
        />
        <span>{saved ? 'Saved in Vault' : 'Save to Vault'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={saved ? 'Remove from Atelier Vault' : 'Save to Atelier Vault'}
      className={`size-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xs ${
        saved
          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 hover:bg-rose-500/25'
          : 'bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:scale-105'
      } ${className}`}
    >
      <Heart
        className={`size-4 transition-transform ${
          saved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-current'
        } ${animating ? 'scale-130' : ''}`}
      />
      {showText && (
        <span className="text-xs ml-1.5 font-medium">
          {saved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
