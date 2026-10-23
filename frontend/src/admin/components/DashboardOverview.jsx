import { AdminMetrics } from './AdminMetrics'
import { RecentOrdersTable } from './RecentOrdersTable'
import { InventoryOverview } from './InventoryOverview'
import { AtelierInquiries } from './AtelierInquiries'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-700 dark:text-amber-300 mb-2">
            <Sparkles className="size-3" />
            <span>Khalil & Sons • Haute Horlogerie & Jewelry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Executive Overview
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time management for artisan crafting, bespoke orders, and client commissions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <span>Live Storefront</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <AdminMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentOrdersTable />
          <AtelierInquiries />
        </div>
        <div className="space-y-6">
          <InventoryOverview />
        </div>
      </div>
    </div>
  )
}
