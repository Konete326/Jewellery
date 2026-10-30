import { useState, useEffect } from 'react'
import { AdminMetrics } from './AdminMetrics'
import { AtelierInquiries } from './AtelierInquiries'
import { RecentGalleryShowcase } from './RecentGalleryShowcase'
import { RecentClientele } from './RecentClientele'
import { AdminReviewsList } from './AdminReviewsList'
import { RecentOrdersCard } from './RecentOrdersCard'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { galleryApi } from '@/api/galleryApi'
import { fetchInquiries } from '@/api/inquiryApi'
import { usersApi } from '@/api/users.api'
import { fetchOrders } from '@/api/orderApi'

export function DashboardOverview() {
  const [galleryItems, setGalleryItems] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [galleryRes, inqRes, usersRes, ordersRes] = await Promise.allSettled([
        galleryApi.getAll(),
        fetchInquiries(),
        usersApi.getAll(),
        fetchOrders({ limit: 10 })
      ])

      if (galleryRes.status === 'fulfilled' && galleryRes.value?.data) {
        setGalleryItems(galleryRes.value.data)
      }
      if (inqRes.status === 'fulfilled' && inqRes.value?.data?.items) {
        setInquiries(inqRes.value.data.items)
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        setUsers(usersRes.value.data)
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.items) {
        setOrders(ordersRes.value.data.items)
      }
    } catch {
      setGalleryItems([])
      setInquiries([])
      setOrders([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 bg-white dark:bg-card py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground font-serif">
            Atelier Executive Overview
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            Real-time management for artisan masterpieces, client appraisals, and clientele.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <span>Live Storefront</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <AdminMetrics
        products={galleryItems}
        inquiries={inquiries}
        orders={orders}
        users={users}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentOrdersCard orders={orders} loading={loading} />
          <AtelierInquiries
            inquiries={inquiries}
            loading={loading}
            onRefresh={loadDashboardData}
          />
          <AdminReviewsList />
        </div>
        <div className="space-y-6">
          <RecentGalleryShowcase
            galleryItems={galleryItems}
            loading={loading}
          />
          <RecentClientele
            users={users}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
