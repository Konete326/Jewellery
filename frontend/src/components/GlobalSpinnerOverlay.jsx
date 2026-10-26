import { useGlobalLoading } from '@/context/LoadingContext';
import { LumaSpin } from '@/components/ui/luma-spin';

export function GlobalSpinnerOverlay() {
  const { isLoading, message } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-[3px] transition-opacity duration-200 animate-in fade-in"
    >
      <div className="bg-neutral-950/85 border border-amber-500/25 p-7 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs mx-4 backdrop-blur-md">
        <LumaSpin variant="amber" size={56} />
        <div className="space-y-1">
          <p className="text-[11px] tracking-[0.25em] font-serif text-amber-200/90 uppercase font-medium">
            Khalil & Sons
          </p>
          <p className="text-[11px] text-neutral-400 font-light">
            {message || 'Crafting Atelier Experience...'}
          </p>
        </div>
      </div>
    </div>
  );
}
