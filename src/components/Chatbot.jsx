import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const QUICK_PROMPTS = [
  'How can I improve my score?',
  'Tips for time management',
  'Explain closures in JS',
]

export default function Chatbot() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState([
    { role: 'ai', text: "Hi! I'm your AI study assistant 🎓 Ask me anything about your exams, topics, or study tips!" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef                = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return
    setMsgs((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)
    try {
      const { reply } = await api.chatMessage(msg, msgs)
      setMsgs((m) => [...m, { role: 'ai', text: reply }])
    } catch {
      setMsgs((m) => [...m, { role: 'ai', text: 'Sorry, I had trouble responding. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 150 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', bottom: 68, right: 0,
              width: 340,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-hover)',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
                  ExamAI Assistant
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
                  AI-powered study help
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10d98e', border: '2px solid rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Online</span>
              </div>
            </div>

            {/* Quick prompts */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    padding: '4px 10px', borderRadius: 20,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: 11,
                    cursor: 'pointer', transition: 'all .15s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ padding: 14, height: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`chat-bubble ${m.role}`}
                >
                  {m.text}
                </motion.div>
              ))}
              {loading && (
                <div className="chat-bubble ai" style={{ opacity: 0.6 }}>
                  <span style={{ letterSpacing: 2 }}>●●●</span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '10px 12px',
                borderTop: '1px solid var(--border)',
                display: 'flex', gap: 8,
              }}
            >
              <input
                className="input"
                style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && send()}
                disabled={loading}
              />
              <button
                onClick={() => !loading && send()}
                disabled={loading || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                  border: 'none', color: '#fff', fontSize: 16,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: 'opacity .15s',
                }}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff',
          boxShadow: '0 4px 20px rgba(108,99,255,0.45)',
        }}
      >
        {open ? '✕' : '💬'}
      </motion.button>
    </div>
  )
}
