import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export function GalleryCardSkeleton({ ratio = 4 / 5, className }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-900 shadow-xs",
        className
      )}
    >
      <AspectRatio ratio={ratio} className="bg-neutral-900 relative size-full overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent animate-pulse" />
        <div className="absolute inset-x-0 bottom-0 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-neutral-800 animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-neutral-800 animate-pulse" />
          </div>
          <div className="h-5 w-3/4 rounded-md bg-neutral-800 animate-pulse" />
          <div className="h-3 w-full rounded-md bg-neutral-800/70 animate-pulse" />
        </div>
      </AspectRatio>
    </div>
  );
}
