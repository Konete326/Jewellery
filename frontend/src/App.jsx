import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserPanel } from '@/user/UserPanel'
import { AdminPanel } from '@/admin/AdminPanel'
import { AuthPage } from '@/components/auth/AuthPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPanel />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
