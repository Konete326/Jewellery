import { Link } from 'react-router-dom'
import { Users, ShieldCheck, Mail, ArrowRight } from 'lucide-react'
import { LumaSpin } from '@/components/ui/luma-spin'

export function RecentClientele({ users = [], loading = false }) {
  const recentUsers = users.slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight font-serif">
            Atelier Clientele
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registered patrons & collectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            {users.length} {users.length === 1 ? 'Patron' : 'Patrons'}
          </span>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <span>Directory</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <LumaSpin variant="amber" size={40} />
          <span>Loading patron roster...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center px-4">
          <div className="p-3 rounded-full bg-muted/50 border border-border/60 mb-3 text-muted-foreground">
            <Users className="size-5" />
          </div>
          <h4 className="text-sm font-medium text-foreground">No patrons registered</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Client registrations via Google Auth or direct account creation will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {recentUsers.map((client) => {
            const isGoogle = client.authProvider === 'google'
            const isAdmin = client.role === 'admin'

            return (
              <div
                key={client._id || client.email}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-serif font-semibold text-xs flex items-center justify-center shrink-0">
                    {(client.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs text-foreground truncate">
                        {client.name || 'Anonymous Collector'}
                      </span>
                      {isAdmin && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-mono">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {client.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isGoogle ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      Google
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                      <Mail className="size-2.5" />
                      Email
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
