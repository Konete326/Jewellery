import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { GalleryProductCard } from './GalleryProductCard';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';

export function GalleryCarouselShowcase({
  items = [],
  onEdit,
  onDelete,
  onInspectReviews,
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Masterpieces Showcase Carousel
            </h3>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {items.length} Slides
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Swipe or use arrows to navigate through the curated jewellery cards.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          <span>Interactive Preview</span>
        </div>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: items.length > 3,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item._id}
              className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="h-full py-1">
                <GalleryProductCard
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onInspectReviews={onInspectReviews}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 size-8 text-foreground hover:bg-muted cursor-pointer" />
          <CarouselNext className="static translate-y-0 size-8 text-foreground hover:bg-muted cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
}
