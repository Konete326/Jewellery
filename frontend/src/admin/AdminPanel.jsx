import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { DashboardOverview } from './components/DashboardOverview'
import { GalleryAdminView } from './components/GalleryAdminView'
import { InquiriesAdminView } from './components/InquiriesAdminView'
import { UsersAdminView } from './components/UsersAdminView'
import { TooltipProvider } from '@/components/ui/tooltip'
import { toast } from 'sonner'

export function AdminPanel() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const queryTab = searchParams.get('tab')
  const pathTab = location.pathname.replace(/^\/admin\/?/, '').split('/')[0]
  const activeTab = queryTab || pathTab || 'dashboard'

  useEffect(() => {
    const handleReviewEvent = (e) => {
      const data = e.detail;
      if (data) {
        toast.success(`New ${data.rating}★ Appraisal: ${data.pieceTitle || 'Masterpiece'}`, {
          description: `Submitted by ${data.userName || 'Collector'}${data.comment ? `: "${data.comment}"` : ''}`,
          duration: 8000
        });
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === 'khalil_latest_review_alert' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          toast.success(`New ${data.rating}★ Appraisal: ${data.pieceTitle || 'Masterpiece'}`, {
            description: `Submitted by ${data.userName || 'Collector'}${data.comment ? `: "${data.comment}"` : ''}`,
            duration: 8000
          });
        } catch {}
      }
    };

    window.addEventListener('khalil_review_added', handleReviewEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('khalil_review_added', handleReviewEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'inquiries':
        return <InquiriesAdminView />
      case 'gallery':
        return <GalleryAdminView />
      case 'customers':
      case 'users':
        return <UsersAdminView />
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
