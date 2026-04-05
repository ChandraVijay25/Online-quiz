import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import api, { MOCK_EXAMS, PERF_TREND, TOPIC_PERF } from '../services/api'

const TT_STYLE = {
  background: 'var(--bg-card-hover)', border: '1px solid var(--border-hover)',
  borderRadius: 8, fontSize: 12, color: 'var(--text-primary)',
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    api.getAnalytics(user?.id).then((data) => {
      setAnalytics(data)
      setLoading(false)
    })
  }, [user])

  const stats = [
    { label: 'Exams Completed', value: user?.examsCompleted ?? 14, delta: '+3 this week',   icon: '📝', up: true },
    { label: 'Average Score',   value: (user?.avgScore ?? 76) + '%', delta: '↑ 4% improvement', icon: '🎯', up: true },
    { label: 'Study Streak',    value: (user?.streak ?? 12) + ' days', delta: '🔥 Keep it up!',  icon: '⚡', up: true },
    { label: 'Global Rank',     value: '#' + (user?.rank ?? 23),   delta: '↑ 5 positions',  icon: '🏆', up: true },
  ]

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
          Track your progress and dive into your next exam
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {loading
          ? [1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 110 }} />)
          : stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate="visible"
              className="stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    {s.label}
                  </p>
                  <p className="font-display" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
                <span style={{ fontSize: 26 }}>{s.icon}</span>
              </div>
              <span className={`tag ${s.up ? 'tag-green' : 'tag-red'}`} style={{ marginTop: 10, display: 'inline-block' }}>
                {s.delta}
              </span>
            </motion.div>
          ))
        }
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Performance Trend</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Score over 7 months</p>
            </div>
            <span className="tag tag-accent">Last 7 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PERF_TREND}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10d98e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10d98e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={TT_STYLE} />
              <Area type="monotone" dataKey="score" name="Your Score" stroke="#6c63ff" strokeWidth={2.5} fill="url(#scoreGrad)" dot={false} />
              <Area type="monotone" dataKey="avg"   name="Class Avg"  stroke="#10d98e" strokeWidth={1.5} fill="url(#avgGrad)"   dot={false} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Topic Performance</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Latest JS Exam</p>
            </div>
            <span className="tag tag-blue">Latest Exam</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_PERF} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="topic" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="score" name="Score" fill="#6c63ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Upcoming exams */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>Available Exams</h2>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => navigate('/exams')}>
          View all →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {MOCK_EXAMS.slice(0, 3).map((ex, i) => (
          <motion.div
            key={ex.id}
            custom={i}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            className="exam-card"
            onClick={() => navigate(`/exam/${ex.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className={`tag tag-${ex.difficulty === 'Hard' ? 'red' : ex.difficulty === 'Medium' ? 'amber' : 'green'}`}>
                {ex.difficulty}
              </span>
              <span className="tag tag-blue">{ex.subject}</span>
            </div>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
              {ex.title}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.4 }}>
              {ex.description}
            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {ex.duration}min</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>❓ {ex.questions}q</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👥 {ex.attempts.toLocaleString()}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: ex.avgScore + '%' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Avg score: {ex.avgScore}%</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
