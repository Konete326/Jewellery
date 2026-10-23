import { Sparkles, Package, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function InventoryOverview({ products = [], loading = false }) {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Atelier Masterpieces</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Database jewelry catalog & inventory</p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
          {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <Package className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">Catalog is empty</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            No jewelry pieces currently stored in the database.
          </p>
          <Link
            to="/admin"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add First Piece</span>
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {products.slice(0, 5).map((item) => (
            <div
              key={item._id || item.slug}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg bg-surface-container overflow-hidden border border-border/40 shrink-0 flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} className="size-full object-cover" />
                  ) : (
                    <Sparkles className="size-4 text-amber-500/60" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground flex items-center gap-1.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.metal} • {item.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-foreground">{formatPrice(item.price)}</div>
                <span className="inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full mt-1 bg-emerald-500/10 text-emerald-600 border border-emerald-300/30">
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
