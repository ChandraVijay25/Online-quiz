import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const STUDENT_NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/exams',     icon: '📝', label: 'Available Exams' },
  { to: '/results',   icon: '🏆', label: 'My Results' },
  { to: '/analytics', icon: '📈', label: 'Analytics' },
]

const ADMIN_NAV = [
  { to: '/admin',          icon: '📊', label: 'Overview' },
  { to: '/admin/exams',    icon: '📝', label: 'Manage Exams' },
  { to: '/admin/questions',icon: '❓', label: 'Question Bank' },
  { to: '/admin/students', icon: '👥', label: 'Students' },
  { to: '/admin/results',  icon: '📋', label: 'All Results' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = user?.role === 'admin' ? ADMIN_NAV : STUDENT_NAV

  return (
    <aside
      style={{
        width: 220,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        padding: '16px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexShrink: 0,
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      {/* User card at top */}
      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 10,
          padding: '12px',
          marginBottom: 12,
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
            {user?.avatar}
          </span>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <span className="tag tag-accent" style={{ fontSize: 10, padding: '1px 7px' }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Navigation
      </p>

      {/* Nav items */}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard' || item.to === '/admin'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* Bottom section */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 10px 6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Account
          </p>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>⚙️</span>
            <span>Settings</span>
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="sidebar-link"
            style={{ width: '100%', border: 'none', color: 'var(--red)', background: 'none' }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Version tag */}
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0 4px' }}>
          ExamAI Pro v1.0.0
        </p>
      </div>
    </aside>
  )
}
