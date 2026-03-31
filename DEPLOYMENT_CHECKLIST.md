# 📋 DEPLOYMENT CHECKLIST & QUICK START GUIDE

## Phase 1: Supabase Setup (10 minutes)

### Step 1: Create Supabase Account & Project
- [ ] Go to https://supabase.com
- [ ] Sign up with GitHub or email
- [ ] Click "New Project"
- [ ] Fill in:
  - **Project Name:** is-prd-fs1-db
  - **Database Password:** Create strong password and SAVE IT
  - **Region:** Choose your closest region
- [ ] Click "Create new project"
- [ ] Wait for initialization (5-10 min)

### Step 2: Get Database Connection String
```bash
In Supabase Dashboard:
1. Click on Settings (gear icon)
2. Go to Database
3. Under "Connection pooling" section, copy the connection string
4. It looks like: postgresql://postgres.xxxxx:password@aws-1-us-west-1.pooler.supabase.com:6543/postgres
```

### Step 3: Get API Keys
```bash
In Supabase Dashboard:
1. Click on Settings
2. Go to API
3. Copy and save:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - Anon public key
   - Service role key
```

✅ You now have:
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

---

## Phase 2: Backend Deployment on Render (15 minutes)

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Authorize Render to access your GitHub repos

### Step 2: Deploy Backend Service
```
In Render Dashboard:
1. Click "New" button (top right)
2. Select "Web Service"
3. Connect GitHub → Select "is-prd-fs1" repository
4. Fill in:
   - Name: is-prd-fs1-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command:
     npm install && npm run build && npx prisma migrate deploy && npx prisma db seed
   - Start Command:
     npm start
```

### Step 3: Add Environment Variables (IMPORTANT!)
```
In Render Service Settings → Environment:
Add these variables:

NODE_ENV=production
DATABASE_URL=[Your Supabase connection string from Step 2]
JWT_SECRET=[Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRES_IN=7d
PORT=3000
CLIENT_URL=https://is-prd-fs1.vercel.app
CLIENT_URLS=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
DRAW_POOL_PERCENTAGE=0.5
CHARITY_MIN_PERCENTAGE=0.1
```

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy your service URL (will show at top)

**Your backend URL will be:** `https://is-prd-fs1-backend.onrender.com`

### Step 5: Verify Backend
```bash
# Test the health endpoint
curl https://is-prd-fs1-backend.onrender.com/api/health

# Should return: {"status":"ok"}
```

✅ Backend deployed successfully!

---

## Phase 3: Frontend Deployment on Vercel (10 minutes)

### Step 1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub account
- [ ] Authorize Vercel

### Step 2: Import Project
```
In Vercel Dashboard:
1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Search for "is-prd-fs1"
4. Click Import
```

### Step 3: Configure Project
```
Project Settings:
1. Framework Preset: Select Next.js
2. Root Directory: frontend
3. Keep other defaults
4. Click "Environment Variables"
```

### Step 4: Add Environment Variables
```
NEXT_PUBLIC_API_URL=https://is-prd-fs1-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your anon key from Supabase]

Click ADD for each variable
```

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check build logs for errors
- [ ] Once complete, you'll get a URL

**Your frontend URL will be:** `https://is-prd-fs1.vercel.app`

✅ Frontend deployed successfully!

---

## Phase 4: Verify Everything Works (5 minutes)

### Test Backend
```bash
# 1. Health check
curl https://is-prd-fs1-backend.onrender.com/api/health

# 2. Get charities
curl https://is-prd-fs1-backend.onrender.com/api/charities

# 3. Login test
curl -X POST https://is-prd-fs1-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@golfcharity.app","password":"Admin@123"}'
```

### Test Frontend
- [ ] Open https://is-prd-fs1.vercel.app in browser
- [ ] Try to login with: admin@golfcharity.app / Admin@123
- [ ] Check if you can see charities
- [ ] Try navigating to different pages

### Check Database
```bash
In Supabase Dashboard:
1. Go to SQL Editor
2. Run: SELECT COUNT(*) FROM "User";
3. Run: SELECT COUNT(*) FROM "Charity";
4. Verify data exists
```

---

## Phase 5: Add Sample Data to Supabase (Optional)

Your seed data should already be in Supabase from deployment!

If you want to add more or verify:

### Via Supabase UI
```
In Supabase Dashboard:
1. Go to Table Editor
2. You should see these tables:
   - User (9 records)
   - Charity (3 records)
   - Subscription (3 records)
   - Payment (2 records)
   - Score (8+ records)
   - Draw (4 records)
   - Winner (3 records)
```

### Via CLI (if needed)
```bash
export DATABASE_URL="[Your Supabase connection string]"
cd backend
npm run prisma:seed
```

---

## Phase 6: Configure Updates (Optional but Recommended)

### Enable Auto Redeployment
1. **Render:** In Settings → Auto-deploy is enabled by default
2. **Vercel:** In Settings → Auto-deploy is enabled by default
3. Both will redeploy when you push to main branch

### Custom Domain (Optional)
- **Vercel:** In Domains, add your custom domain
- **Render:** In Settings → Custom Domain, add your domain

### Monitoring & Logs
- **Render:** Go to Logs tab to see backend logs
- **Vercel:** Go to Deployments → click deployment → Logs
- **Supabase:** Go to Database → Integrations for external tools

---

## 🚨 Important: Update Configuration After Deployment

### Backend Needs to Know Frontend URL
If you use a custom domain, update in Render:
```
CLIENT_URL=[your-frontend-url]
```

### Frontend Needs Backend URL
If backend URL changes, update in Vercel:
```
NEXT_PUBLIC_API_URL=[your-backend-url]/api
```

---

## Troubleshooting Quick Fixes

### ❌ Backend deployment fails
```bash
# Check if database URL is correct
# Verify all required env vars are set
# Check Render Build/Start logs for specific error
```

### ❌ Frontend can't connect to backend
```bash
# 1. Check NEXT_PUBLIC_API_URL is set correctly
# 2. Verify backend is running
# 3. Check CORS settings in backend
# 4. Check browser console for exact error
```

### ❌ Database tables don't exist
```bash
# In Render, manually run migration:
# Add this to environment: FORCE_MIGRATE=true
# Then redeploy
```

### ❌ Login fails from frontend
```bash
# Check if seed data exists in Supabase
# Try the API directly:
curl -X POST https://is-prd-fs1-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@example.com","password":"Test@123"}'
```

---

## 📞 Test Credentials for Production

```
Admin User:
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

## 🎯 Final Verification Checklist

- [ ] Supabase project created and initialized
- [ ] Backend deployed on Render with environment variables
- [ ] Frontend deployed on Vercel with environment variables
- [ ] Health check returning OK
- [ ] Can login from frontend
- [ ] Charities display in frontend
- [ ] Database has seed data (9 users, 3 charities, etc.)
- [ ] Both services have auto-deploy enabled
- [ ] Monitoring/logs are accessible

---

## 📈 What's Next

1. **Test all features** with deployed services
2. **Monitor performance** in Render/Vercel dashboards
3. **Set up custom domain** if you have one
4. **Configure payment gateway** (Razorpay in production)
5. **Add error tracking** (Sentry optional)
6. **Enable backups** in Supabase (automatic daily)

---

**You're ready to go live! 🚀**

