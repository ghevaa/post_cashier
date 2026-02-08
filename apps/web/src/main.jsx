import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug: Log environment variable (remove after fixing)
console.log('[PostKasir] VITE_API_URL:', import.meta.env.VITE_API_URL || 'NOT SET - using localhost fallback');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
