import { Gem, MessageSquare, Clock, Users, Activity } from 'lucide-react'

export function AdminMetrics({ galleryItems = [], inquiries = [], users = [], loading = false }) {
  const pendingInquiries = inquiries.filter(
    (i) => (i.status || 'Pending').toLowerCase() === 'pending'
  ).length

  const metrics = [
    {
      title: "Gallery Masterpieces",
      value: loading ? "..." : `${galleryItems.length}`,
      subtext: loading ? "Loading..." : "Published fine jewelry pieces",
      icon: Gem,
      accent: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
    },
    {
      title: "Atelier Inquiries",
      value: loading ? "..." : `${inquiries.length}`,
      subtext: loading ? "Loading..." : "Total customer consultations",
      icon: MessageSquare,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Pending Appraisals",
      value: loading ? "..." : `${pendingInquiries}`,
      subtext: loading ? "Loading..." : "Awaiting bespoke response",
      icon: Clock,
      accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      title: "Registered Clientele",
      value: loading ? "..." : `${users.length}`,
      subtext: loading ? "Loading..." : "Verified collectors & patrons",
      icon: Users,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
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
