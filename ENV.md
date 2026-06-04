# Environment Variables Guide

## Overview
This project uses environment variables to configure both backend and frontend. Different configurations are needed for:
- Local development
- Production deployment on Vercel

---

## Backend Environment Variables

### `PORT`
- **Type:** Number
- **Default:** `5000`
- **Description:** Port on which the Express server runs
- **Local Dev:** `5000`
- **Production:** `3000` (Vercel default)

### `FEATHERLESS_API_KEY` ⚠️ **REQUIRED**
- **Type:** String
- **Description:** API key for Featherless AI (LLM provider)
- **Where to get:**
  1. Go to https://featherless.ai
  2. Sign up or log in
  3. Navigate to API Keys section
  4. Create a new API key
  5. Copy and paste here
- **Example:** `rc_8b640892944fb80bcf8e1eb9b46ea0e407e538aac2db72942b021a4737c48cf7`
- **⚠️ Security:** Never commit this to git. It's already in `.gitignore`

### `CORS_ORIGIN`
- **Type:** String (comma-separated URLs)
- **Description:** Allowed origins for CORS requests
- **Local Dev:** 
  ```
  http://localhost:3000,http://localhost:5173,http://localhost:3005,http://localhost:3006
  ```
- **Production:** 
  ```
  https://your-vercel-domain.vercel.app
  ```
  - Replace with your actual frontend URL deployed on Vercel

### `DEBUG` (Optional)
- **Type:** Boolean
- **Description:** Enable verbose logging
- **Default:** `false`
- **Usage:** Set to `true` for troubleshooting

---

## Frontend Environment Variables

### `VITE_API_URL` ⚠️ **REQUIRED**
- **Type:** String (URL)
- **Description:** Backend API endpoint for API calls
- **Local Dev:** `http://localhost:5000/api`
- **Production:** `/api` (relative URL, served from same domain)
- **Why relative in production?** Vercel routes `/api/*` to the backend, so a relative URL works seamlessly

### `VITE_DEBUG` (Optional)
- **Type:** Boolean
- **Description:** Enable debug logging in frontend
- **Default:** `false`

---

## Setup Instructions

### Step 1: Local Development Setup

#### Backend (.env)
```bash
# Navigate to backend folder
cd backend

# Copy example file
cp .env.example .env

# Edit .env and add your values
# - Add your FEATHERLESS_API_KEY
# - Keep other defaults
```

#### Frontend (.env.local)
```bash
# Navigate to frontend folder
cd frontend

# Copy example file
cp .env.example .env.local

# Edit .env.local
# - Leave VITE_API_URL as http://localhost:5000/api for local dev
```

### Step 2: Production Setup (Vercel)

1. **Connect repository to Vercel**
   - Go to vercel.com
   - Import this repository

2. **Set Environment Variables in Vercel Dashboard**
   - Project Settings → Environment Variables
   - Add:
     - **Name:** `FEATHERLESS_API_KEY`
     - **Value:** Your API key from Featherless AI
     - **Environments:** Production
   - Add:
     - **Name:** `CORS_ORIGIN`
     - **Value:** `https://your-project-name.vercel.app`
     - **Environments:** Production

3. **Frontend automatically uses:**
   - `VITE_API_URL=/api` (from frontend/.env.production)

---

## File Reference

| File | Purpose | Committed? |
|------|---------|-----------|
| `backend/.env` | Local backend config | ❌ No (in .gitignore) |
| `backend/.env.example` | Template for backend | ✅ Yes |
| `backend/.env.production` | Production template guide | ✅ Yes |
| `frontend/.env` | Local frontend config | ❌ No (in .gitignore) |
| `frontend/.env.local` | Local frontend overrides | ❌ No |
| `frontend/.env.example` | Template for frontend | ✅ Yes |
| `frontend/.env.production` | Production config | ✅ Yes |

---

## Common Issues

### "API calls failing with 401"
- **Cause:** Invalid or missing `FEATHERLESS_API_KEY`
- **Fix:** Check the key is valid at https://featherless.ai/dashboard

### "CORS errors in browser console"
- **Cause:** `CORS_ORIGIN` doesn't match frontend URL
- **Fix:** Update `CORS_ORIGIN` to include your frontend domain

### "API not found (404)"
- **Cause:** Wrong `VITE_API_URL`
- **Fix:** 
  - Local dev: Should be `http://localhost:5000/api`
  - Production: Should be `/api`

### "Changes to .env not taking effect"
- **Fix:** Restart the development server:
  ```bash
  npm run dev:backend   # Backend
  npm run dev:frontend  # Frontend (in another terminal)
  ```

---

## Security Best Practices

✅ **DO:**
- Never commit `.env` files with real keys
- Use `.env.example` as template only
- Rotate API keys periodically
- Use different keys for dev and production
- Keep API keys in Vercel secrets, never in code

❌ **DON'T:**
- Share API keys via email or Slack
- Commit `.env` files to git
- Use same API key for dev and prod
- Expose keys in error messages
- Share production keys with team

---

## Getting Help

- **Featherless AI API Issues:** https://featherless.ai/docs
- **Vercel Environment Variables:** https://vercel.com/docs/environment-variables
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-modes.html
