import { useLocation } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { DashboardOverview } from './components/DashboardOverview'
import { GalleryAdminView } from './components/GalleryAdminView'
import { AdminPlaceholder } from './components/AdminPlaceholder'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Package, ShoppingBag, Users, UserCheck, Settings } from 'lucide-react'

export function AdminPanel() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const queryTab = searchParams.get('tab')
  const pathTab = location.pathname.replace(/^\/admin\/?/, '').split('/')[0]
  const activeTab = queryTab || pathTab || 'dashboard'

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        return <GalleryAdminView />
      case 'products':
        return (
          <AdminPlaceholder
            title="Products Catalog"
            category="Commerce"
            description="Manage high-jewelry masterpieces, precious gemstones, and handcrafted watches."
            icon={Package}
          />
        )
      case 'orders':
        return (
          <AdminPlaceholder
            title="Bespoke Orders"
            category="Commerce"
            description="Track client commissions, bespoke order pipelines, and luxury deliveries."
            icon={ShoppingBag}
          />
        )
      case 'customers':
        return (
          <AdminPlaceholder
            title="VIP Clientele"
            category="Commerce"
            description="Manage private appointments, atelier collectors, and bespoke clients."
            icon={Users}
          />
        )
      case 'profile':
        return (
          <AdminPlaceholder
            title="Artisan Profile"
            category="Account"
            description="Manage master artisan credentials, security keys, and atelier access."
            icon={UserCheck}
          />
        )
      case 'settings':
        return (
          <AdminPlaceholder
            title="Atelier Settings"
            category="System"
            description="Configure Cloudinary media storage, notification gateways, and currency rates."
            icon={Settings}
          />
        )
      case 'dashboard':
      default:
        return <DashboardOverview />
    }
  }

  return (
    <TooltipProvider>
      <AppShell>
        {renderContent()}
      </AppShell>
    </TooltipProvider>
  )
}
