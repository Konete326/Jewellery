import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, Clock } from 'lucide-react'
import { LumaSpin } from '@/components/ui/luma-spin'

export function RecentActivitiesList({
  orders = [],
  inquiries = [],
  products = [],
  reviews = [],
  loading = false
}) {
  const [filter, setFilter] = useState('All')

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently'
    const diffSeconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diffSeconds < 60) return 'Just now'
    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays}d ago`
    return new Date(dateStr).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
  }

  const activities = useMemo(() => {
    const list = []

    orders.forEach((o) => {
      list.push({
        id: `order-${o._id || o.orderNumber}`,
        type: 'Orders',
        hallmark: 'AU · ORDER',
        hallmarkColor: 'border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10',
        title: `Order ${o.orderNumber || 'KS-COMMISSION'}`,
        description: `${o.customer?.name || 'Customer'} placed order for ${o.items?.length || 1} item(s)`,
        date: o.createdAt || new Date().toISOString(),
        link: '/admin/orders',
        actionText: 'View Order'
      })
    })

    inquiries.forEach((i) => {
      list.push({
        id: `inquiry-${i._id}`,
        type: 'Inquiries',
        hallmark: 'BESPOKE',
        hallmarkColor: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/10',
        title: `Inquiry from ${i.customerName || 'Patron'}`,
        description: `${i.jewelryType || 'Fine Jewelry'} consultation — ${i.subject || 'Atelier request'}`,
        date: i.createdAt || new Date().toISOString(),
        link: '/admin/inquiries',
        actionText: 'Reply Inquiry'
      })
    })

    products.forEach((p) => {
      list.push({
        id: `prod-${p._id}`,
        type: 'Products',
        hallmark: 'AU · PIECE',
        hallmarkColor: 'border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10',
        title: `${p.title || 'Fine Jewelry Piece'}`,
        description: `${p.purity || '22K'} • ${p.category || 'Jewellery'} • ${p.isPublished ? 'Published' : 'Hidden Draft'}`,
        date: p.createdAt || p.updatedAt || new Date().toISOString(),
        link: '/admin/products',
        actionText: 'Edit Product'
      })
    })

    reviews.forEach((r) => {
      list.push({
        id: `rev-${r._id || Math.random()}`,
        type: 'Reviews',
        hallmark: 'APPRAISAL',
        hallmarkColor: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10',
        title: `${r.rating || 5}★ Appraisal by ${r.userName || 'Collector'}`,
        description: r.comment ? `"${r.comment.slice(0, 60)}..."` : 'Verified client appraisal',
        date: r.createdAt || new Date().toISOString(),
        link: '/admin/reviews',
        actionText: 'Moderate'
      })
    })

    return list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20)
  }, [orders, inquiries, products, reviews])

  const filteredActivities = useMemo(() => {
    if (filter === 'All') return activities
    return activities.filter((act) => act.type === filter)
  }, [activities, filter])

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
              Live Feed
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
              Atelier Operations
            </span>
          </div>
          <h3 className="font-serif text-base font-semibold text-foreground">
            Recent Activities
          </h3>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border/80 self-start sm:self-auto overflow-x-auto max-w-full">
          {['All', 'Orders', 'Inquiries', 'Products'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                filter === tab
                  ? 'bg-background shadow-2xs text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <LumaSpin size={24} />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center px-4 border border-dashed border-border/80 rounded-xl">
          <Activity className="size-6 text-muted-foreground/40 mb-2" />
          <h4 className="text-xs font-semibold text-foreground">No recent activity detected</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
            Client inquiries, orders placed, and product updates will stream here automatically.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {filteredActivities.slice(0, 8).map((act) => (
            <div
              key={act.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${act.hallmarkColor}`}>
                    {act.hallmark}
                  </span>
                  <h4 className="text-xs font-semibold text-foreground truncate font-sans">
                    {act.title}
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {act.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground/80 flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground/60" />
                  <span>{formatTimeAgo(act.date)}</span>
                </span>
                <Link
                  to={act.link}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-border/80 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer shadow-2xs"
                >
                  <span className="hidden sm:inline">{act.actionText}</span>
                  <ArrowRight className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
