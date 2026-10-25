import { useState, useEffect } from 'react'
import { AdminMetrics } from './AdminMetrics'
import { RecentOrdersTable } from './RecentOrdersTable'
import { InventoryOverview } from './InventoryOverview'
import { AtelierInquiries } from './AtelierInquiries'
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '@/api/orderApi'
import { fetchProducts } from '@/api/productApi'
import { fetchInquiries } from '@/api/inquiryApi'

export function DashboardOverview() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [orderRes, prodRes, inqRes] = await Promise.allSettled([
        fetchOrders(),
        fetchProducts(),
        fetchInquiries()
      ])

      if (orderRes.status === 'fulfilled' && orderRes.value?.data?.items) {
        setOrders(orderRes.value.data.items)
      }
      if (prodRes.status === 'fulfilled' && prodRes.value?.data?.items) {
        setProducts(prodRes.value.data.items)
      }
      if (inqRes.status === 'fulfilled' && inqRes.value?.data?.items) {
        setInquiries(inqRes.value.data.items)
      }
    } catch {
      setOrders([])
      setProducts([])
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Executive Overview
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time management for artisan crafting, bespoke orders, and client commissions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <span>Live Storefront</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <AdminMetrics orders={orders} products={products} inquiries={inquiries} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentOrdersTable orders={orders} loading={loading} />
          <AtelierInquiries inquiries={inquiries} loading={loading} onRefresh={loadDashboardData} />
        </div>
        <div className="space-y-6">
          <InventoryOverview products={products} loading={loading} onRefresh={loadDashboardData} />
        </div>
      </div>
    </div>
  )
}
