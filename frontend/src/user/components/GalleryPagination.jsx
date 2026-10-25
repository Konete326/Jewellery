import React, { useEffect, useRef } from "react";
import { Loader2, ChevronDown, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

export function GalleryPagination({
  hasMore = false,
  isLoading = false,
  onLoadMore,
  total = 0,
  loadedCount = 0,
  autoLoadOnScroll = false,
  className
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!autoLoadOnScroll || !hasMore || isLoading || !onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "250px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [autoLoadOnScroll, hasMore, isLoading, onLoadMore]);

  const percentage = total > 0 ? Math.min(100, Math.round((loadedCount / total) * 100)) : 100;

  return (
    <div className={cn("mt-14 flex flex-col items-center justify-center space-y-4", className)}>
      <div className="flex flex-col items-center gap-2 max-w-xs w-full text-center">
        <span className="text-xs uppercase tracking-widest text-[#5a6061] font-mono font-medium">
          Showing {loadedCount} of {total} Masterpieces
        </span>
        <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div ref={sentinelRef} className="h-1 w-full" />

      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-300 bg-white text-xs uppercase tracking-widest font-mono font-medium text-[#2d3435] transition-all duration-300 hover:border-amber-500 hover:text-amber-700 hover:shadow-md active:scale-98 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin text-amber-600" />
              <span>Unveiling Masterpieces...</span>
            </>
          ) : (
            <>
              <span>Load More Masterpieces</span>
              <ChevronDown className="size-3.5 text-amber-600 transition-transform duration-300 group-hover:translate-y-0.5" />
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-3 pt-4 text-[#8a9091]">
          <span className="h-px w-12 bg-neutral-300" />
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-mono">
            <Gem className="size-3 text-amber-600/70" />
            <span>Archive Completely Displayed</span>
          </div>
          <span className="h-px w-12 bg-neutral-300" />
        </div>
      )}
    </div>
  );
}
