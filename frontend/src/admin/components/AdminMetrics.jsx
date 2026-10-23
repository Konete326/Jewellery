import { DollarSign, ShoppingBag, Sparkles, Calendar, TrendingUp } from 'lucide-react'

const metrics = [
  {
    title: "Total Atelier Revenue",
    value: "$128,450.00",
    change: "+14.8% from last month",
    isPositive: true,
    icon: DollarSign,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  },
  {
    title: "Jewelry Orders",
    value: "48 Orders",
    change: "+8.2% new commissions",
    isPositive: true,
    icon: ShoppingBag,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Active Masterpieces",
    value: "34 Pieces",
    change: "3 limited editions left",
    isPositive: true,
    icon: Sparkles,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
  {
    title: "Bespoke Inquiries",
    value: "8 Requests",
    change: "3 awaiting consultation",
    isPositive: false,
    icon: Calendar,
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
  }
]

export function AdminMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-shadow duration-200"
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
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {item.value}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className={item.isPositive ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-amber-600 font-medium"}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
