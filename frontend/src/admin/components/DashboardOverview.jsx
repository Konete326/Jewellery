import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Layers,
  TrendingUp,
  PackageCheck,
  MessageSquare,
  Users
} from 'lucide-react'
import { AdminMetrics } from './AdminMetrics'
import { RecentActivitiesList } from './RecentActivitiesList'
import { RecentOrdersCard } from './RecentOrdersCard'
import { AtelierInquiries } from './AtelierInquiries'
import { RecentClientele } from './RecentClientele'
import { AdminReviewsList } from './AdminReviewsList'
import { fetchProducts } from '@/api/productApi'
import { fetchCategories } from '@/api/categoryApi'
import { ratesApi } from '@/api/ratesApi'
import { fetchInquiries } from '@/api/inquiryApi'
import { fetchOrders } from '@/api/orderApi'
import { usersApi } from '@/api/users.api'
import { galleryApi } from '@/api/galleryApi'
import { toast } from 'sonner'

export function DashboardOverview() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [rates, setRates] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAllDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [
        prodRes,
        catRes,
        ratesRes,
        inqRes,
        ordersRes,
        usersRes,
        revRes
      ] = await Promise.allSettled([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
        ratesApi.getRates(),
        fetchInquiries({ limit: 50 }),
        fetchOrders({ limit: 50 }),
        usersApi.getAll(),
        galleryApi.getRecentReviews(10)
      ])

      if (prodRes.status === 'fulfilled') {
        const pList = prodRes.value?.data?.items || prodRes.value?.data || []
        setProducts(Array.isArray(pList) ? pList : [])
      }

      if (catRes.status === 'fulfilled') {
        const cList = catRes.value?.data || []
        setCategories(Array.isArray(cList) ? cList : [])
      }

      if (ratesRes.status === 'fulfilled') {
        setRates(ratesRes.value?.data || null)
      }

      if (inqRes.status === 'fulfilled') {
        const iList = inqRes.value?.data?.items || inqRes.value?.data || []
        setInquiries(Array.isArray(iList) ? iList : [])
      }

      if (ordersRes.status === 'fulfilled') {
        const oList = ordersRes.value?.data?.items || ordersRes.value?.data || []
        setOrders(Array.isArray(oList) ? oList : [])
      }

      if (usersRes.status === 'fulfilled') {
        const uList = usersRes.value?.data || []
        setUsers(Array.isArray(uList) ? uList : [])
      }

      if (revRes.status === 'fulfilled') {
        const rList = revRes.value?.data || []
        setReviews(Array.isArray(rList) ? rList : [])
      }
    } catch {
      toast.error('Unable to synchronize atelier dashboard')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllDashboardData()
  }, [loadAllDashboardData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 sm:p-5 rounded-2xl border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
              Executive Management
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
              Karachi Sarafa Atelier
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-foreground">
            Atelier Command Center
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synchronized live with products, categories, Sarafa bullion board, client orders, and clientele.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadAllDashboardData(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync All</span>
          </button>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-2xs"
          >
            <span>Storefront</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/60">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
            Quick Action Shortcuts
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Direct Section Navigation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <ShoppingBag className="size-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="truncate">Products</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <Layers className="size-3.5 text-neutral-600 dark:text-neutral-300 shrink-0" />
            <span className="truncate">Categories</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/rates"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Gold Rates</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <PackageCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Orders</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/inquiries"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <MessageSquare className="size-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="truncate">Inquiries</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/customers"
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 hover:border-foreground/30 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground group"
          >
            <Users className="size-3.5 text-stone-600 dark:text-stone-300 shrink-0" />
            <span className="truncate">Clientele</span>
            <ArrowRight className="size-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>

      <AdminMetrics
        products={products}
        categories={categories}
        rates={rates}
        inquiries={inquiries}
        orders={orders}
        users={users}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivitiesList
            orders={orders}
            inquiries={inquiries}
            products={products}
            reviews={reviews}
            loading={loading}
          />
          <AtelierInquiries
            inquiries={inquiries}
            loading={loading}
            onRefresh={() => loadAllDashboardData(true)}
          />
        </div>

        <div className="space-y-6">
          <RecentOrdersCard
            orders={orders}
            loading={loading}
          />
          <RecentClientele
            users={users}
            loading={loading}
          />
        </div>
      </div>

      <AdminReviewsList />
    </div>
  )
}
