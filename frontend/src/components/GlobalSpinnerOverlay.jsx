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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in pointer-events-none"
    >
      <div className="p-2.5 rounded-xl bg-card/90 border border-border/70 shadow-lg backdrop-blur-md flex items-center justify-center pointer-events-auto">
        <LumaSpin variant="amber" size={20} />
      </div>
    </div>
  );
}
