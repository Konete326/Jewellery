import { cn } from '@/lib/utils'

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-lg min-h-48 w-full bg-muted/60 border border-border" />
      <div className="rounded-lg min-h-48 w-full bg-muted/60 border border-border" />
      <div className="rounded-lg min-h-48 w-full bg-muted/60 border border-border" />
      <div className="rounded-lg min-h-48 w-full bg-muted/60 border border-border" />
      <div className="rounded-lg col-span-2 min-h-80 lg:col-span-2 bg-muted/60 border border-border" />
      <div className="rounded-lg col-span-2 min-h-80 lg:col-span-2 bg-muted/60 border border-border" />
      <div className="rounded-lg col-span-2 min-h-96 lg:col-span-4 bg-muted/60 border border-border" />
    </div>
  )
}
