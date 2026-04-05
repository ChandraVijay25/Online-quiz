import axios from 'axios'

// Base axios instance — swap BASE_URL for your real backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.examai.example.com/v1'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach auth token
http.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('examai_user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// ─── Mock delay helper ──────────────────────────────────────────────────────
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// ─── Mock Data ──────────────────────────────────────────────────────────────
export const MOCK_EXAMS = [
  { id: 1, title: 'JavaScript Fundamentals', subject: 'Programming',    questions: 30, duration: 45, difficulty: 'Medium', attempts: 1247, avgScore: 72, status: 'available', tags: ['JS', 'Web', 'Frontend'],  description: 'Test your JavaScript knowledge from basics to ES6+.' },
  { id: 2, title: 'Data Structures & Algorithms', subject: 'CS',        questions: 25, duration: 60, difficulty: 'Hard',   attempts: 893,  avgScore: 61, status: 'available', tags: ['DSA', 'Logic'],           description: 'Arrays, linked lists, trees, graphs and algorithm complexity.' },
  { id: 3, title: 'UI/UX Design Principles',  subject: 'Design',        questions: 20, duration: 30, difficulty: 'Easy',   attempts: 2103, avgScore: 81, status: 'available', tags: ['Design', 'UX'],           description: 'Core design thinking, accessibility, and prototyping skills.' },
  { id: 4, title: 'Machine Learning Basics',  subject: 'AI/ML',         questions: 35, duration: 75, difficulty: 'Hard',   attempts: 567,  avgScore: 58, status: 'upcoming',  tags: ['ML', 'Python', 'AI'],     description: 'Supervised learning, neural networks, and model evaluation.' },
  { id: 5, title: 'Database Management',      subject: 'CS',            questions: 28, duration: 50, difficulty: 'Medium', attempts: 1456, avgScore: 69, status: 'available', tags: ['SQL', 'DB'],              description: 'Relational databases, SQL queries, indexes, and transactions.' },
  { id: 6, title: 'React Advanced Patterns',  subject: 'Programming',   questions: 22, duration: 40, difficulty: 'Hard',   attempts: 334,  avgScore: 64, status: 'available', tags: ['React', 'JS'],            description: 'Hooks, context, performance optimisation, and design patterns.' },
  { id: 7, title: 'Python for Data Science',  subject: 'Programming',   questions: 30, duration: 55, difficulty: 'Medium', attempts: 987,  avgScore: 74, status: 'available', tags: ['Python', 'Data'],         description: 'NumPy, Pandas, Matplotlib and data wrangling techniques.' },
  { id: 8, title: 'Networking Fundamentals',  subject: 'Infrastructure', questions: 24, duration: 45, difficulty: 'Medium', attempts: 712, avgScore: 67, status: 'available', tags: ['Networking', 'TCP/IP'],   description: 'OSI model, TCP/IP, DNS, HTTP, and network security basics.' },
]

export const MOCK_QUESTIONS = [
  { id: 1,  q: 'Which keyword declares a variable in JavaScript?',                    options: ['var', 'int', 'string', 'declare'],                                       answer: 0, topic: 'Variables' },
  { id: 2,  q: 'What does DOM stand for?',                                             options: ['Document Object Model', 'Data Object Mgmt', 'Dynamic Object Module', 'Doc Order Map'], answer: 0, topic: 'Web' },
  { id: 3,  q: 'Which array method adds an element to the end?',                       options: ['push()', 'pop()', 'shift()', 'unshift()'],                               answer: 0, topic: 'Arrays' },
  { id: 4,  q: 'What is the correct arrow function syntax?',                           options: ['const f = () => {}', 'function => f(){}', 'const f=function=>{}', 'arrow f(){}'], answer: 0, topic: 'Functions' },
  { id: 5,  q: 'Which is NOT a JavaScript data type?',                                 options: ['float', 'string', 'boolean', 'undefined'],                               answer: 0, topic: 'Data Types' },
  { id: 6,  q: "What does 'typeof null' return?",                                      options: ['object', 'null', 'undefined', 'string'],                                 answer: 0, topic: 'Type Checking' },
  { id: 7,  q: 'Which event fires on element click?',                                  options: ['onclick', 'click', 'mouseclick', 'onpress'],                             answer: 1, topic: 'Events' },
  { id: 8,  q: 'What is a closure in JavaScript?',                                     options: ['Function with outer scope access', 'Closed HTML tag', 'Locked variable', 'Error handler'], answer: 0, topic: 'Functions' },
  { id: 9,  q: 'Which method fetches data asynchronously?',                            options: ['fetch()', 'get()', 'request()', 'load()'],                               answer: 0, topic: 'Async' },
  { id: 10, q: "What is 'use strict' for?",                                            options: ['Enables strict error checking', 'Makes code faster', 'Locks variables', 'None'], answer: 0, topic: 'Best Practices' },
  { id: 11, q: 'Which method converts JSON string to object?',                         options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.decode()'],   answer: 0, topic: 'JSON' },
  { id: 12, q: 'What is the purpose of the spread operator (...)?',                    options: ['Expands iterables', 'Closes arrays', 'Deletes items', 'Compresses data'], answer: 0, topic: 'ES6' },
  { id: 13, q: 'Which hook manages side effects in React?',                            options: ['useEffect', 'useState', 'useContext', 'useRef'],                         answer: 0, topic: 'React' },
  { id: 14, q: 'What does async/await do?',                                            options: ['Simplifies promise handling', 'Blocks the main thread', 'Creates workers', 'Runs in parallel'], answer: 0, topic: 'Async' },
  { id: 15, q: 'Which CSS property controls element stacking order?',                  options: ['z-index', 'stack-order', 'layer', 'depth'],                              answer: 0, topic: 'CSS' },
]

export const MOCK_STUDENTS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@test.com', exams: 8,  avg: 82, status: 'Active',   joined: '2024-01-12', avatar: 'A' },
  { id: 2, name: 'Bob Smith',     email: 'bob@test.com',   exams: 5,  avg: 71, status: 'Active',   joined: '2024-02-03', avatar: 'B' },
  { id: 3, name: 'Carol Davis',   email: 'carol@test.com', exams: 12, avg: 90, status: 'Active',   joined: '2023-11-20', avatar: 'C' },
  { id: 4, name: 'David Lee',     email: 'david@test.com', exams: 3,  avg: 58, status: 'Inactive', joined: '2024-03-01', avatar: 'D' },
  { id: 5, name: 'Emma Wilson',   email: 'emma@test.com',  exams: 9,  avg: 76, status: 'Active',   joined: '2024-01-28', avatar: 'E' },
  { id: 6, name: 'Frank Torres',  email: 'frank@test.com', exams: 6,  avg: 68, status: 'Active',   joined: '2024-02-14', avatar: 'F' },
  { id: 7, name: 'Grace Kim',     email: 'grace@test.com', exams: 11, avg: 85, status: 'Active',   joined: '2023-12-05', avatar: 'G' },
]

export const MOCK_RESULTS = [
  { examId: 1, examTitle: 'JavaScript Fundamentals', score: 78, total: 30, correct: 23, date: '2024-03-15', timeTaken: '38m', grade: 'A' },
  { examId: 3, examTitle: 'UI/UX Design Principles',  score: 88, total: 20, correct: 18, date: '2024-03-10', timeTaken: '25m', grade: 'A+' },
  { examId: 5, examTitle: 'Database Management',      score: 65, total: 28, correct: 18, date: '2024-03-05', timeTaken: '48m', grade: 'B' },
  { examId: 2, examTitle: 'Data Structures',          score: 72, total: 25, correct: 18, date: '2024-02-28', timeTaken: '55m', grade: 'B+' },
  { examId: 6, examTitle: 'React Advanced Patterns',  score: 71, total: 22, correct: 16, date: '2024-02-20', timeTaken: '36m', grade: 'B' },
]

export const PERF_TREND = [
  { month: 'Jan', score: 65, avg: 60 },
  { month: 'Feb', score: 70, avg: 62 },
  { month: 'Mar', score: 68, avg: 63 },
  { month: 'Apr', score: 75, avg: 65 },
  { month: 'May', score: 80, avg: 66 },
  { month: 'Jun', score: 78, avg: 68 },
  { month: 'Jul', score: 85, avg: 70 },
]

export const TOPIC_PERF = [
  { topic: 'Variables',  score: 90 },
  { topic: 'Functions',  score: 75 },
  { topic: 'Arrays',     score: 85 },
  { topic: 'Async',      score: 60 },
  { topic: 'Events',     score: 70 },
  { topic: 'Types',      score: 55 },
]

export const SCORE_DIST = [
  { range: '0-20',  count: 12 },
  { range: '21-40', count: 28 },
  { range: '41-60', count: 87 },
  { range: '61-80', count: 156 },
  { range: '81-100',count: 74  },
]

// ─── Mock API ────────────────────────────────────────────────────────────────
const api = {
  // Auth
  async login(email, password) {
    await delay(700)
    if (!email.includes('@')) throw new Error('Invalid email address')
    if (password.length < 6)  throw new Error('Password too short')
    const isAdmin = email.includes('admin')
    return {
      user: {
        id: 'u_' + Date.now(),
        name: isAdmin ? 'Admin User' : 'Student Demo',
        email,
        role: isAdmin ? 'admin' : 'student',
        avatar: isAdmin ? 'A' : 'S',
        token: 'mock_jwt_token_' + Date.now(),
        joinedAt: new Date().toISOString(),
        examsCompleted: 14,
        avgScore: 76,
        streak: 12,
        rank: 23,
      },
    }
  },

  async register(data) {
    await delay(800)
    if (!data.email.includes('@')) throw new Error('Invalid email address')
    if (data.password.length < 6)  throw new Error('Password too short')
    if (!data.name?.trim())        throw new Error('Name is required')
    return {
      user: {
        id: 'u_' + Date.now(),
        name: data.name,
        email: data.email,
        role: data.role || 'student',
        avatar: data.name[0].toUpperCase(),
        token: 'mock_jwt_token_' + Date.now(),
        joinedAt: new Date().toISOString(),
        examsCompleted: 0,
        avgScore: 0,
        streak: 0,
        rank: 999,
      },
    }
  },

  // Exams
  async getExams() {
    await delay(500)
    return { exams: MOCK_EXAMS }
  },

  async getExam(id) {
    await delay(400)
    const exam = MOCK_EXAMS.find((e) => e.id === Number(id))
    if (!exam) throw new Error('Exam not found')
    return { exam }
  },

  async createExam(data) {
    await delay(600)
    return { exam: { ...data, id: Date.now(), attempts: 0, avgScore: 0, status: 'available' } }
  },

  async deleteExam(id) {
    await delay(400)
    return { success: true, id }
  },

  // Questions
  async getQuestions(examId) {
    await delay(500)
    return { questions: MOCK_QUESTIONS }
  },

  async submitExam(examId, answers) {
    await delay(800)
    let correct = 0
    MOCK_QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    const score = Math.round((correct / MOCK_QUESTIONS.length) * 100)
    return {
      result: {
        examId,
        score,
        correct,
        total: MOCK_QUESTIONS.length,
        grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C',
        timeTaken: '32m',
        date: new Date().toISOString(),
      },
    }
  },

  // Results
  async getResults(userId) {
    await delay(500)
    return { results: MOCK_RESULTS }
  },

  // Students (admin)
  async getStudents() {
    await delay(500)
    return { students: MOCK_STUDENTS }
  },

  // Analytics
  async getAnalytics(userId) {
    await delay(600)
    return {
      perfTrend: PERF_TREND,
      topicPerf: TOPIC_PERF,
      scoreDist: SCORE_DIST,
      totalExams: 14,
      avgScore: 76,
      streak: 12,
      rank: 23,
      improvement: 4,
    }
  },

  // Chatbot
  async chatMessage(message, history = []) {
    await delay(900)
    const REPLIES = [
      "Great question! JavaScript closures allow inner functions to access outer function variables even after the outer function returns. They're widely used for data encapsulation.",
      "For DSA, I suggest practicing daily. Start with arrays and strings, then move to linked lists, trees, and finally graphs and dynamic programming.",
      "React hooks like useState, useEffect, and useContext are fundamental. The key is understanding the dependency array in useEffect to avoid infinite re-renders.",
      "Time management is critical during exams. Spend no more than 2 minutes per question and flag difficult ones to revisit after finishing easier ones.",
      "Based on your performance history, focus on Async JavaScript (60%) and Type Checking (55%) — these are your weakest areas. I can suggest resources!",
      "Good luck on your exam! Remember: read each question carefully, eliminate obviously wrong options first, and trust your preparation.",
      "For better retention, try active recall techniques — instead of re-reading notes, test yourself using flashcards or practice problems.",
    ]
    return { reply: REPLIES[Math.floor(Math.random() * REPLIES.length)] }
  },
}

export default api
