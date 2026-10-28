import React from 'react';
import { MessageSquare, Pencil, Trash2, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function GalleryProductCard({ item, onEdit, onDelete, onInspectReviews }) {
  const reviewCount = item.reviewCount ?? item.reviews?.length ?? 0;
  const rating = Number(item.averageRating || 0);

  return (
    <div className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-foreground/40 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2.5 left-2.5 z-10">
          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider backdrop-blur-md bg-background/90 shadow-xs">
            {item.category || 'Bridal Sets'}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => onInspectReviews?.(item)}
          className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-xs font-mono border border-border/80 shadow-xs hover:bg-background transition-colors cursor-pointer"
          title="Inspect verified customer reviews"
        >
          <MessageSquare className="size-3" />
          <span>{reviewCount}</span>
        </button>

        {rating > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h4 className="font-serif text-sm sm:text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          {item.description ? (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic mt-1">
              Bespoke artisanal design
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-muted-foreground inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onInspectReviews?.(item)}
              className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
              title="View customer appraisals"
            >
              <MessageSquare className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(item)}
              className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Edit masterpiece details"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(item)}
              className="size-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
              title="Delete piece from catalog"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
