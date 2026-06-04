# Netlify Deployment Guide - CodeReview AI

## Quick Start for Netlify Deployment

### Prerequisites
- Netlify account (free at https://netlify.com)
- GitHub account with this repository pushed

### Step 1: Connect Repository to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize
4. Select the `adarzhpawar/code-reviewer` repository
5. Netlify will auto-detect `netlify.toml` configuration

### Step 2: Configure Build Settings

Netlify should auto-detect:
- **Build command:** `npm run build:all`
- **Publish directory:** `frontend/dist`
- **Functions directory:** `backend/.netlify/functions`

If not, manually set them in Site Settings → Build & Deploy → Build settings.

### Step 3: Set Environment Variables

In Netlify, go to Site Settings → Environment → Environment Variables:

**Add these variables:**

| Variable | Value | Scope |
|----------|-------|-------|
| `FEATHERLESS_API_KEY` | Your API key from https://featherless.ai | All |
| `CORS_ORIGIN` | Your Netlify URL (shown after first deploy) | All |
| `NODE_ENV` | `production` | Production |

**Get your Netlify URL:**
- After first deploy, Netlify gives you a URL like `https://your-project.netlify.app`
- Use this as your `CORS_ORIGIN`

### Step 4: Deploy

1. Push changes to GitHub
2. Netlify automatically deploys on push
3. Check deploy status in Netlify dashboard

---

## Architecture

### Frontend
- **Type:** Static site
- **Built with:** Vite + React
- **Location:** `frontend/dist` (after build)
- **Served from:** Root domain
- **API calls:** `/api/*` (relative URLs)

### Backend
- **Type:** Netlify Functions (serverless)
- **Built with:** Express.js wrapped with serverless-http
- **Location:** `backend/.netlify/functions/server.js`
- **Endpoint:** `/.netlify/functions/server`
- **Routes:** `/api/*` → Netlify Function

### Routing
```
User Request → Netlify Edge
  ↓
/api/* → /.netlify/functions/server (Backend Function)
  ↓
/* → frontend/dist (Frontend SPA)
  ↓
/index.html (SPA fallback)
```

---

## Configuration Files

- **`netlify.toml`** - Main deployment configuration
  - Build command
  - Publish directory
  - Redirects for API routing and SPA

- **`backend/.netlify/functions/server.js`** - Netlify Function handler
  - Wraps Express app with serverless-http
  - Exports handler for Netlify

- **`backend/package.json`** - Includes `serverless-http` dependency

- **`backend/.env.production`** - Production environment template

- **`frontend/.env.production`** - Uses `/api` endpoint

---

## Local Development vs Production

### Local Development
```bash
npm run dev
# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:5173
# Frontend proxies /api to backend via vite config
```

### Production (Netlify)
```
Frontend & Backend deployed together
Frontend calls /api endpoints
Netlify redirects /api to serverless function
All on same domain
```

---

## Environment Variables

### Required for Production

**`FEATHERLESS_API_KEY`**
- Get from https://featherless.ai/dashboard
- Set in Netlify Environment Variables

**`CORS_ORIGIN`**
- Your Netlify deployment URL
- Format: `https://your-project.netlify.app`
- Set in Netlify Environment Variables

### Optional

**`NODE_ENV`**
- Set to `production` on Netlify
- Netlify auto-sets this, but you can override

---

## Common Issues & Troubleshooting

### "API not found (404)"
**Cause:** Backend function not deploying correctly
**Fix:**
- Check `netlify.toml` functions path is correct
- Verify `backend/.netlify/functions/server.js` exists
- Check Netlify build logs for errors

### "CORS errors in browser"
**Cause:** `CORS_ORIGIN` not set or incorrect
**Fix:**
- Set `CORS_ORIGIN` to your Netlify URL
- Must include `https://` and `.netlify.app`
- Example: `https://codereview-ai.netlify.app`

### "502 Bad Gateway on API calls"
**Cause:** Function error or timeout
**Fix:**
- Check Netlify Function logs (Netlify Dashboard → Functions)
- Verify `FEATHERLESS_API_KEY` is set
- Check backend routes are correct

### "Frontend showing old version"
**Fix:**
- Hard refresh: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
- Clear Netlify cache: Site Settings → Deployments → Clear cache & redeploy

### "Build fails"
**Fix:**
- Check build logs: Deployments → Latest → Build log
- Ensure both `frontend/` and `backend/` have node_modules
- Verify all dependencies install correctly

---

## Deployment Process

### Automatic (Recommended)
1. Make changes locally
2. Commit and push to GitHub
3. Netlify automatically deploys
4. Check status in Netlify dashboard

### Manual Deploy
```bash
# Install Netlify CLI (one time)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## Monitoring & Logs

### View Logs
- **Build logs:** Netlify Dashboard → Deployments → Select Deploy → Build log
- **Function logs:** Netlify Dashboard → Functions → server → Logs
- **Real-time logs:** `netlify logs --tail --function server`

### Check Status
- Netlify Dashboard shows deployment status
- Green = Success
- Yellow = In progress
- Red = Failed

---

## Compared to Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Free Tier** | ✅ Generous | ✅ Generous |
| **Function Duration** | 26 seconds | 10 seconds |
| **API Setup** | netlify.toml | vercel.json |
| **Backend** | Netlify Functions | Vercel Functions |
| **Cost** | $11/mo for 125k/month | $20/mo for 1M reqs |

---

## Additional Resources

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Functions:** https://docs.netlify.com/functions/overview
- **serverless-http:** https://github.com/dougmoscrop/serverless-http
- **Featherless AI:** https://featherless.ai/docs
- **Environment Variables:** https://docs.netlify.com/configure-builds/environment

---

## Next Steps

1. ✅ Push code to GitHub (already done)
2. ⬜ Go to netlify.com and connect repository
3. ⬜ Set environment variables in Netlify
4. ⬜ Trigger deploy (automatic on push)
5. ⬜ Test API endpoints

Your project is ready for Netlify deployment! 🚀
