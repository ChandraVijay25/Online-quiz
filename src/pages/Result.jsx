import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { MOCK_RESULTS, TOPIC_PERF } from '../services/api'

const TT = {
  background: 'var(--bg-card-hover)',
  border: '1px solid var(--border-hover)',
  borderRadius: 8, fontSize: 12,
  color: 'var(--text-primary)',
}

export default function Result() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  // Use passed result or fallback to mock
  const result = state?.result || {
    score: 78, correct: 8, total: 10, grade: 'A',
    timeTaken: '32m', date: new Date().toISOString(),
  }
  const exam = state?.exam || { title: 'JavaScript Fundamentals', subject: 'Programming' }

  const score      = result.score
  const circumference = 2 * Math.PI * 58
  const strokeDash = (score / 100) * circumference

  const gradeColor =
    score >= 90 ? 'var(--green)' :
    score >= 75 ? '#6c63ff'      :
    score >= 60 ? 'var(--amber)' :
    'var(--red)'

  const PIE_DATA   = [{ value: result.correct }, { value: result.total - result.correct }]
  const PIE_COLORS = ['#6c63ff', 'var(--bg-tertiary)']

  const COMPARE = MOCK_RESULTS.map((r) => ({
    name:  r.examTitle.split(' ')[0],
    yours: r.score,
    avg:   Math.round(r.score * 0.9),
  }))

  const WEAK   = TOPIC_PERF.filter((t) => t.score < 70).sort((a, b) => a.score - b.score)
  const STRONG = TOPIC_PERF.filter((t) => t.score >= 70).sort((a, b) => b.score - a.score)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>Exam Results</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          {exam.title} • {exam.subject} • {new Date(result.date).toLocaleDateString()}
        </p>
      </motion.div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 22 }}>
        {/* Score ring */}
        <motion.div
          className="card"
          style={{ textAlign: 'center', padding: 36 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto 20px' }}>
            <svg viewBox="0 0 140 140" width="150" height="150">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#6c63ff" />
                  <stop offset="100%" stopColor="#10d98e" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="58" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="58"
                fill="none" stroke="url(#ringGrad)"
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="65" textAnchor="middle" fill={gradeColor} fontFamily="Syne,sans-serif" fontSize="28" fontWeight="800">
                {score}%
              </text>
              <text x="70" y="83" textAnchor="middle" fill="var(--text-muted)" fontSize="11">Score</text>
            </svg>
          </div>

          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
            {score >= 90 ? '🏆 Excellent!' : score >= 75 ? '🎉 Great Job!' : score >= 60 ? '👍 Good Effort!' : '💪 Keep Practicing'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            You scored {result.correct} out of {result.total} questions correctly
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 20 }}>
            {[
              { val: result.correct, label: 'Correct', color: 'var(--green)' },
              { val: result.total - result.correct, label: 'Wrong', color: 'var(--red)' },
              { val: result.grade,   label: 'Grade',   color: '#6c63ff' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'var(--bg-tertiary)', borderRadius: 9, padding: '12px 8px', textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {result.timeTaken}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {new Date(result.date).toLocaleDateString()}</div>
          </div>
        </motion.div>

        {/* Compare chart */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Your Scores vs Average</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Across all your exams</p>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={COMPARE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="yours" name="Your Score" fill="#6c63ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg"   name="Class Avg"  fill="#2a3040"  radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[{ color: '#6c63ff', label: 'Your Score' }, { color: '#2a3040', label: 'Class Avg' }].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weak / Strong topics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 22 }}>
        {/* Weak areas */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>⚠️ Areas to Improve</h3>
          {WEAK.map((t) => (
            <div
              key={t.topic}
              style={{
                background: 'rgba(245,158,11,0.07)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 9, padding: '12px 14px',
                marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.topic}</span>
                  <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700 }}>{t.score}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill progress-fill-amber" style={{ width: t.score + '%' }} />
                </div>
              </div>
            </div>
          ))}
          {WEAK.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No weak areas — excellent work! 🏆</p>}
        </motion.div>

        {/* Strong topics */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>✅ Strong Topics</h3>
          {STRONG.map((t) => (
            <div key={t.topic} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13 }}>💪 {t.topic}</span>
                <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{t.score}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill progress-fill-green" style={{ width: t.score + '%' }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* AI recommendations */}
      <motion.div
        className="card"
        style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', marginBottom: 22 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
          🤖 AI Study Recommendations
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Based on your performance, focus on <strong style={{ color: 'var(--accent)' }}>Async JavaScript</strong> and{' '}
          <strong style={{ color: 'var(--accent)' }}>Type Checking</strong> — your weakest areas. Practice 2-3 coding exercises
          daily and revisit MDN documentation for async/await patterns. You're excelling at
          Variables and Arrays — keep that momentum!
        </p>
      </motion.div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost" onClick={() => navigate('/exams')}>← Back to Exams</button>
        <button className="btn btn-ghost" onClick={() => navigate('/analytics')}>📈 View Analytics</button>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  )
}
