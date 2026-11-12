import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
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

const UserPanel = lazy(() => import('@/user/UserPanel').then(m => ({ default: m.UserPanel || m.default })))
const ShopPage = lazy(() => import('@/user/pages/ShopPage').then(m => ({ default: m.ShopPage || m.default })))
const MasterpiecesPage = lazy(() => import('@/user/pages/MasterpiecesPage').then(m => ({ default: m.MasterpiecesPage || m.default })))
const MasterpieceDetailPage = lazy(() => import('@/user/pages/MasterpieceDetailPage').then(m => ({ default: m.MasterpieceDetailPage || m.default })))
const ProductDetailPage = lazy(() => import('@/user/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage || m.default })))
const ReviewsPage = lazy(() => import('@/user/pages/ReviewsPage').then(m => ({ default: m.ReviewsPage || m.default })))
const RatesPage = lazy(() => import('@/user/pages/RatesPage'))
const AboutUsPage = lazy(() => import('@/user/pages/AboutUsPage'))
const ContactPage = lazy(() => import('@/user/pages/ContactPage'))
const AccountPage = lazy(() => import('@/user/pages/AccountPage').then(m => ({ default: m.AccountPage || m.default })))
const CheckoutPage = lazy(() => import('@/user/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage || m.default })))
const TrackOrderPage = lazy(() => import('@/user/pages/TrackOrderPage').then(m => ({ default: m.TrackOrderPage || m.default })))
const NotFoundPage = lazy(() => import('@/user/pages/NotFoundPage'))
const AdminPanel = lazy(() => import('@/admin/AdminPanel').then(m => ({ default: m.AdminPanel || m.default })))
const AuthPage = lazy(() => import('@/components/auth/AuthPage').then(m => ({ default: m.AuthPage || m.default })))

function PageSuspenseFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <LumaSpin variant="amber" size={32} />
    </div>
  )
}

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
          <Suspense fallback={<PageSuspenseFallback />}>
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
          </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
      {import.meta.env.VITE_ENABLE_AGENTATION === 'true' && <Agentation endpoint="http://localhost:4747" />}
    </LoadingProvider>
  )
}
