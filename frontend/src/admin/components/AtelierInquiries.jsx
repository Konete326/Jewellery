import { MessageSquare, Calendar, Mail, ArrowRight } from 'lucide-react'

const inquiries = [
  {
    id: 1,
    client: "Sophia Al-Mansoor",
    email: "sophia@example.com",
    request: "Bespoke 24K Florentine Wedding Band with Emeralds",
    budget: "$8,500+",
    date: "Today, 10:30 AM",
    status: "Consultation Booked"
  },
  {
    id: 2,
    client: "Lord Alexander Bennett",
    email: "bennett@estate.co.uk",
    request: "Restoration of Antique Victorian Diamond Brooch",
    budget: "$4,000 - $6,000",
    date: "Yesterday",
    status: "Awaiting Review"
  },
  {
    id: 3,
    client: "Clara Montez",
    email: "clara.m@artisan.fr",
    request: "Custom Hammered Cuff Bracelet with Raw Sapphire",
    budget: "$5,200",
    date: "20 Oct 2026",
    status: "Proposal Sent"
  }
]

export function AtelierInquiries() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Bespoke Commissions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Custom jewelry inquiries and private appointments</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-300/30">
          3 Active Requests
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="p-3.5 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{inq.client}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3" /> {inq.email}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{inq.request}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <span className="font-semibold text-foreground">{inq.budget}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" /> {inq.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${
                inq.status === "Consultation Booked" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40" :
                inq.status === "Awaiting Review" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/40" :
                "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300/40"
              }`}>
                {inq.status}
              </span>
              <button className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center gap-1">
                Details <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
