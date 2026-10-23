import { MessageSquare, Calendar, Mail, ArrowRight } from 'lucide-react'

export function AtelierInquiries({ inquiries = [], loading = false }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Contacted':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300/40'
      case 'In Design':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40'
      case 'Closed':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/40'
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Bespoke Commissions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Custom jewelry inquiries and private appointments</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-300/30">
          {inquiries.length} Active {inquiries.length === 1 ? 'Request' : 'Requests'}
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground">Checking inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <MessageSquare className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">No bespoke inquiries</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Requests submitted through the Bespoke commission form will automatically arrive here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id || inq.email}
              className="p-3.5 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{inq.customerName}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" /> {inq.email}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{inq.jewelryType} • {inq.preferredMetal}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="font-semibold text-foreground">{inq.estimatedBudget}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${getStatusClass(inq.status)}`}>
                  {inq.status || 'Pending'}
                </span>
                <button className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center gap-1">
                  Details <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
