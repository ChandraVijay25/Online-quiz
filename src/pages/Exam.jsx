import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api, { MOCK_EXAMS, MOCK_QUESTIONS } from '../services/api'

export default function Exam() {
  const { id } = useParams()
  const navigate = useNavigate()

  const exam      = MOCK_EXAMS.find((e) => e.id === Number(id)) || MOCK_EXAMS[0]
  const questions = MOCK_QUESTIONS

  const [phase,     setPhase]     = useState('start')   // start | exam | submitted
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [timeLeft,  setTimeLeft]  = useState(exam.duration * 60)
  const [flagged,   setFlagged]   = useState({})
  const [warnings,  setWarnings]  = useState(0)
  const [result,    setResult]    = useState(null)
  const [submitting,setSubmitting]= useState(false)
  const timerRef = useRef(null)

  // ── Anti-cheat: tab visibility ───────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    const handler = () => {
      if (document.hidden) {
        setWarnings((w) => {
          const next = w + 1
          if (next >= 3) {
            toast.error('⛔ Exam terminated — repeated tab switching detected!')
            handleSubmit(true)
          } else {
            toast.error(`⚠️ Warning ${next}/3: Tab switching detected and logged!`)
          }
          return next
        })
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [phase])

  // ── Anti-cheat: right-click ───────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    const handler = (e) => {
      e.preventDefault()
      toast.error('Right-click is disabled during exams', { id: 'rclick' })
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [phase])

  // ── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          toast.error('⏰ Time is up! Auto-submitting...')
          handleSubmit()
          return 0
        }
        if (s === 120) toast('⏱ 2 minutes remaining!', { icon: '⚠️' })
        if (s === 60)  toast.error('⏱ 1 minute left!')
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const handleSubmit = useCallback(async (forced = false) => {
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const res = await api.submitExam(exam.id, answers)
      setResult(res.result)
      setPhase('submitted')
      if (!forced) toast.success('Exam submitted successfully! 🎉')
    } finally {
      setSubmitting(false)
    }
  }, [answers, exam.id])

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const answeredCount = Object.keys(answers).length
  const isLow         = timeLeft < 120
  const q             = questions[current]

  // ─── Phase: start ────────────────────────────────────────────
  if (phase === 'start') return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <motion.div
        className="card"
        style={{ textAlign: 'center', padding: 40 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{exam.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 30, fontSize: 14 }}>{exam.subject} • {exam.difficulty}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { icon: '❓', val: questions.length, label: 'Questions' },
            { icon: '⏱', val: exam.duration + 'm', label: 'Duration' },
            { icon: '📊', val: exam.avgScore + '%', label: 'Avg Score' },
            { icon: '👥', val: exam.attempts.toLocaleString(), label: 'Attempts' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div className="font-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div
          className="card"
          style={{
            textAlign: 'left', marginBottom: 28,
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.25)',
          }}
        >
          <h4 style={{ fontWeight: 700, marginBottom: 10, color: 'var(--amber)', fontFamily: 'Syne,sans-serif' }}>
            ⚠️ Exam Instructions
          </h4>
          {[
            'Do NOT switch browser tabs or windows — violations are logged.',
            'Right-click is disabled during the exam.',
            'Each question has exactly one correct answer.',
            'Timer will auto-submit when time expires.',
            'You can navigate freely between questions.',
            '3 tab-switch violations will terminate your exam.',
          ].map((r, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 5 }}>
              {i + 1}. {r}
            </p>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 36px', fontSize: 15 }}
            onClick={() => setPhase('exam')}
          >
            Start Exam ⚡
          </button>
        </div>
      </motion.div>
    </div>
  )

  // ─── Phase: submitted ────────────────────────────────────────
  if (phase === 'submitted') {
    navigate('/result', { state: { result, exam } })
    return null
  }

  // ─── Phase: exam ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      {/* Warning banner */}
      <AnimatePresence>
        {warnings > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(255,90,90,0.1)',
              border: '1px solid rgba(255,90,90,0.3)',
              borderRadius: 8, padding: '10px 16px',
              marginBottom: 14, fontSize: 13,
              color: 'var(--red)', display: 'flex', gap: 8, alignItems: 'center',
            }}
          >
            ⛔ Warning {warnings}/3: Tab switching detected and logged. Further violations may terminate your exam.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div
        className="card"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, padding: '14px 20px' }}
      >
        <div>
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{exam.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Question {current + 1} of {questions.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            ✅ {answeredCount}/{questions.length} answered
          </div>
          <div className={`timer-display ${isLow ? 'danger' : ''}`}>{fmt(timeLeft)}</div>
          <button
            className="btn btn-danger"
            style={{ fontSize: 12 }}
            onClick={() => { if (window.confirm('Submit exam now?')) handleSubmit() }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit ✓'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ height: 4, marginBottom: 20, borderRadius: 0 }}>
        <div className="progress-fill" style={{ width: (answeredCount / questions.length * 100) + '%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Question panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="card"
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="tag tag-accent">Q{current + 1}</span>
              <span className="tag tag-gray">{q.topic}</span>
              {flagged[current] && <span className="tag tag-amber">🚩 Flagged</span>}
            </div>

            <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 22, lineHeight: 1.55 }}>
              {q.q}
            </h3>

            {q.options.map((opt, i) => {
              const letter  = String.fromCharCode(65 + i)
              const selected = answers[current] === i
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`option-btn ${selected ? 'selected' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      border: `2px solid ${selected ? 'var(--accent)' : 'var(--border-hover)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, flexShrink: 0,
                      background: selected ? 'rgba(108,99,255,0.2)' : 'transparent',
                      color: selected ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {letter}
                  </div>
                  <span>{opt}</span>
                </motion.button>
              )
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={current === 0}
                  onClick={() => setCurrent((c) => c - 1)}
                >
                  ← Prev
                </button>
                <button
                  className={`btn btn-sm ${flagged[current] ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={() => setFlagged((f) => ({ ...f, [current]: !f[current] }))}
                >
                  🚩 {flagged[current] ? 'Unflag' : 'Flag'}
                </button>
              </div>
              {current < questions.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={() => setCurrent((c) => c + 1)}>
                  Next →
                </button>
              ) : (
                <button className="btn btn-success btn-sm" onClick={() => handleSubmit()}>
                  Submit Exam ✓
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Navigator */}
          <div className="card">
            <h4 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
              Question Navigator
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`q-pill ${i === current ? 'current' : answers[i] !== undefined ? 'answered' : 'pending'}`}
                  onClick={() => setCurrent(i)}
                >
                  {flagged[i] ? '🚩' : i + 1}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {[
                { cls: 'answered', label: 'Answered' },
                { cls: 'current',  label: 'Current'  },
                { cls: 'pending',  label: 'Pending'  },
              ].map(({ cls, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div className={`q-pill ${cls}`} style={{ width: 14, height: 14, fontSize: 9, borderRadius: 3, cursor: 'default' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h4 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Progress</h4>
            <div className="progress-track" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: (answeredCount / questions.length * 100) + '%' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 7 }}>
              {answeredCount} of {questions.length} answered
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              🚩 {Object.values(flagged).filter(Boolean).length} flagged for review
            </p>
            {answeredCount === questions.length && (
              <button
                className="btn btn-success"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                onClick={() => handleSubmit()}
                disabled={submitting}
              >
                Submit Exam ✓
              </button>
            )}
          </div>

          {/* Security */}
          <div className="card" style={{ background: 'rgba(255,90,90,0.04)', border: '1px solid rgba(255,90,90,0.15)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 8 }}>🔒 Proctoring Active</h4>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Tab switching and right-click are monitored. Violations: <strong style={{ color: 'var(--red)' }}>{warnings}/3</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
