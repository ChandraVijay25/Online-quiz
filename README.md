<<<<<<< HEAD
# ⚡ ExamAI Pro — AI-Powered Online Examination System

A production-ready, modern frontend for an online exam platform built with React 18, Tailwind CSS, Framer Motion, and Recharts.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build
```

---

## 🔐 Demo Credentials

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Student | student@examai.com  | password123 |
| Admin   | admin@examai.com    | password123 |

Or click the **"Student Demo"** / **"Admin Demo"** buttons on the login page.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Sticky navbar with dropdown
│   ├── Sidebar.jsx          # Role-aware navigation sidebar
│   ├── Chatbot.jsx          # Floating AI assistant
│   └── ProtectedRoute.jsx   # Role-based route guard
├── context/
│   └── AuthContext.jsx      # Authentication state (login/register/logout)
├── pages/
│   ├── Login.jsx            # Login with validation + quick demo
│   ├── Register.jsx         # Registration with role selector
│   ├── Dashboard.jsx        # Student dashboard with charts
│   ├── Exams.jsx            # Exam browser with filters
│   ├── Exam.jsx             # MCQ exam with timer + anti-cheat
│   ├── Result.jsx           # Detailed score + analytics result page
│   ├── Results.jsx          # Exam history list
│   ├── Analytics.jsx        # Deep performance analytics
│   ├── AdminPanel.jsx       # Admin: manage exams/questions/students
│   └── Settings.jsx         # User profile & preferences
├── services/
│   └── api.js               # Mock API (swap with real backend)
├── App.jsx                  # Router + layout shell
├── main.jsx                 # React entry point
└── index.css                # Global design system styles
```

---

## ⚡ Features

### 🎓 Student
- **Dashboard** — stats cards, performance trend & topic charts
- **Exam Browser** — filter by difficulty, subject, sort by popularity
- **MCQ Exam** — countdown timer, question navigator, flag questions
- **Anti-Cheat** — tab-switch detection (3 warnings → auto-terminate), right-click disabled
- **Results** — animated score ring, weak/strong topic breakdown, AI recommendations
- **Analytics** — area chart, radar chart, pie chart, score distribution, history table
- **AI Chatbot** — floating assistant with quick-prompt chips

### 🔧 Admin
- **Overview** — trend charts, score distribution, recent activity table
- **Exam Management** — create/edit/delete exams with modal form
- **Question Bank** — view, add (with correct answer selector), delete questions
- **Student Roster** — table with scores, status, actions
- **Results** — pass/fail pie, leaderboard, full results export (mock)

### 🎨 UI/UX
- Dark/Light mode toggle
- Smooth page transitions (Framer Motion)
- Skeleton loading states
- Toast notifications (react-hot-toast)
- Fully responsive design
- Animated stat cards, exam cards with hover effects

---

## 🔌 Connecting a Real Backend

All API calls are in `src/services/api.js`. To connect your real backend:

1. Set `VITE_API_URL` in a `.env` file:
   ```env
   VITE_API_URL=https://your-api.com/v1
   ```

2. Replace mock functions with real `http.get/post/put/delete` calls:
   ```js
   // Before (mock):
   async getExams() {
     await delay(500)
     return { exams: MOCK_EXAMS }
   }

   // After (real):
   async getExams() {
     const res = await http.get('/exams')
     return res.data
   }
   ```

3. Update `AuthContext.jsx` to store the JWT token from your API response.

---

## 🛠 Tech Stack

| Library         | Version | Purpose                    |
|-----------------|---------|----------------------------|
| React           | 18.2    | UI framework               |
| React Router    | 6.22    | Client-side routing        |
| Tailwind CSS    | 3.4     | Utility-first styling      |
| Framer Motion   | 11.0    | Animations & transitions   |
| Recharts        | 2.12    | Charts & data visualization|
| Axios           | 1.6     | HTTP client                |
| React Hot Toast | 2.4     | Toast notifications        |
| Vite            | 5.1     | Build tool                 |

---

## 📱 Responsive Breakpoints

- **Mobile** (< 640px) — stacked layout, hamburger-friendly
- **Tablet** (640–1024px) — collapsed sidebar
- **Desktop** (> 1024px) — full sidebar + multi-column grids

---

## 🧪 Customization

### Add a new exam
Edit `src/services/api.js` → `MOCK_EXAMS` array.

### Add more questions
Edit `src/services/api.js` → `MOCK_QUESTIONS` array.

### Change color scheme
Edit `src/index.css` → `:root` CSS variables (`--accent`, `--green`, `--red`, etc.).

### Add a new page
1. Create `src/pages/YourPage.jsx`
2. Import and add a `<Route>` in `src/App.jsx`
3. Add a `<NavLink>` in `src/components/Sidebar.jsx`

---

## 📄 License

MIT — free to use and modify.
=======
# Online-quiz
>>>>>>> 7856080e087941e51054b3585a3d45ef276a0886
