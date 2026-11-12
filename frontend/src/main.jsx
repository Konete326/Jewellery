import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerPwaServiceWorker } from './pwaRegister'

window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

registerPwaServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
