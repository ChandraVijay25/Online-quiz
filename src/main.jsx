import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-card-hover)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-hover)',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
            },
            success: { iconTheme: { primary: '#10d98e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ff5a5a', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
