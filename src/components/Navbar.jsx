import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ darkMode, toggleDark }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-[60px]"
      style={{
        background: 'rgba(10,11,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 no-underline">
        <span style={{ fontSize: 22 }}>⚡</span>
        <span
          className="font-display gradient-text-accent"
          style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          ExamAI Pro
        </span>
      </Link>

      {/* Center nav pills */}
      <div className="hidden md:flex items-center gap-1">
        {user?.role === 'admin' ? (
          <>
            <NavPill to="/admin"     label="Dashboard" />
            <NavPill to="/admin/exams"  label="Exams" />
            <NavPill to="/admin/students" label="Students" />
            <NavPill to="/admin/results"  label="Results" />
          </>
        ) : (
          <>
            <NavPill to="/dashboard" label="Dashboard" />
            <NavPill to="/exams"     label="Exams" />
            <NavPill to="/results"   label="My Results" />
            <NavPill to="/analytics" label="Analytics" />
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="btn btn-icon btn-ghost"
          title="Toggle theme"
          style={{ fontSize: 16, width: 36, height: 36 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Notification bell */}
        <button className="btn btn-icon btn-ghost" style={{ position: 'relative', width: 36, height: 36 }}>
          <span style={{ fontSize: 16 }}>🔔</span>
          <span
            style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--red)', border: '1.5px solid var(--bg-primary)',
            }}
          />
        </button>

        {/* User dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropOpen((o) => !o)}
            className="flex items-center gap-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="avatar"
              style={{ width: 32, height: 32, fontSize: 13 }}
            >
              {user?.avatar}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: '46px', right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 12, padding: '6px',
                  minWidth: 180, boxShadow: 'var(--shadow-md)',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '8px 12px 8px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</p>
                  <span className="tag tag-accent" style={{ marginTop: 6 }}>{user?.role}</span>
                </div>
                <DropItem icon="⚙️" label="Settings"  onClick={() => { navigate('/settings'); setDropOpen(false) }} />
                <DropItem icon="👤" label="Profile"   onClick={() => { navigate('/settings'); setDropOpen(false) }} />
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                  <DropItem icon="🚪" label="Logout" onClick={handleLogout} danger />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

function NavPill({ to, label }) {
  const isActive = window.location.pathname.startsWith(to) && (to !== '/' || window.location.pathname === '/')
  return (
    <Link
      to={to}
      style={{
        padding: '5px 13px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: isActive ? 'var(--bg-tertiary)' : 'transparent',
        transition: 'all .15s',
      }}
    >
      {label}
    </Link>
  )
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '8px 12px', borderRadius: 8,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 500,
        color: danger ? 'var(--red)' : 'var(--text-secondary)',
        transition: 'all .15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  )
}
