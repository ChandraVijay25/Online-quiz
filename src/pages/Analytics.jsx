import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import api, { PERF_TREND, TOPIC_PERF, SCORE_DIST, MOCK_RESULTS } from '../services/api'
import { useAuth } from '../context/AuthContext'

const TT = {
  background: 'var(--bg-card-hover)',
  border: '1px solid var(--border-hover)',
  borderRadius: 8, fontSize: 12,
  color: 'var(--text-primary)',
}

const RADAR_DATA = [
  { subject: 'Variables',  A: 90, fullMark: 100 },
  { subject: 'Functions',  A: 75, fullMark: 100 },
  { subject: 'Arrays',     A: 85, fullMark: 100 },
  { subject: 'Async',      A: 60, fullMark: 100 },
  { subject: 'Events',     A: 70, fullMark: 100 },
  { subject: 'Types',      A: 55, fullMark: 100 },
]

const MONTHLY_EXAMS = [
  { month: 'Jan', exams: 2 }, { month: 'Feb', exams: 3 },
  { month: 'Mar', exams: 1 }, { month: 'Apr', exams: 4 },
  { month: 'May', exams: 3 }, { month: 'Jun', exams: 2 },
  { month: 'Jul', exams: 4 },
]

export default function Analytics() {
  const { user } = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange]   = useState('7m')

  useEffect(() => {
    api.getAnalytics(user?.id).then((d) => { setData(d); setLoading(false) })
  }, [user])

  const PIE_DATA   = [{ name: 'Correct', value: 76 }, { name: 'Wrong', value: 24 }]
  const PIE_COLORS = ['#6c63ff', 'var(--bg-card-hover)']

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>Analytics</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Deep dive into your learning performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['1m', '3m', '7m', 'all'].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${range === r ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Attempts', val: 19,    icon: '📝', color: '#6c63ff' },
          { label: 'Best Score',     val: '92%',  icon: '🏆', color: '#10d98e' },
          { label: 'Improvement',    val: '+18%', icon: '📈', color: '#3b82f6' },
          { label: 'Completion Rate',val: '94%',  icon: '✅', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ textAlign: 'center', padding: '18px 12px' }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Score trend (large) */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Score Trend</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Your progress vs class average</p>
            </div>
            <span className="tag tag-green">↑ 20pts since Jan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PERF_TREND}>
              <defs>
                <linearGradient id="aG1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10d98e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10d98e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={TT} />
              <Area type="monotone" dataKey="score" name="Your Score" stroke="#6c63ff" strokeWidth={2.5} fill="url(#aG1)" dot={{ fill: '#6c63ff', r: 4 }} />
              <Area type="monotone" dataKey="avg"   name="Class Avg"  stroke="#10d98e" strokeWidth={1.5} fill="url(#aG2)" dot={false} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, alignSelf: 'flex-start' }}>Correct vs Wrong</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, alignSelf: 'flex-start' }}>Overall accuracy</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={PIE_DATA} cx="50%" cy="50%"
                innerRadius={52} outerRadius={78}
                dataKey="value" startAngle={90} endAngle={-270}
              >
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={TT} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
            {PIE_DATA.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], border: i === 1 ? '1px solid var(--border)' : undefined }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}: <strong style={{ color: 'var(--text-primary)' }}>{d.value}%</strong></span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Topic performance bar */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Topic Scores</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_PERF} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="topic" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={62} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="score" name="Score %" fill="#6c63ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Exams per month */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Exams per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_EXAMS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="exams" name="Exams Taken" fill="#10d98e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill radar */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Skill Radar</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Overall competency map</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
              <Radar name="Score" dataKey="A" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={TT} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Exam history table */}
      <motion.div className="card" style={{ padding: 0, overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Exam History</h3>
          <span className="tag tag-gray">{MOCK_RESULTS.length} exams</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>{['Exam', 'Score', 'Correct', 'Grade', 'Time Taken', 'Date', 'vs Avg'].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {MOCK_RESULTS.map((r) => {
              const diff = r.score - Math.round(r.score * 0.9)
              return (
                <tr key={r.examId}>
                  <td style={{ fontWeight: 600 }}>{r.examTitle}</td>
                  <td>
                    <span style={{ color: r.score >= 80 ? 'var(--green)' : r.score >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 700 }}>
                      {r.score}%
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.correct}/{r.total}</td>
                  <td><span className="tag tag-accent">{r.grade}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.timeTaken}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.date}</td>
                  <td>
                    <span className={`tag ${diff >= 0 ? 'tag-green' : 'tag-red'}`}>
                      {diff >= 0 ? '+' : ''}{diff}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
