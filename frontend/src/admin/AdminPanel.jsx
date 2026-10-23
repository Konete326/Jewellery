import { AppShell } from '@/components/app-shell'
import { DashboardOverview } from './components/DashboardOverview'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AdminPanel() {
  return (
    <TooltipProvider>
      <AppShell>
        <DashboardOverview />
      </AppShell>
    </TooltipProvider>
  )
}
