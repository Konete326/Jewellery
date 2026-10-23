import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserPanel } from '@/user/UserPanel'
import { AdminPanel } from '@/admin/AdminPanel'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
