# 🚀 DEPLOYMENT QUICK START - 3 SERVICES IN 30 MINUTES

## YOU WILL NEED THESE ACCOUNTS
1. **Supabase** (PostgreSQL Database) - https://supabase.com
2. **Render** (Backend Hosting) - https://render.com  
3. **Vercel** (Frontend Hosting) - https://vercel.com
4. **GitHub** (Repository) - Already have it!

---

## PHASE 1: SUPABASE SETUP (5 minutes)

### Quick Steps:
```
1. Go to https://supabase.com → Sign up
2. Create new project:
   - Name: is-prd-fs1-db
   - Password: [Save this securely!]
   - Region: [Pick closest to you]
3. Wait for "Project is ready" message
4. Go to Settings → Database
5. Copy CONNECTION STRING (the full postgresql://... URL)
6. Go to Settings → API
7. Copy: Project URL, Anon Key, Service Role Key
```

### Store These Values:
```
📌 DATABASE_URL = [postgresql://... string]
📌 SUPABASE_URL = [https://xxxxx.supabase.co]
📌 SUPABASE_ANON_KEY = [your_anon_key]
```

💾 **PUT THESE IN A PASSWORD MANAGER!**

---

## PHASE 2: BACKEND ON RENDER (10 minutes)

### Step-by-Step:

1. **Go to https://render.com**
   - Sign up with GitHub
   - Authorize access to repos

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Select "is-prd-fs1" repository
   - Choose "backend" root directory

3. **Configure:**
   ```
   Name: is-prd-fs1-backend
   Environment: Node
   Region: [default]
   
   Build Command:
   npm install && npm run build && npx prisma migrate deploy
   
   Start Command:
   npm start
   ```

4. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV = production
   DATABASE_URL = [Your DATABASE_URL from Supabase]
   JWT_SECRET = [Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   JWT_EXPIRES_IN = 7d
   PORT = 3000
   CLIENT_URL = https://is-prd-fs1.vercel.app
   CLIENT_URLS = http://localhost:3000,http://localhost:3001
   RAZORPAY_KEY_ID = [placeholder - add later]
   RAZORPAY_KEY_SECRET = [placeholder - add later]
   RAZORPAY_WEBHOOK_SECRET = [placeholder - add later]
   DRAW_POOL_PERCENTAGE = 0.5
   CHARITY_MIN_PERCENTAGE = 0.1
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes
   - Should see "Deployed ✓"

**✅ Copy your backend URL** (shows at top, like: `https://is-prd-fs1-backend.onrender.com`)

---

## PHASE 3: FRONTEND ON VERCEL (10 minutes)

1. **Go to https://vercel.com**
   - Sign up with GitHub
   - Authorize access

2. **Import Project:**
   - Click "Add New" → "Project"
   - Search "is-prd-fs1"
   - Click "Import"

3. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root: frontend

4. **Add Environment Variables:**
   - Click "Environment Variables" button
   - Add 3 variables:
   
   ```
   NEXT_PUBLIC_API_URL = https://is-prd-fs1-backend.onrender.com/api
   [Use your actual Render URL from Phase 2]
   
   NEXT_PUBLIC_SUPABASE_URL = [Your SUPABASE_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your SUPABASE_ANON_KEY]
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 5-10 minutes
   - Should see build complete

**✅ Copy your frontend URL** (given at end of deploy, like: `https://is-prd-fs1.vercel.app`)

---

## PHASE 4: VERIFY EVERYTHING (5 minutes)

### Test Backend:
```bash
# Should return {"status":"ok"}
curl https://is-prd-fs1-backend.onrender.com/api/health

# Should return charity list (or error if auth required)
curl https://is-prd-fs1-backend.onrender.com/api/charities
```

### Test Charities Page:
```
Open in browser: https://is-prd-fs1.vercel.app
Should see charities listed
```

### Test Login:
```
1. Click "Login" button
2. Enter: testuser1@example.com
3. Password: Test@123
4. Should login successfully
5. Should see dashboard/charities
```

### Test Database:
```
In Supabase Dashboard:
1. Go to "Table Editor"
2. Click on "User" table
3. Should see 9 users (including testuser1, testuser2, admin)
4. Click on "Charity" table
5. Should see 3 charities
```

---

## 🎉 YOU'RE DONE!

Your application is now live on:
- **Frontend:** https://is-prd-fs1.vercel.app
- **Backend:** https://is-prd-fs1-backend.onrender.com
- **Database:** Supabase (PostgreSQL)

All test data is seeded automatically!

---

## 📝 Test Credentials

```
Admin Account:
- Email: admin@golfcharity.app
- Password: Admin@123

Test User 1:
- Email: testuser1@example.com
- Password: Test@123

Test User 2:
- Email: testuser2@example.com
- Password: Test@123
```

---

## 🚨 If Something Goes Wrong

### Backend won't deploy:
1. Check Render Logs tab for error message
2. Most common: DATABASE_URL wrong or missing
3. Copy exactly from Supabase (no extra spaces)

### Frontend shows "Cannot reach backend":
1. Check Vercel env vars are set
2. Check NEXT_PUBLIC_API_URL value is correct
3. Redeploy Vercel (it reads env vars at build time)

### "No charities" or "user not found":
1. Check Supabase has data:
   - SQL Editor: `SELECT COUNT(*) FROM "Charity";`
   - Should be 3
2. If 0, re-run seed:
   - Render dashboard → Service Logs
   - Look for "Seed completed"
   - If not there, try redeploying

### Nothing works:
1. Check https://status.render.com - any outages?
2. Check https://www.vercelstatus.com - any outages?
3. Try the detailed troubleshooting guide:
   - See `DEPLOYMENT_TROUBLESHOOTING.md`

---

## 📚 For More Details

- **Full Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** `DEPLOYMENT_TROUBLESHOOTING.md`
- **Complete Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

## 🔄 Automatic Redeployment

Once deployed:
- **Frontend:** Auto-redeploys when you push to `main` branch
- **Backend:** Auto-redeploys when you push to `main` branch
- Both use GitHub integration (no manual action needed)

---

**That's it! You're live! 🚀**

Questions? Check the guides above or run the tests locally first.

