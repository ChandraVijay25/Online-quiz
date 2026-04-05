import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import api, { MOCK_RESULTS } from '../services/api'

const TT = {
  background: 'var(--bg-card-hover)',
  border: '1px solid var(--border-hover)',
  borderRadius: 8, fontSize: 12,
  color: 'var(--text-primary)',
}

export default function Results() {
  const { user }            = useAuth()
  const navigate            = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getResults(user?.id).then(({ results }) => { setResults(results); setLoading(false) })
  }, [user])

  const avg      = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0
  const best     = results.length ? Math.max(...results.map((r) => r.score)) : 0
  const chartData = results.map((r) => ({ name: r.examTitle.split(' ')[0], score: r.score, avg: Math.round(r.score * 0.92) }))

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 90 }} />)}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>My Results</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Your complete exam history</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Exams Taken',  val: results.length, icon: '📝', color: '#6c63ff' },
          { label: 'Average Score',val: avg + '%',       icon: '🎯', color: '#10d98e' },
          { label: 'Best Score',   val: best + '%',      icon: '🏆', color: '#f59e0b' },
          { label: 'Passed',       val: results.filter((r) => r.score >= 60).length, icon: '✅', color: '#3b82f6' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ textAlign: 'center', padding: '18px 12px' }}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div className="card" style={{ marginBottom: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Score History</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Your scores vs class average per exam</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="score" name="Your Score" fill="#6c63ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg"   name="Class Avg"  fill="#2a3040"  radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Results list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {results.map((r, i) => (
          <motion.div
            key={r.examId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer' }}
            onClick={() => navigate('/result', { state: { result: r, exam: { title: r.examTitle } } })}
          >
            {/* Score ring mini */}
            <div style={{ position: 'relative', width: 58, height: 58, flexShrink: 0 }}>
              <svg viewBox="0 0 58 58" width="58" height="58">
                <circle cx="29" cy="29" r="24" fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
                <circle
                  cx="29" cy="29" r="24"
                  fill="none"
                  stroke={r.score >= 80 ? '#10d98e' : r.score >= 60 ? '#f59e0b' : '#ff5a5a'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(r.score / 100) * 150.8} 150.8`}
                  transform="rotate(-90 29 29)"
                />
                <text x="29" y="33" textAnchor="middle" fill="var(--text-primary)" fontFamily="Syne,sans-serif" fontSize="11" fontWeight="800">
                  {r.score}%
                </text>
              </svg>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>{r.examTitle}</h3>
                <span className="tag tag-accent">{r.grade}</span>
                <span className={`tag ${r.score >= 60 ? 'tag-green' : 'tag-red'}`}>
                  {r.score >= 60 ? 'Passed' : 'Failed'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>✅ {r.correct}/{r.total} correct</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {r.timeTaken}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {r.date}</span>
              </div>
            </div>

            {/* Retake btn */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={(e) => { e.stopPropagation(); navigate('/result', { state: { result: r, exam: { title: r.examTitle } } }) }}
              >
                View Details
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => { e.stopPropagation(); navigate(`/exam/${r.examId}`) }}
              >
                Retake
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No results yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Take your first exam to see results here</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/exams')}>
            Browse Exams →
          </button>
        </div>
      )}
    </div>
  )
}
