import { useState } from 'react'
import { Eye, CheckCircle2, Hammer, Truck } from 'lucide-react'

const initialOrders = [
  {
    id: "KS-9842",
    client: "Lady Eleanor Vance",
    piece: "The Aurelian Sigil",
    metal: "18K Hammered Gold",
    price: "$4,200",
    date: "23 Oct 2026",
    status: "In Atelier",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/40"
  },
  {
    id: "KS-9841",
    client: "Julian Thorne",
    piece: "Tuscan Mist Drops",
    metal: "South Sea Pearls",
    price: "$2,850",
    date: "22 Oct 2026",
    status: "Shipped",
    badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300/40"
  },
  {
    id: "KS-9840",
    client: "Genevieve Dupont",
    piece: "Etruscan Bangle",
    metal: "22K Solid Gold",
    price: "$6,400",
    date: "21 Oct 2026",
    status: "Completed",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40"
  },
  {
    id: "KS-9839",
    client: "Arthur Pendelton",
    piece: "Éclat Sculptural Ring",
    metal: "Platinum & Gold Wire",
    price: "$420",
    date: "20 Oct 2026",
    status: "Completed",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/40"
  }
]

export function RecentOrdersTable() {
  const [filter, setFilter] = useState("All")
  const filtered = filter === "All" ? initialOrders : initialOrders.filter((o) => o.status === filter)

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground text-base tracking-tight">Recent Atelier Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time status of commissioned handcrafted jewelry</p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
          {["All", "In Atelier", "Shipped", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filter === tab ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-3">Order ID</th>
              <th className="py-2.5 px-3">Client</th>
              <th className="py-2.5 px-3">Masterpiece</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-3 font-mono text-xs font-medium text-foreground">{order.id}</td>
                <td className="py-3 px-3 font-medium text-foreground">{order.client}</td>
                <td className="py-3 px-3">
                  <div className="font-medium text-foreground">{order.piece}</div>
                  <div className="text-xs text-muted-foreground">{order.metal}</div>
                </td>
                <td className="py-3 px-3 font-semibold text-foreground">{order.price}</td>
                <td className="py-3 px-3 text-xs text-muted-foreground">{order.date}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${order.badgeClass}`}>
                    {order.status === "In Atelier" && <Hammer className="size-3" />}
                    {order.status === "Shipped" && <Truck className="size-3" />}
                    {order.status === "Completed" && <CheckCircle2 className="size-3" />}
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
