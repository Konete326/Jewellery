import { useState } from 'react'
import { Eye, CheckCircle2, Hammer, Truck, ShoppingBag, Clock } from 'lucide-react'

export function RecentOrdersTable({ orders = [], loading = false }) {
  const [filter, setFilter] = useState("All")
  const filtered = filter === "All" ? orders : orders.filter((o) => o.orderStatus === filter)

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return { cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/40', icon: Hammer }
      case 'Shipped':
        return { cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300/40', icon: Truck }
      case 'Delivered':
        return { cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40', icon: CheckCircle2 }
      default:
        return { cls: 'bg-muted text-muted-foreground border-border', icon: Clock }
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Recent Atelier Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live orders synchronized with the database</p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs overflow-x-auto">
          {["All", "Received", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === tab ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Synchronizing orders...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <ShoppingBag className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">No orders recorded yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Client purchases placed via the boutique storefront will immediately appear here.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((order) => {
                const { cls, icon: StatusIcon } = getStatusBadge(order.orderStatus)
                return (
                  <tr key={order._id || order.orderNumber} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs font-medium text-foreground">{order.orderNumber}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{order.customer?.name || 'Anonymous'}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-foreground text-xs">{order.items?.[0]?.title || 'Masterpiece'}</div>
                      {order.items?.length > 1 && (
                        <div className="text-[11px] text-muted-foreground">+{order.items.length - 1} more</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground text-xs">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}>
                        <StatusIcon className="size-3" />
                        {order.orderStatus || 'Received'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
