import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name:     user?.name    || '',
    email:    user?.email   || '',
    bio:      user?.bio     || '',
    notifications: true,
    emailAlerts:   true,
    darkMode:      true,
    language:      'English',
  })
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    updateUser({ name: form.name, email: form.email })
    toast.success('Settings saved! ✓')
    setSaving(false)
  }

  const TABS = [
    { id: 'profile',   label: 'Profile',      icon: '👤' },
    { id: 'account',   label: 'Account',      icon: '🔐' },
    { id: 'notif',     label: 'Notifications',icon: '🔔' },
    { id: 'appearance',label: 'Appearance',   icon: '🎨' },
  ]

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent)' : 'transparent'}`,
              transition: 'all .15s', marginBottom: -1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        {/* ── Profile ── */}
        {activeTab === 'profile' && (
          <div className="card">
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              <span className="avatar" style={{ width: 72, height: 72, fontSize: 26 }}>{user?.avatar}</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => toast('Upload photo feature (mock)', { icon: '📷' })}>
                    Change Photo
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => toast.error('Photo removed (mock)')}>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="input-label">Full Name</label>
                <input className="input" value={form.name} onChange={update('name')} />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input className="input" type="email" value={form.email} onChange={update('email')} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Bio</label>
              <textarea className="input" rows={3} placeholder="Tell us a bit about yourself..." value={form.bio} onChange={update('bio')} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Role</label>
              <input className="input" value={user?.role} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        )}

        {/* ── Account ── */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
              <div style={{ marginBottom: 14 }}>
                <label className="input-label">Current Password</label>
                <input className="input" type="password" placeholder="••••••••" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="input-label">New Password</label>
                  <input className="input" type="password" placeholder="Min 6 chars" />
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input className="input" type="password" placeholder="Repeat password" />
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => toast.success('Password updated!')}>
                Update Password
              </button>
            </div>

            <div className="card" style={{ background: 'rgba(255,90,90,0.04)', border: '1px solid rgba(255,90,90,0.2)' }}>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--red)' }}>
                ⚠️ Danger Zone
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="btn btn-danger btn-sm" onClick={() => toast.error('Account deletion requires confirmation email (mock)')}>
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeTab === 'notif' && (
          <div className="card">
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Notification Preferences</h3>
            {[
              { key: 'notifications', label: 'Push Notifications', desc: 'Receive in-app alerts for new exams, results, and reminders' },
              { key: 'emailAlerts',   label: 'Email Alerts',       desc: 'Get exam results and study reminders via email' },
            ].map((s) => (
              <div
                key={s.key}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{s.desc}</p>
                </div>
                <label style={{ cursor: 'pointer', position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input type="checkbox" checked={form[s.key]} onChange={update(s.key)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: 24,
                    background: form[s.key] ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', transition: 'background .2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2,
                      left: form[s.key] ? 20 : 2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#fff', transition: 'left .2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </span>
                </label>
              </div>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginTop: 18 }} onClick={() => toast.success('Preferences saved!')}>
              Save Preferences
            </button>
          </div>
        )}

        {/* ── Appearance ── */}
        {activeTab === 'appearance' && (
          <div className="card">
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Appearance</h3>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label" style={{ marginBottom: 10 }}>Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['Dark Mode', 'Light Mode'].map((t, i) => (
                  <button
                    key={t}
                    style={{
                      padding: 16, borderRadius: 10, cursor: 'pointer',
                      border: `1.5px solid ${(i === 0 && form.darkMode) || (i === 1 && !form.darkMode) ? 'var(--accent)' : 'var(--border)'}`,
                      background: (i === 0 && form.darkMode) || (i === 1 && !form.darkMode) ? 'rgba(108,99,255,0.1)' : 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontFamily: "'DM Sans',sans-serif",
                    }}
                    onClick={() => { setForm((f) => ({ ...f, darkMode: i === 0 })); toast('Theme preference saved (toggle in navbar)', { icon: i === 0 ? '🌙' : '☀️' }) }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{i === 0 ? '🌙' : '☀️'}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="input-label">Language</label>
              <select
                className="input"
                style={{ maxWidth: 200, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                value={form.language}
                onChange={update('language')}
              >
                {['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
