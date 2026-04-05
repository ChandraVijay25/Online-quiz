import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow]     = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.email.includes('@'))  e.email    = 'Please enter a valid email address'
    if (form.password.length < 6)   e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const res = await login(form.email, form.password)
    if (res.success) {
      const isAdmin = form.email.includes('admin')
      navigate(isAdmin ? '/admin' : from, { replace: true })
    }
  }

  const quickLogin = async (role) => {
    const res = await login(`${role}@examai.com`, 'password123')
    if (res.success) navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '55%', left: '55%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,217,142,0.05) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 16px' }}
      >
        <div className="card" style={{ borderRadius: 20, padding: 36 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="font-display gradient-text-accent" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              ⚡ ExamAI Pro
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={submit}>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
              {errors.email && <p style={{ color: 'var(--red)', fontSize: 11, marginTop: 5 }}>⚠ {errors.email}</p>}
            </div>

            <div className="input-group" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 16,
                  }}
                >
                  {show ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--red)', fontSize: 11, marginTop: 5 }}>⚠ {errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or try a demo</span>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          {/* Quick access */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => quickLogin('student')}
              className="btn btn-ghost"
              style={{ fontSize: 12, justifyContent: 'center' }}
              disabled={loading}
            >
              👨‍🎓 Student Demo
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className="btn btn-ghost"
              style={{ fontSize: 12, justifyContent: 'center' }}
              disabled={loading}
            >
              🔧 Admin Demo
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
