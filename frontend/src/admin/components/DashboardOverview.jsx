import { useState, useEffect } from 'react'
import { AdminMetrics } from './AdminMetrics'
import { AtelierInquiries } from './AtelierInquiries'
import { RecentGalleryShowcase } from './RecentGalleryShowcase'
import { RecentClientele } from './RecentClientele'
import { AdminReviewsList } from './AdminReviewsList'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { galleryApi } from '@/api/galleryApi'
import { fetchInquiries } from '@/api/inquiryApi'
import { usersApi } from '@/api/users.api'

export function DashboardOverview() {
  const [galleryItems, setGalleryItems] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [galleryRes, inqRes, usersRes] = await Promise.allSettled([
        galleryApi.getAll(),
        fetchInquiries(),
        usersApi.getAll()
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
    } catch {
      setGalleryItems([])
      setInquiries([])
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl border border-amber-500/20">
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <span>Live Storefront</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <AdminMetrics
        galleryItems={galleryItems}
        inquiries={inquiries}
        users={users}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
