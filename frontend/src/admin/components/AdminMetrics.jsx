import { DollarSign, ShoppingBag, Gem, Calendar, Activity } from 'lucide-react'

export function AdminMetrics({ orders = [], products = [], inquiries = [], loading = false }) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalRevenue)

  const metrics = [
    {
      title: "Total Atelier Revenue",
      value: loading ? "..." : formattedRevenue,
      subtext: loading ? "Loading..." : `${orders.length} completed transactions`,
      icon: DollarSign,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Jewelry Orders",
      value: loading ? "..." : `${orders.length}`,
      subtext: loading ? "Loading..." : "Total recorded commissions",
      icon: ShoppingBag,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Active Masterpieces",
      value: loading ? "..." : `${products.length}`,
      subtext: loading ? "Loading..." : "Catalog items in database",
      icon: Gem,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Bespoke Inquiries",
      value: loading ? "..." : `${inquiries.length}`,
      subtext: loading ? "Loading..." : "Customer consult requests",
      icon: Calendar,
      accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                {item.title}
              </span>
              <div className={`p-2 rounded-lg ${item.accent}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-semibold tracking-tight text-foreground font-mono">
                {item.value}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="size-3 text-muted-foreground" />
                <span>{item.subtext}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
