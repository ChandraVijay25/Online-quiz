import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '', role: 'student' })
  const [errors, setErrors] = useState({})
  const [show, setShow]     = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())            e.name     = 'Full name is required'
    if (!form.email.includes('@'))    e.email    = 'Valid email is required'
    if (form.password.length < 6)     e.password = 'Min 6 characters required'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const res = await register(form)
    if (res.success) navigate(form.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  const Field = ({ id, label, type = 'text', placeholder, error, extra = {} }) => (
    <div style={{ marginBottom: 14 }}>
      <label className="input-label">{label}</label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={update(id)}
        {...extra}
      />
      {error && <p style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>⚠ {error}</p>}
    </div>
  )

  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', padding: '24px 16px',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,217,142,0.05) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}
      >
        <div className="card" style={{ borderRadius: 20, padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div className="font-display gradient-text-accent" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              ⚡ ExamAI Pro
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Create your account and start learning</p>
          </div>

          <form onSubmit={submit}>
            <Field id="name"    label="Full Name"     placeholder="John Doe"       error={errors.name} />
            <Field id="email"   label="Email Address" placeholder="you@example.com" error={errors.email} extra={{ type: 'email' }} />

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={show ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={update('password')}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}
                >
                  {show ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>⚠ {errors.password}</p>}
            </div>

            <Field id="confirm" label="Confirm Password" placeholder="Repeat password" error={errors.confirm} extra={{ type: show ? 'text' : 'password' }} />

            <div style={{ marginBottom: 20 }}>
              <label className="input-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['student', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    style={{
                      padding: '10px', borderRadius: 9,
                      border: `1.5px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.role === r ? 'rgba(108,99,255,0.1)' : 'var(--bg-tertiary)',
                      color: form.role === r ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      transition: 'all .15s', fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'capitalize',
                    }}
                  >
                    {r === 'student' ? '👨‍🎓 Student' : '🔧 Admin / Teacher'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
