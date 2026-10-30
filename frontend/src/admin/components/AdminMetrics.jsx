import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function AdminMetrics({
  products = [],
  categories = [],
  rates = null,
  inquiries = [],
  orders = [],
  users = [],
  loading = false
}) {
  const totalProducts = products.length
  const publishedProducts = products.filter((p) => p.isPublished).length
  const unpublishedProducts = totalProducts - publishedProducts

  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.isActive !== false).length

  const gold24kTola = rates?.gold?.['24K']?.tola || 419000
  const gold22kGram = rates?.gold?.['22K']?.gram || Math.round((gold24kTola / 11.6638) * (22 / 24))
  const marketStatus = rates?.marketStatus || 'Open'

  const pendingInquiries = inquiries.filter(
    (i) => (i.status || 'Pending').toLowerCase() === 'pending'
  ).length
  const totalInquiries = inquiries.length

  const pendingOrders = orders.filter((o) => {
    const s = (o.orderStatus || 'Pending').toLowerCase()
    return s === 'pending' || s === 'received' || s === 'processing'
  }).length
  const totalOrders = orders.length

  const totalCustomers = users.length
  const adminUsersCount = users.filter((u) => u.role === 'admin').length
  const patronUsersCount = totalCustomers - adminUsersCount

  const formatPKR = (val) => {
    return new Intl.NumberFormat('en-PK', {
      maximumFractionDigits: 0
    }).format(val || 0)
  }

  const metricCards = [
    {
      title: 'Jewellery Products',
      hallmark: 'AU · 916.6',
      hallmarkColor: 'border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10',
      value: loading ? '—' : `${totalProducts}`,
      primaryLabel: 'Catalog Items',
      breakdown: loading ? 'Loading...' : `${publishedProducts} Published • ${unpublishedProducts} Hidden`,
      shortcutText: 'Manage Products',
      link: '/admin/products'
    },
    {
      title: 'Atelier Categories',
      hallmark: 'COLLECTIONS',
      hallmarkColor: 'border-neutral-500/20 text-neutral-700 dark:text-neutral-300 bg-neutral-500/10',
      value: loading ? '—' : `${totalCategories}`,
      primaryLabel: 'Active Collections',
      breakdown: loading ? 'Loading...' : `${activeCategories} Live on Storefront`,
      shortcutText: 'Manage Categories',
      link: '/admin/categories'
    },
    {
      title: 'Current Gold Rates',
      hallmark: 'AU · 999.0 LIVE',
      hallmarkColor: 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10',
      value: loading ? '—' : `Rs. ${formatPKR(gold24kTola)}`,
      primaryLabel: '24K Sarafa Tola',
      breakdown: loading ? 'Loading...' : `22K: Rs. ${formatPKR(gold22kGram)}/g • ${marketStatus}`,
      shortcutText: 'Sarafa Bullion Board',
      link: '/admin/rates'
    },
    {
      title: 'Pending Inquiries',
      hallmark: 'BESPOKE',
      hallmarkColor: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/10',
      value: loading ? '—' : `${pendingInquiries}`,
      primaryLabel: 'Awaiting Response',
      breakdown: loading ? 'Loading...' : `${totalInquiries} Total client consultations`,
      shortcutText: 'Respond Inquiries',
      link: '/admin/inquiries'
    },
    {
      title: 'Pending Orders',
      hallmark: 'ORDERS',
      hallmarkColor: 'border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10',
      value: loading ? '—' : `${pendingOrders}`,
      primaryLabel: 'In Handcraft / Review',
      breakdown: loading ? 'Loading...' : `${totalOrders} Total orders registered`,
      shortcutText: 'Process Orders',
      link: '/admin/orders'
    },
    {
      title: 'Registered Clientele',
      hallmark: 'CLIENTELE',
      hallmarkColor: 'border-stone-500/30 text-stone-700 dark:text-stone-300 bg-stone-500/10',
      value: loading ? '—' : `${totalCustomers}`,
      primaryLabel: 'Patrons & Collectors',
      breakdown: loading ? 'Loading...' : `${patronUsersCount} Patrons • ${adminUsersCount} Administrators`,
      shortcutText: 'View Clientele Directory',
      link: '/admin/customers'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {metricCards.map((card) => (
        <Link
          key={card.title}
          to={card.link}
          className="group rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-foreground/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
                {card.title}
              </span>
              <span className={`text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border ${card.hallmarkColor}`}>
                {card.hallmark}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                {card.primaryLabel}
              </div>
            </div>

            <div className="mt-2 text-[11px] text-muted-foreground/85 border-t border-border/50 pt-2 truncate">
              {card.breakdown}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
            <span className="text-[11px] tracking-tight">{card.shortcutText}</span>
            <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  )
}
