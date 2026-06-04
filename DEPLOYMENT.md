# Deployment Guide - CodeReview AI

This project is configured for deployment on both **Vercel** and **Netlify**. Choose the platform that best suits your needs.

## Quick Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Setup** | Auto-detects vercel.json | Auto-detects netlify.toml |
| **Function Duration** | 10 seconds | 26 seconds |
| **Free Tier** | ✅ Generous | ✅ Generous |
| **Best for** | API-heavy apps | Mixed workloads |
| **Link** | https://vercel.com | https://netlify.com |

---

## Deployment on Vercel

See **`DEPLOYMENT.md`** for complete Vercel setup guide.

### Quick Start:
1. Go to vercel.com
2. Import `adarzhpawar/code-reviewer` repository
3. Vercel auto-detects `vercel.json`
4. Set environment variables (Project Settings → Environment Variables)
5. Click Deploy

### Environment Variables for Vercel:
- `FEATHERLESS_API_KEY` - Your API key
- `CORS_ORIGIN` - Your Vercel URL

---

## Deployment on Netlify

See **`NETLIFY_DEPLOYMENT.md`** for complete Netlify setup guide.

### Quick Start:
1. Go to netlify.com
2. Click "Add new site" → "Import existing project"
3. Connect GitHub and select repository
4. Netlify auto-detects `netlify.toml`
5. Set environment variables (Site Settings → Environment Variables)
6. Deploy

### Environment Variables for Netlify:
- `FEATHERLESS_API_KEY` - Your API key
- `CORS_ORIGIN` - Your Netlify URL

---

## Configuration Files

### Vercel Setup
- **`vercel.json`** - Vercel configuration with multi-service setup
- **`backend/.env.production`** - Backend production environment template

### Netlify Setup
- **`netlify.toml`** - Netlify configuration with build & functions
- **`backend/.netlify/functions/server.js`** - Serverless function handler
- **`backend/package.json`** - Includes `serverless-http` for Netlify

### Both Platforms
- **`frontend/.env.production`** - Frontend production config (uses `/api`)
- **`backend/.env.example`** - Backend environment template
- **`frontend/.env.example`** - Frontend environment template

---

## Environment Variables

### Required for Both Platforms

```bash
FEATHERLESS_API_KEY=your-api-key-from-featherless.ai
CORS_ORIGIN=your-deployment-url
```

### Get API Key:
1. Visit https://featherless.ai
2. Sign up → API Keys
3. Create new key
4. Copy and set in your platform

### Get CORS_ORIGIN:
- **Vercel:** `https://your-project.vercel.app`
- **Netlify:** `https://your-project.netlify.app`

---

## Local Development

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

---

## Switching Platforms

Both configurations can coexist in your repository:

- **Vercel configuration:** `vercel.json` + builds (traditional multi-service)
- **Netlify configuration:** `netlify.toml` + functions (serverless approach)

Choose one platform to deploy, the other config won't interfere.

---

## Build & Deploy Process

### Vercel
```
Push to GitHub
→ Vercel auto-detects changes
→ Builds frontend (Vite)
→ Prepares backend (Node.js)
→ Routes /api to backend
```

### Netlify
```
Push to GitHub
→ Netlify auto-detects changes
→ Runs: npm run build:all
→ Builds frontend (Vite → dist/)
→ Builds backend function
→ Routes /api to serverless function
```

---

## Troubleshooting

### API calls failing
1. Check environment variables are set
2. Verify `FEATHERLESS_API_KEY` is valid
3. Ensure `CORS_ORIGIN` matches your deployment URL
4. Check platform-specific logs

### Frontend showing old version
- Clear browser cache (Cmd/Ctrl + Shift + Delete)
- Force refresh in platform dashboard

### Build fails
- Check build logs in platform dashboard
- Verify `package.json` scripts: `npm run build:all`
- Ensure dependencies install correctly

---

## Support

### Vercel Deployment Issues
- See: https://vercel.com/docs
- Logs: Vercel Dashboard → Deployments

### Netlify Deployment Issues
- See: https://docs.netlify.com
- Logs: Netlify Dashboard → Functions & Deployments

### API Issues
- Featherless AI: https://featherless.ai/docs
- Your Backend Logs: Platform-specific function/deployment logs
