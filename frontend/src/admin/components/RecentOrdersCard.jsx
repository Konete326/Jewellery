import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PackageCheck, ShoppingBag } from 'lucide-react'
import { LumaSpin } from '@/components/ui/luma-spin'

export function RecentOrdersCard({ orders = [], loading = false }) {
  const recentOrders = orders.slice(0, 5)

  const formatPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const getStatusStyle = (status) => {
    const s = (status || 'Pending').toLowerCase()
    if (s === 'delivered' || s === 'completed') {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
    if (s === 'processing' || s === 'handcrafted') {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    }
    if (s === 'cancelled' || s === 'failed') {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    }
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
            Atelier Commissions
          </span>
          <h3 className="font-serif text-base font-semibold text-foreground">
            Recent Orders
          </h3>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span>All Orders ({orders.length})</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <LumaSpin size={24} />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center px-4 border border-dashed border-border/80 rounded-xl">
          <ShoppingBag className="size-6 text-muted-foreground/40 mb-2" />
          <h4 className="text-xs font-semibold text-foreground">No orders recorded yet</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
            Client orders placed via store checkout or bespoke invoices will appear here.
          </p>
          <Link
            to="/admin/orders"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer shadow-2xs"
          >
            <span>Open Orders Registry</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentOrders.map((order) => (
            <Link
              key={order._id || order.orderNumber}
              to="/admin/orders"
              className="group block p-3 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/15 hover:bg-muted/30 transition-all duration-150"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                  {order.orderNumber || 'KS-ORDER'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getStatusStyle(order.orderStatus)}`}>
                  {order.orderStatus || 'Pending'}
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground truncate">
                  {order.customer?.name || 'Customer'}
                </span>
                <span className="font-mono font-bold text-foreground shrink-0">
                  {formatPKR(order.totalAmount)}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
                <span>
                  {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                </span>
                <span>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
