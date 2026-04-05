import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MOCK_EXAMS } from '../services/api'

const SUBJECTS = ['All', 'Programming', 'CS', 'Design', 'AI/ML', 'Infrastructure']

export default function Exams() {
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [diff,     setDiff]     = useState('all')
  const [subject,  setSubject]  = useState('All')
  const [sortBy,   setSortBy]   = useState('popular')

  const filtered = MOCK_EXAMS
    .filter((e) =>
      (diff === 'all' || e.difficulty.toLowerCase() === diff) &&
      (subject === 'All' || e.subject === subject) &&
      (e.title.toLowerCase().includes(search.toLowerCase()) ||
       e.subject.toLowerCase().includes(search.toLowerCase()) ||
       e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === 'popular')  return b.attempts - a.attempts
      if (sortBy === 'score')    return b.avgScore - a.avgScore
      if (sortBy === 'newest')   return b.id - a.id
      return 0
    })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>Available Exams</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          {filtered.length} exams found — choose one to test your knowledge
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="card"
        style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '14px 18px' }}
      >
        <input
          className="input"
          style={{ maxWidth: 260 }}
          placeholder="🔍 Search by title, subject, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              className={`btn btn-sm ${diff === d ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
              onClick={() => setDiff(d)}
            >
              {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : d === 'hard' ? '🔴' : ''} {d}
            </button>
          ))}
        </div>

        <select
          className="input"
          style={{ maxWidth: 160, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select
          className="input"
          style={{ maxWidth: 160, background: 'var(--bg-tertiary)', color: 'var(--text-primary)', marginLeft: 'auto' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="score">Highest Avg Score</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Exam grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No exams match your filters</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your search or filters</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setDiff('all'); setSubject('All') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {filtered.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="exam-card"
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className={`tag tag-${ex.difficulty === 'Hard' ? 'red' : ex.difficulty === 'Medium' ? 'amber' : 'green'}`}>
                    {ex.difficulty}
                  </span>
                  {ex.status === 'upcoming' && <span className="tag tag-blue">Upcoming</span>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                  ⭐ {ex.avgScore}%
                </span>
              </div>

              {/* Subject + title */}
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                {ex.subject}
              </p>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                {ex.title}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                {ex.description}
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {ex.duration}min</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>❓ {ex.questions}q</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👥 {ex.attempts.toLocaleString()}</span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {ex.tags.map((t) => (
                  <span key={t} className="chip" style={{ fontSize: 10 }}>{t}</span>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Class average</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{ex.avgScore}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: ex.avgScore + '%' }} />
                </div>
              </div>

              {/* CTA */}
              <button
                className={`btn ${ex.status === 'upcoming' ? 'btn-ghost' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={ex.status === 'upcoming'}
                onClick={() => ex.status === 'available' && navigate(`/exam/${ex.id}`)}
              >
                {ex.status === 'upcoming' ? '⏳ Coming Soon' : 'Start Exam →'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
