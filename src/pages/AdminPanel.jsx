import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import api, { MOCK_EXAMS, MOCK_STUDENTS, MOCK_RESULTS, PERF_TREND, SCORE_DIST } from '../services/api'

const TT = {
  background: 'var(--bg-card-hover)',
  border: '1px solid var(--border-hover)',
  borderRadius: 8, fontSize: 12,
  color: 'var(--text-primary)',
}

// ── Create / Edit Exam Modal ──────────────────────────────────────────────────
function ExamModal({ exam, onClose, onSave }) {
  const isEdit = !!exam?.id
  const [form, setForm] = useState(
    exam || { title: '', subject: '', duration: 30, difficulty: 'Medium', description: '', status: 'available' }
  )
  const [saving, setSaving] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.subject.trim()) { toast.error('Subject is required'); return }
    setSaving(true)
    try {
      await api.createExam(form)
      toast.success(isEdit ? 'Exam updated!' : 'Exam created! 🎉')
      onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
          borderRadius: 18, padding: 30, width: '100%', maxWidth: 520,
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>
            {isEdit ? 'Edit Exam' : 'Create New Exam'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Exam Title *</label>
          <input className="input" placeholder="e.g. Advanced Python Programming" value={form.title} onChange={update('title')} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Subject *</label>
          <input className="input" placeholder="e.g. Programming" value={form.subject} onChange={update('subject')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="input-label">Duration (minutes)</label>
            <input className="input" type="number" min="5" max="180" value={form.duration} onChange={update('duration')} />
          </div>
          <div>
            <label className="input-label">Difficulty</label>
            <select className="input" value={form.difficulty} onChange={update('difficulty')}
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="input-label">Pass Mark (%)</label>
            <input className="input" type="number" min="0" max="100" defaultValue={60} />
          </div>
          <div>
            <label className="input-label">Status</label>
            <select className="input" value={form.status} onChange={update('status')}
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              {['available', 'upcoming', 'draft', 'archived'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label className="input-label">Description</label>
          <textarea
            className="input" rows={3}
            placeholder="Brief description of what this exam covers..."
            value={form.description} onChange={update('description')}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={save} disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Exam ✓' : 'Create Exam ✓'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Add Question Modal ────────────────────────────────────────────────────────
function QuestionModal({ onClose, onSave }) {
  const [form, setForm] = useState({ question: '', topic: '', options: ['', '', '', ''], answer: 0 })
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const updateOpt = (i) => (e) => {
    const opts = [...form.options]; opts[i] = e.target.value
    setForm((f) => ({ ...f, options: opts }))
  }

  const save = () => {
    if (!form.question.trim()) { toast.error('Question text is required'); return }
    if (form.options.some((o) => !o.trim())) { toast.error('All 4 options are required'); return }
    toast.success('Question added! ✓')
    onSave()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
          borderRadius: 18, padding: 30, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>Add Question</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Question Text *</label>
          <textarea className="input" rows={3} placeholder="Enter your question here..." value={form.question} onChange={update('question')} style={{ resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Topic / Category</label>
          <input className="input" placeholder="e.g. Variables, Functions, Arrays..." value={form.topic} onChange={update('topic')} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Options * (select the correct one)</label>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <button
                onClick={() => setForm((f) => ({ ...f, answer: i }))}
                style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${form.answer === i ? 'var(--green)' : 'var(--border)'}`,
                  background: form.answer === i ? 'rgba(16,217,142,0.15)' : 'var(--bg-tertiary)',
                  cursor: 'pointer', fontSize: 10, fontWeight: 800,
                  color: form.answer === i ? 'var(--green)' : 'var(--text-muted)',
                }}
              >
                {String.fromCharCode(65 + i)}
              </button>
              <input
                className="input"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={updateOpt(i)}
                style={{ flex: 1, borderColor: form.answer === i ? 'rgba(16,217,142,0.4)' : undefined }}
              />
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            💡 Click the letter circle to mark the correct answer
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={save}>Add Question ✓</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { section = 'overview' } = useParams()
  const navigate = useNavigate()

  const [exams, setExams]         = useState(MOCK_EXAMS)
  const [students]                = useState(MOCK_STUDENTS)
  const [showExamModal, setShowExamModal]   = useState(false)
  const [showQModal, setShowQModal]         = useState(false)
  const [editingExam, setEditingExam]       = useState(null)
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [filterDiff, setFilterDiff]         = useState('all')

  useEffect(() => { setTimeout(() => setLoading(false), 600) }, [])

  const deleteExam = async (id) => {
    if (!window.confirm('Delete this exam? This cannot be undone.')) return
    await api.deleteExam(id)
    setExams((e) => e.filter((x) => x.id !== id))
    toast.success('Exam deleted')
  }

  const filteredExams = exams.filter((e) =>
    (filterDiff === 'all' || e.difficulty.toLowerCase() === filterDiff) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  const ADMIN_STATS = [
    { label: 'Total Exams',    value: exams.length,    icon: '📝', color: '#6c63ff' },
    { label: 'Active Students',value: students.filter((s) => s.status === 'Active').length, icon: '👥', color: '#10d98e' },
    { label: 'Questions',      value: 248,             icon: '❓', color: '#f59e0b' },
    { label: 'Avg Score',      value: '74%',           icon: '📊', color: '#3b82f6' },
  ]

  const tabs = [
    { id: '',          label: 'Overview',     icon: '📊' },
    { id: 'exams',     label: 'Exams',        icon: '📝' },
    { id: 'questions', label: 'Questions',    icon: '❓' },
    { id: 'students',  label: 'Students',     icon: '👥' },
    { id: 'results',   label: 'Results',      icon: '📋' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          Manage exams, questions, students, and view analytics
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {loading
          ? [1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 100 }} />)
          : ADMIN_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {s.label}
                  </p>
                  <p className="font-display" style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
              </div>
            </motion.div>
          ))
        }
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map((t) => {
          const active = section === t.id
          return (
            <button
              key={t.id}
              onClick={() => navigate(t.id ? `/admin/${t.id}` : '/admin')}
              style={{
                padding: '9px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: -1,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span>{t.icon}</span>{t.label}
            </button>
          )
        })}
      </div>

      {/* ── Overview ── */}
      {section === '' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Exam Attempt Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={PERF_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Line type="monotone" dataKey="score" name="Avg Score" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', r: 4 }} />
                <Line type="monotone" dataKey="avg"   name="Platform Avg" stroke="#10d98e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Score Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SCORE_DIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="count" name="Students" fill="#6c63ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Recent Activity</h3>
            <table className="data-table">
              <thead>
                <tr>{['Student', 'Exam', 'Score', 'Grade', 'Date'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.slice(0, 5).map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{s.avatar}</span>
                        {s.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{MOCK_EXAMS[i % MOCK_EXAMS.length].title}</td>
                    <td>
                      <span style={{ color: s.avg >= 80 ? 'var(--green)' : s.avg >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 700 }}>
                        {s.avg}%
                      </span>
                    </td>
                    <td><span className="tag tag-accent">{s.avg >= 90 ? 'A+' : s.avg >= 80 ? 'A' : s.avg >= 70 ? 'B+' : 'B'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date().toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Exams ── */}
      {section === 'exams' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="input" style={{ maxWidth: 260 }}
              placeholder="🔍 Search exams..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  className={`btn btn-sm ${filterDiff === d ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ textTransform: 'capitalize' }}
                  onClick={() => setFilterDiff(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={() => { setEditingExam(null); setShowExamModal(true) }}
            >
              + Create Exam
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['Title', 'Subject', 'Questions', 'Duration', 'Difficulty', 'Status', 'Attempts', 'Avg', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((ex) => (
                  <tr key={ex.id}>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>{ex.title}</td>
                    <td><span className="tag tag-blue">{ex.subject}</span></td>
                    <td>{ex.questions}</td>
                    <td>{ex.duration}m</td>
                    <td>
                      <span className={`tag tag-${ex.difficulty === 'Hard' ? 'red' : ex.difficulty === 'Medium' ? 'amber' : 'green'}`}>
                        {ex.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className={`tag tag-${ex.status === 'available' ? 'green' : ex.status === 'upcoming' ? 'blue' : 'gray'}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td>{ex.attempts.toLocaleString()}</td>
                    <td style={{ color: ex.avgScore >= 75 ? 'var(--green)' : ex.avgScore >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 600 }}>
                      {ex.avgScore}%
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setEditingExam(ex); setShowExamModal(true) }}
                        >
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteExam(ex.id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Questions ── */}
      {section === 'questions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Question Bank</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>248 questions across all exams</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowQModal(true)}>+ Add Question</button>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <input className="input" style={{ maxWidth: 240 }} placeholder="🔍 Search questions..." />
            <select className="input" style={{ maxWidth: 180, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option>All Exams</option>
              {MOCK_EXAMS.map((e) => <option key={e.id}>{e.title}</option>)}
            </select>
            <select className="input" style={{ maxWidth: 160, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option>All Topics</option>
              <option>Variables</option><option>Functions</option><option>Arrays</option>
              <option>Async</option><option>Events</option>
            </select>
          </div>

          {/* Question cards */}
          {[...Array(8)].map((_, qi) => {
            const q = { id: qi + 1, q: `Sample question ${qi + 1}: What is the correct output of this JavaScript expression?`, topic: ['Variables', 'Functions', 'Arrays', 'Async', 'Events', 'Types', 'JSON', 'ES6'][qi % 8], options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: Math.floor(Math.random() * 4) }
            return (
              <div
                key={qi}
                style={{
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 16, marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Q{qi + 1}</span>
                    <span className="tag tag-accent">{q.topic}</span>
                    <span className="tag tag-blue">JavaScript Fundamentals</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toast('Edit question modal', { icon: '✏️' })}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => toast.error('Question deleted (mock)')}>Delete</button>
                  </div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {q.options.map((opt, i) => (
                    <span
                      key={i}
                      className={`chip ${i === q.answer ? 'tag-green' : ''}`}
                      style={i === q.answer ? { background: 'rgba(16,217,142,0.12)', borderColor: 'rgba(16,217,142,0.3)', color: 'var(--green)' } : {}}
                    >
                      {i === q.answer && '✓ '}{String.fromCharCode(65 + i)}) {opt}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Students ── */}
      {section === 'students' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
            <input className="input" style={{ maxWidth: 260 }} placeholder="🔍 Search students..." />
            <select className="input" style={{ maxWidth: 160, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option>All Status</option><option>Active</option><option>Inactive</option>
            </select>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
              {students.length} students total
            </span>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['Student', 'Email', 'Joined', 'Exams Taken', 'Avg Score', 'Status', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{s.avatar}</span>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.joined}</td>
                    <td>{s.exams}</td>
                    <td>
                      <span style={{ color: s.avg >= 80 ? 'var(--green)' : s.avg >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 700 }}>
                        {s.avg}%
                      </span>
                    </td>
                    <td>
                      <span className={`tag ${s.status === 'Active' ? 'tag-green' : 'tag-red'}`}>{s.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast('View student profile', { icon: '👤' })}>View</button>
                        <button className="btn btn-danger btn-sm" onClick={() => toast.error('Student removed (mock)')}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {section === 'results' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card">
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Pass / Fail Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[{ name: 'Pass', value: 73 }, { name: 'Fail', value: 27 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                    <Cell fill="#6c63ff" />
                    <Cell fill="var(--bg-tertiary)" />
                  </Pie>
                  <Tooltip contentStyle={TT} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                {[{ c: '#6c63ff', l: 'Pass: 73%' }, { c: 'var(--bg-tertiary)', l: 'Fail: 27%', border: '1px solid var(--border)' }].map((x) => (
                  <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: x.c, border: x.border }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{x.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Performers</h3>
              {students.sort((a, b) => b.avg - a.avg).slice(0, 5).map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <span className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{s.avatar}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--green)' }}>{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>All Results</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => toast('Export to CSV (mock)', { icon: '📥' })}>
                📥 Export CSV
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>{['Student', 'Exam', 'Score', 'Correct', 'Grade', 'Time', 'Date'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {students.flatMap((s) =>
                  MOCK_RESULTS.slice(0, 2).map((r, i) => (
                    <tr key={`${s.id}-${i}`}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{s.avatar}</span>
                          <span style={{ fontSize: 13 }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 180 }}>{r.examTitle}</td>
                      <td style={{ color: r.score >= 75 ? 'var(--green)' : r.score >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 700 }}>
                        {r.score}%
                      </td>
                      <td style={{ fontSize: 12 }}>{r.correct}/{r.total}</td>
                      <td><span className="tag tag-accent">{r.grade}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.timeTaken}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showExamModal && (
          <ExamModal
            exam={editingExam}
            onClose={() => { setShowExamModal(false); setEditingExam(null) }}
            onSave={() => { setShowExamModal(false); setEditingExam(null) }}
          />
        )}
        {showQModal && (
          <QuestionModal
            onClose={() => setShowQModal(false)}
            onSave={() => setShowQModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
