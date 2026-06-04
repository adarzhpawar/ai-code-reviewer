# Quick Environment Setup

## Copy-Paste for Local Development

### Backend .env
```env
PORT=5000
FEATHERLESS_API_KEY=YOUR_API_KEY_HERE
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3005,http://localhost:3006
```

**How to get `FEATHERLESS_API_KEY`:**
1. Visit https://featherless.ai
2. Sign up/Login
3. Go to API Keys
4. Create new key
5. Copy and replace `YOUR_API_KEY_HERE`

### Frontend .env.local
```env
VITE_API_URL=http://localhost:5000/api
```

## Production (Vercel)

In Vercel Project Settings → Environment Variables, add:

| Name | Value | Scope |
|------|-------|-------|
| `FEATHERLESS_API_KEY` | Your API key | Production |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Production |

Frontend automatically uses `/api` endpoint (from `frontend/.env.production`).

## Commands to Setup

```bash
# 1. Create backend .env
cd backend
cp .env.example .env
# Edit .env and add your FEATHERLESS_API_KEY

# 2. Create frontend .env.local
cd ../frontend
cp .env.example .env.local
# (.env.local already has correct values for local dev)

# 3. Start development servers
cd ..
npm run dev
```

## Verify Setup

- Backend should log: `API Key configured: true`
- Frontend should connect to API without errors
- See ENV.md for detailed variable reference
