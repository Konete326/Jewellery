import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Plus, X, ExternalLink, ShieldCheck } from 'lucide-react';

export function GalleryBentoHero({ items = [], onOpenUpload, isUploadOpen = false }) {
  const totalCount = items.length;
  
  const categoryCounts = items.reduce((acc, it) => {
    const cat = it.category || 'Bridal Sets';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = items.reduce((sum, it) => sum + (it.reviewCount || it.reviews?.length || 0), 0);
  const ratedPieces = items.filter((it) => (it.averageRating || 0) > 0);
  const overallAvg = ratedPieces.length > 0
    ? (ratedPieces.reduce((sum, it) => sum + Number(it.averageRating), 0) / ratedPieces.length).toFixed(1)
    : '5.0';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
      <div
        className={cn(
          'bg-background border-border/80 relative w-full overflow-hidden rounded-xl border p-5 sm:p-6 shadow-xs',
          'supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
          'lg:col-span-5'
        )}
      >
        <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
          <div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 size-full mix-blend-overlay opacity-30',
                'bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)]',
                'bg-[size:24px]'
              )}
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 mb-4">
          <Badge variant="secondary" className="font-mono text-[11px] tracking-wider uppercase">
            Atelier Showcase
          </Badge>
          <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Storefront Synchronized</span>
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant={isUploadOpen ? 'outline' : 'default'}
              onClick={onOpenUpload}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              {isUploadOpen ? (
                <>
                  <X className="size-3.5" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>New Piece</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
                {totalCount}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                {totalCount === 1 ? 'Masterpiece' : 'Masterpieces'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed">
              Curated handcrafted heirloom jewellery pieces published to the live digital catalog with instant Cloudinary media synchronization.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {Object.entries(categoryCounts).slice(0, 4).map(([cat, count]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/60 border border-border/60 text-[10px] font-mono text-foreground"
              >
                <span>{cat}:</span>
                <span className="font-semibold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'bg-background border-border/80 relative overflow-hidden rounded-xl border p-5 shadow-xs flex flex-col justify-between',
          'supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
          'lg:col-span-3'
        )}
      >
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-wider">
            Patron Appraisals
          </Badge>
          <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-semibold">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            <span>{overallAvg}</span>
          </div>
        </div>

        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold text-foreground">
              {totalReviews}
            </span>
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
              Verified Reviews
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            Real-time client feedback and ratings attached to individual jewelry pieces.
          </p>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3 text-muted-foreground" />
            <span>Lifetime Hallmark</span>
          </span>
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Live Catalog</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

