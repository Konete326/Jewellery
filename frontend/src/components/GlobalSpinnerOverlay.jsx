import { useGlobalLoading } from '@/context/LoadingContext';
import { LumaSpin } from '@/components/ui/luma-spin';

export function GlobalSpinnerOverlay() {
  const { isLoading } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in pointer-events-none"
    >
      <div className="p-3 rounded-2xl bg-neutral-950/85 border border-amber-500/25 shadow-xl backdrop-blur-md flex items-center justify-center pointer-events-auto">
        <LumaSpin variant="amber" size={28} />
      </div>
    </div>
  );
}
