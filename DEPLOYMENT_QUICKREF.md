# 🚀 Deployment Quick Reference Card

**Print this out or keep it in another window while deploying!**

---

## 📋 Phase 1: Supabase Setup (5 min)

```
1. Go to: https://supabase.com/dashboard
2. Create new project
3. Copy DATABASE_URL from Connection Pooler settings
4. Copy SUPABASE_URL from API settings → URL
5. Copy SUPABASE_ANON_KEY from API settings → anon key
6. Generate JWT_SECRET (min 32 random chars)
   Suggestion: openssl rand -base64 32
```

**Values to collect:**
- [ ] DATABASE_URL = `postgresql://...`
- [ ] SUPABASE_URL = `https://...supabase.co`
- [ ] SUPABASE_ANON_KEY = `eyJhbGc...`
- [ ] JWT_SECRET = `generate-new-random-string`

---

## 📋 Phase 2: Deploy Backend on Render (10 min)

```
1. Go to: https://render.com/dashboard
2. "Create +" → "Web Service"
3. Connect GitHub → Select: is-prd-fs1
4. Settings:
   - Name: is-prd-fs1-backend
   - Branch: main
   - Build Command: npm run build
   - Start Command: npm start
5. Click: "Advanced"
6. Add Environment Variables:
```

**Environment Variables (from Phase 1):**
```
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
JWT_SECRET=your-random-32-char-string
CORS_ORIGIN=https://is-prd-fs1.vercel.app (you'll know after Phase 3)
RAZORPAY_KEY_ID=test_...
RAZORPAY_KEY_SECRET=test_...
DRAW_MONTHLY_PERCENTAGE=10
DRAW_YEARLY_PERCENTAGE=5
DRAW_WEIGHTED_PERCENTAGE=7
```

```
7. Click: "Create Web Service"
8. Wait for build to complete (5-10 min)
9. Get your backend URL from Render dashboard
   Should be: https://is-prd-fs1-backend.onrender.com
```

**✅ Verification:**
```bash
curl https://is-prd-fs1-backend.onrender.com/api/health
# Should return: {"status":"ok","uptime":123...}
```

---

## 📋 Phase 3: Deploy Frontend on Vercel (10 min)

```
1. Go to: https://vercel.com/dashboard
2. "Create +" → "Import Project"
3. Select: is-prd-fs1 repository
4. Framework: Next.js
5. Root Directory: frontend
6. Click: "Advanced" → Environment Variables
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://is-prd-fs1-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

```
7. Click: "Deploy"
8. Wait for deployment (3-5 min)
9. Get your frontend URL from Vercel dashboard
   Should be: https://is-prd-fs1.vercel.app
```

**⚠️ Important:**
- After getting Vercel URL, go back to Render
- Update Render's CORS_ORIGIN = your Vercel URL
- Render will automatically redeploy

---

## 🧪 Phase 4: Verification (5 min)

```bash
# 1. Backend health check
curl https://is-prd-fs1-backend.onrender.com/api/health

# 2. Frontend loads
Open: https://is-prd-fs1.vercel.app
Should see: Login page

# 3. Test login with admin credentials
Email: admin@golfcharity.app
Password: Admin@123

# 4. Check dashboard loads
Should see: Charities, their performance data

# 5. API test (with admin token from login)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://is-prd-fs1-backend.onrender.com/api/charities
```

---

## 🆘 Troubleshooting Quick Fixes

| Issue | Quick Fix | Full Details |
|-------|-----------|--------------|
| Backend returns 503 | Render still building. Wait 5 min. Refresh. | TROUBLESHOOTING.md #2 |
| Frontend shows blank | Check NEXT_PUBLIC_API_URL in Vercel env vars | TROUBLESHOOTING.md #3 |
| Login fails | Verify database auto-seeded. Check JWT_SECRET set. | TROUBLESHOOTING.md #5 |
| CORS error in console | Update Render's CORS_ORIGIN to your Vercel URL | TROUBLESHOOTING.md #7 |
| Database connection error | Verify DATABASE_URL format. Check Supabase online. | TROUBLESHOOTING.md #1 |

**Need more help?** Open: `DEPLOYMENT_TROUBLESHOOTING.md`

---

## 📌 Important URLs

| Service | Dashboard | Status |
|---------|-----------|--------|
| Render Backend | https://render.com/dashboard | [Status page](https://render-status.com) |
| Vercel Frontend | https://vercel.com/dashboard | [Status page](https://www.vercel-status.com) |
| Supabase Database | https://supabase.com/dashboard | [Status page](https://status.supabase.com) |
| Your Frontend | https://is-prd-fs1.vercel.app | ← Your live app! |
| Your Backend API | https://is-prd-fs1-backend.onrender.com/api | ← Your live API! |

---

## 🔑 Test Credentials (Pre-seeded)

```
Admin User:
  Email: admin@golfcharity.app
  Password: Admin@123

Regular Users:
  Email: testuser1@example.com
  Password: Test@123
  
Sample Charities:
  - World Wildlife Fund (WWF)
  - Doctors Without Borders
  - The Nature Conservancy
```

---

## ⏱️ Time Estimate

- Phase 1: 5 min ✓
- Phase 2: 10 min ✓
- Phase 3: 10 min ✓
- Phase 4: 5 min ✓
- **Total: 30 minutes**

---

## 📚 Documentation Map

```
├─ DEPLOYMENT_INDEX.md              ← Start here (overview)
├─ QUICK_START_DEPLOYMENT.md        ← This quick ref with more detail
├─ DEPLOYMENT_GUIDE.md              ← Full detailed guide (10 parts)
├─ DEPLOYMENT_CHECKLIST.md          ← Step-by-step with checkboxes
├─ DEPLOYMENT_TROUBLESHOOTING.md    ← 30+ common issues & fixes
├─ .env.template                    ← Environment variable templates
├─ render.yaml                      ← Optional Render IaC config
└─ frontend/vercel.json             ← Vercel build config
```

---

## ✨ Success Indicators

- ✅ Backend responds to `/api/health`
- ✅ Frontend loads without blank screen
- ✅ Can login with test credentials
- ✅ Database shows 9 seeded users
- ✅ Charities and scores display
- ✅ Can view admin dashboard

If ALL above are ✅, you're live! 🎉

---

**Last Updated:** Deployment package v1.0 - Ready to deploy
**Status:** ✅ Production Ready
**Support:** See DEPLOYMENT_TROUBLESHOOTING.md for any issues
