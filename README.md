# CodeReview AI

**AI-powered code review assistant** — analyze logic, detect bugs, optimize performance, and learn best practices with AI.

## Features

### Code Analysis
- **Line-by-Line Review** — Annotated feedback directly on your code with color-coded issues (critical, warning, suggestion)
- **Bug Detection** — Catch syntax errors, runtime exceptions, and subtle bugs
- **Logic Analysis** — Identify logical flaws, edge cases, and incorrect assumptions
- **Complexity Analysis** — Big-O time and space complexity evaluation
- **Code Optimization** — Performance improvements and cleaner patterns

### AI Mentor
- **Interactive Chat** — Ask questions and get detailed explanations via streaming AI responses
- **Context-Aware** — Chat understands your code and review context
- **Suggested Questions** — Smart suggestions based on your review

### Learning
- **Personalized Roadmap** — AI-generated learning path based on your code
- **Weak Area Analysis** — Identify specific topics to improve
- **Practice Questions** — Curated problems matched to your skill level
- **Structured Steps** — Clear learning progression with time estimates

### Additional
- **Fix My Code** — AI-powered refactoring with side-by-side diff comparison
- **PDF Export** — Download professional review reports with syntax-highlighted code
- **Multi-Language** — JavaScript, Python, Java, C++, C, TypeScript
- **Real-time Preview** — Monaco editor with syntax highlighting and line decorations

## Architecture

```
codereview-ai/
├── backend/                    # Express.js API server
│   ├── server.js               # Entry point with middleware
│   ├── routes/                 # API route handlers
│   │   ├── review.js           # POST /api/review
│   │   ├── refactor.js         # POST /api/refactor
│   │   ├── chat.js             # POST /api/chat (SSE streaming)
│   │   ├── export.js           # POST /api/export/pdf
│   │   └── learn.js            # POST /api/learn/recommend
│   ├── services/               # Business logic
│   │   ├── geminiService.js    # Google Gemini API integration
│   │   └── pdfService.js       # PDF generation (pdfkit)
│   └── middleware/              # Express middleware
│       ├── rateLimiter.js      # Request rate limiting
│       └── errorHandler.js     # Global error handler
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── pages/              # Landing, Dashboard
    │   ├── components/         # UI components
    │   │   ├── CodeEditor.jsx        # Monaco editor wrapper
    │   │   ├── ReviewPanel.jsx       # Review results
    │   │   ├── MentorChat.jsx        # AI chat interface
    │   │   ├── LearningRoadmap.jsx   # Learning recommendations
    │   │   ├── CodeComparisonView.jsx # Diff editor
    │   │   ├── LoadingSkeleton.jsx   # Loading states
    │   │   └── ErrorMessage.jsx      # Error handling
    │   └── utils/api.js        # API client
    └── vercel.json             # Vercel deployment config
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Editor | Monaco Editor (@monaco-editor/react) |
| Backend | Node.js, Express |
| AI | Google Gemini API (gemini-2.5-flash via @google/generative-ai) |
| PDF | pdfkit |
| Security | helmet, express-rate-limit |

## Setup

### Prerequisites
- Node.js 18+
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone and install
git clone <repo-url>
cd codereview-ai

# Install all dependencies
npm run install:all
```

### Google Gemini API Configuration

Create `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Development

```bash
# Start both servers concurrently
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set `VITE_API_URL` to your Render backend URL in Vercel environment variables.

### Backend (Render)

1. Push to GitHub
2. Create new Web Service on Render
3. Connect your repo
4. Set `Root Directory` to `backend`
5. Add environment variables (see `backend/.env`)
6. Deploy

Then update `frontend/.env.production` with your Render URL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/review` | Submit code for AI review |
| POST | `/api/refactor` | Request code refactoring |
| POST | `/api/chat` | Streaming AI mentor chat (SSE) |
| POST | `/api/export/pdf` | Export review as PDF |
| POST | `/api/learn/recommend` | Generate learning recommendations |
| GET | `/api/health` | Server health check |

## Security

- Rate limiting: 20 requests/minute per IP
- Helmet security headers
- Input validation on all routes
- CORS restricted to allowed origins
- 5MB JSON body limit

## License

MIT# code-reviewer
# ai-code-reviewer
# ai-code-reviewer
