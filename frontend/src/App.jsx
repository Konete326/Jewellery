import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
import { UserPanel } from '@/user/UserPanel'
import { ShopPage } from '@/user/pages/ShopPage'
import { MasterpiecesPage } from '@/user/pages/MasterpiecesPage'
import { MasterpieceDetailPage } from '@/user/pages/MasterpieceDetailPage'
import { ProductDetailPage } from '@/user/pages/ProductDetailPage'
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
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { LoadingProvider } from '@/context/LoadingContext'
import { Toaster } from '@/components/ui/sonner'
import { ScrollToTop } from '@/components/ScrollToTop'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { LumaSpin } from '@/components/ui/luma-spin'
import { fetchProductById } from '@/api/productApi'
import { galleryApi } from '@/api/galleryApi'
import { Agentation } from 'agentation'

function ShopRouteWrapper() {
  const { category } = useParams()
  return <ShopPage key={category || 'all'} />
}

function LegacyGalleryRedirect() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    async function resolveTarget() {
      try {
        const prodRes = await fetchProductById(id, { silent: true })
        if (!active) return
        if (prodRes?.data || prodRes?._id) {
          navigate(`/product/${id}`, { replace: true })
          return
        }
      } catch {}

      try {
        const galRes = await galleryApi.getById(id, { silent: true })
        if (!active) return
        if (galRes?.data) {
          if (galRes.data.isProduct) {
            navigate(`/product/${id}`, { replace: true })
          } else {
            navigate(`/masterpieces/${id}`, { replace: true })
          }
          return
        }
      } catch {}

      if (active) {
        navigate(`/masterpieces/${id}`, { replace: true })
      }
    }
    resolveTarget()
    return () => { active = false }
  }, [id, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LumaSpin variant="amber" size={32} />
    </div>
  )
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
        <RouteErrorBoundary>
          <Routes>
            <Route path="/" element={<UserPanel />} />
            <Route path="/shop" element={<ShopRouteWrapper />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/masterpieces" element={<MasterpiecesPage />} />
            <Route path="/masterpieces/:id" element={<MasterpieceDetailPage />} />
            <Route path="/gallery" element={<Navigate to="/masterpieces" replace />} />
            <Route path="/gallery/:id" element={<LegacyGalleryRedirect />} />
            <Route path="/collections" element={<ShopRouteWrapper />} />
            <Route path="/collections/:category" element={<ShopRouteWrapper />} />
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
        </RouteErrorBoundary>
      </BrowserRouter>
      {import.meta.env.VITE_ENABLE_AGENTATION === 'true' && <Agentation endpoint="http://localhost:4747" />}
    </LoadingProvider>
  )
}
