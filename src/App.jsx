import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'

// Layout components
import Navbar        from './components/Navbar'
import Sidebar       from './components/Sidebar'
import Chatbot       from './components/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Exams      from './pages/Exams'
import Exam       from './pages/Exam'
import Result     from './pages/Result'
import Results    from './pages/Results'
import Analytics  from './pages/Analytics'
import AdminPanel from './pages/AdminPanel'
import Settings   from './pages/Settings'

// Page transition wrapper
function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{ flex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Main app layout (with sidebar)
function AppLayout({ darkMode, toggleDark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: '100%' }}>
          <PageTransition>
            <Routes>
              {/* Student routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/exams" element={
                <ProtectedRoute><Exams /></ProtectedRoute>
              } />
              <Route path="/exam/:id" element={
                <ProtectedRoute><Exam /></ProtectedRoute>
              } />
              <Route path="/result" element={
                <ProtectedRoute><Result /></ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute><Results /></ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute><Analytics /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/admin/:section" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PageTransition>
        </main>
      </div>
      <Chatbot />
    </div>
  )
}

export default function App() {
  const { user }                    = useAuth()
  const [darkMode, setDarkMode]     = useState(true)

  const toggleDark = () => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle('light', d)  // add .light when turning OFF dark
      return !d
    })
  }

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

      {/* All protected routes wrapped in AppLayout */}
      <Route path="/*" element={
        user
          ? <AppLayout darkMode={darkMode} toggleDark={toggleDark} />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  )
}
