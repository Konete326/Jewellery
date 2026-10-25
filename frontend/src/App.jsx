import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserPanel } from '@/user/UserPanel'
import { GalleryPage } from '@/user/pages/GalleryPage'
import { GalleryDetailPage } from '@/user/pages/GalleryDetailPage'
import { ReviewsPage } from '@/user/pages/ReviewsPage'
import { AboutUsPage } from '@/user/pages/AboutUsPage'
import { ContactPage } from '@/user/pages/ContactPage'
import { AdminPanel } from '@/admin/AdminPanel'
import { AuthPage } from '@/components/auth/AuthPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { GoogleOneTapOverlay } from '@/components/auth/GoogleOneTapOverlay'
import { Toaster } from '@/components/ui/sonner'
import { Agentation } from 'agentation'

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <GoogleOneTapOverlay />
        <Routes>
          <Route path="/" element={<UserPanel />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<GalleryDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about-us-page-30" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </>
  )
}
