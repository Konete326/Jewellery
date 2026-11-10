import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { UserPanel } from '@/user/UserPanel'
import { ShopPage } from '@/user/pages/ShopPage'
import { GalleryPage } from '@/user/pages/GalleryPage'
import { GalleryDetailPage } from '@/user/pages/GalleryDetailPage'
import { ReviewsPage } from '@/user/pages/ReviewsPage'
import RatesPage from '@/user/pages/RatesPage'
import { AboutUsPage } from '@/user/pages/AboutUsPage'
import { ContactPage } from '@/user/pages/ContactPage'
import { AccountPage } from '@/user/pages/AccountPage'
import { CheckoutPage } from '@/user/pages/CheckoutPage'
import { TrackOrderPage } from '@/user/pages/TrackOrderPage'
import { NotFoundPage } from '@/user/pages/NotFoundPage'
import { AdminPanel } from '@/admin/AdminPanel'
import { AuthPage } from '@/components/auth/AuthPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { GoogleOneTapOverlay } from '@/components/auth/GoogleOneTapOverlay'
import { GlobalSpinnerOverlay } from '@/components/GlobalSpinnerOverlay'
import { LoadingProvider } from '@/context/LoadingContext'
import { Toaster } from '@/components/ui/sonner'
import { ScrollToTop } from '@/components/ScrollToTop'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { Agentation } from 'agentation'

function ShopRouteWrapper() {
  const { category } = useParams()
  return <ShopPage key={category || 'all'} />
}

export default function App() {
  return (
    <LoadingProvider>
      <Toaster position="top-right" richColors closeButton />
      <GlobalSpinnerOverlay />
      <PWAInstallPrompt />
      <BrowserRouter>
        <ScrollToTop />
        <GoogleOneTapOverlay />
        <Routes>
          <Route path="/" element={<UserPanel />} />
          <Route path="/shop" element={<ShopRouteWrapper />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/collections" element={<ShopRouteWrapper />} />
          <Route path="/collections/:category" element={<ShopRouteWrapper />} />
          <Route path="/gallery/:id" element={<GalleryDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/gold-rates" element={<RatesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about-us-page-30" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/order-tracking" element={<TrackOrderPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.VITE_ENABLE_AGENTATION === 'true' && <Agentation endpoint="http://localhost:4747" />}
    </LoadingProvider>
  )
}
