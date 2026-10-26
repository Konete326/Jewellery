import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gem, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { LumaSpin } from '@/components/ui/luma-spin'

export function RecentGalleryShowcase({ galleryItems = [], loading = false }) {
  const recentPieces = galleryItems.slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight font-serif">
            Atelier Masterpieces
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live gallery catalog on storefront
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            {galleryItems.length} {galleryItems.length === 1 ? 'Piece' : 'Pieces'}
          </span>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <Plus className="size-3.5" />
            <span>Manage Gallery</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <LumaSpin variant="amber" size={26} />
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">Gallery is empty</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            No jewelry pieces currently published to the boutique gallery.
          </p>
          <Link
            to="/admin/gallery"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <Plus className="size-3.5" />
            <span>Upload First Masterpiece</span>
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {recentPieces.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="size-12 rounded-lg bg-muted overflow-hidden border border-border/40 shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Gem className="size-5 text-muted-foreground/60" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-xs text-foreground truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-700 dark:text-amber-300 shrink-0">
                      {item.category || 'Jewellery'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/gallery/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  title="View on Storefront"
                  aria-label={`View ${item.title} on storefront`}
                >
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {galleryItems.length > 5 && (
            <div className="pt-2 text-center">
              <Link
                to="/admin/gallery"
                className="text-xs text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1"
              >
                <span>View all {galleryItems.length} masterpieces</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
