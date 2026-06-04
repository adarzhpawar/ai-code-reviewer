# Deployment Platform Comparison

## Files by Platform

### Vercel Setup

**Config Files:**
- ✅ `vercel.json` - Multi-service configuration
- ✅ `backend/package.json` - Includes build script
- ✅ `backend/.env.production` - Environment template

**What Vercel Does:**
- Deploys frontend and backend as separate services
- Frontend: Vite build output served as static site
- Backend: Node.js runtime for Express app
- Routing: `/api/*` → backend service, `/` → frontend

---

### Netlify Setup

**Config Files:**
- ✅ `netlify.toml` - Build & functions configuration
- ✅ `backend/.netlify/functions/server.js` - Serverless function handler
- ✅ `backend/package.json` - Includes serverless-http dependency
- ✅ `backend/.env.production` - Environment template

**What Netlify Does:**
- Builds frontend & backend together
- Frontend: Vite build output served as static site
- Backend: Express wrapped as serverless function
- Routing: `/api/*` → netlify function, `/` → frontend

---

## Key Differences

### Architecture
- **Vercel:** Traditional services (frontend + backend server)
- **Netlify:** Frontend + serverless functions (stateless)

### Build Process
- **Vercel:** Detects vercel.json, builds separately
- **Netlify:** Uses netlify.toml, runs `npm run build:all`

### Backend Runtime
- **Vercel:** Persistent Node.js process
- **Netlify:** Serverless functions (request-based, timeout ~26s)

### Ideal For
- **Vercel:** Longer-running backends, real-time connections
- **Netlify:** API-based backends, microservices

---

## Deployment Options

### Option 1: Use Vercel
```bash
1. Go to https://vercel.com
2. Import repository
3. Set environment variables
4. Deploy
```

### Option 2: Use Netlify
```bash
1. Go to https://netlify.com
2. Import repository
3. Set environment variables
4. Deploy
```

### Option 3: Use Both (for testing)
Both configurations coexist in repository:
- `vercel.json` for Vercel
- `netlify.toml` + `backend/.netlify/functions/` for Netlify
- Each platform uses its own config

---

## Environment Variables

Both platforms need:

| Variable | Purpose | Example |
|----------|---------|---------|
| `FEATHERLESS_API_KEY` | AI API access | `rc_xxx...` |
| `CORS_ORIGIN` | Frontend URL | `https://app.vercel.app` |

---

## Recommended Choice

### Choose Vercel if:
- ✅ You need persistent backend connection
- ✅ You want simpler Express.js setup (no serverless wrapper)
- ✅ API calls might take 10-26 seconds
- ✅ You prefer traditional server architecture

### Choose Netlify if:
- ✅ You want to keep everything in one dashboard
- ✅ You're comfortable with serverless functions
- ✅ API responses are typically <5 seconds
- ✅ You want generous free tier limits

---

## Quick Start Guides

- **Vercel:** See `DEPLOYMENT.md`
- **Netlify:** See `NETLIFY_DEPLOYMENT.md`
- **Environment Setup:** See `ENV.md` or `ENV_QUICK_START.md`

---

## Files Summary

```
Repository Structure:

root/
├── vercel.json                          (Vercel config)
├── netlify.toml                         (Netlify config)
├── DEPLOYMENT.md                        (Vercel guide)
├── NETLIFY_DEPLOYMENT.md                (Netlify guide)
│
├── backend/
│   ├── .env                             (Local dev - not committed)
│   ├── .env.example                     (Template - committed)
│   ├── .env.production                  (Production guide)
│   ├── .netlify/functions/server.js     (Netlify function wrapper)
│   ├── server.js                        (Main Express app)
│   ├── package.json                     (Includes serverless-http)
│   └── routes/                          (API routes)
│
├── frontend/
│   ├── .env                             (Local dev - not committed)
│   ├── .env.local                       (Local overrides)
│   ├── .env.example                     (Template - committed)
│   ├── .env.production                  (Production config)
│   ├── package.json                     (Vite + React)
│   ├── vite.config.js                   (Build config)
│   └── src/                             (React code)
│
└── ENV.md                               (Variable reference)
    ENV_QUICK_START.md                   (Setup guide)
```

---

## Testing Your Setup

### Before Deployment
```bash
# Install dependencies
npm run install:all

# Test build
npm run build:all

# Test locally
npm run dev
```

### After Deployment
1. Visit your deployment URL
2. Test frontend loads
3. Test API calls work
4. Check browser console for errors
5. Check platform logs for issues
