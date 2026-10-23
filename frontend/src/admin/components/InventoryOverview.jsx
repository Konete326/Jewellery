import { Sparkles, ArrowUpRight } from 'lucide-react'

const catalog = [
  {
    name: "The Aurelian Sigil",
    specs: "18K Gold • Raw Diamond",
    price: "$4,200",
    stock: "1 of 1 Unique",
    status: "Available",
    image: "/images/product-thumb-01.jpg"
  },
  {
    name: "Tuscan Mist Drops",
    specs: "South Sea Pearls • Venetian Wire",
    price: "$2,850",
    stock: "3 pairs left",
    status: "Low Stock",
    image: "/images/product-thumb-02.jpg"
  },
  {
    name: "Etruscan Bangle",
    specs: "22K Solid Gold • Hand-carved",
    price: "$6,400",
    stock: "Made to order",
    status: "Bespoke",
    image: "/images/product-thumb-03.jpg"
  },
  {
    name: "Éclat Sculptural Ring",
    specs: "Platinum Wire • Hand-finished",
    price: "$420",
    stock: "8 pieces ready",
    status: "In Stock",
    image: "/images/product-thumb-04.jpg"
  }
]

export function InventoryOverview() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Atelier Masterpieces</h3>
          <p className="text-xs text-muted-foreground mt-0.5">High jewelry catalog & inventory availability</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
          Catalog Manager <ArrowUpRight className="size-3.5" />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {catalog.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-lg bg-surface-container overflow-hidden border border-border/40 shrink-0">
                <img src={item.image} alt={item.name} className="size-full object-cover" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground flex items-center gap-1.5">
                  {item.name}
                  {item.status === "Available" && <Sparkles className="size-3 text-amber-500" />}
                </div>
                <div className="text-xs text-muted-foreground">{item.specs}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm text-foreground">{item.price}</div>
              <span className={`inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full mt-1 ${
                item.status === "Available" ? "bg-amber-500/10 text-amber-600 border border-amber-300/30" :
                item.status === "Low Stock" ? "bg-orange-500/10 text-orange-600 border border-orange-300/30" :
                item.status === "Bespoke" ? "bg-purple-500/10 text-purple-600 border border-purple-300/30" :
                "bg-emerald-500/10 text-emerald-600 border border-emerald-300/30"
              }`}>
                {item.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
