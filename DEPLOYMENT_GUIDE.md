# 🚀 DEPLOYMENT GUIDE: Render + Vercel + Supabase

## Complete Step-by-Step Deployment Instructions

---

## PART 1: SUPABASE DATABASE SETUP

### Step 1.1: Create Supabase Project
1. Go to https://supabase.com and sign up (or login)
2. Click "New Project"
3. Fill in details:
   - **Name:** is-prd-fs1 (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait for database initialization (5-10 minutes)

### Step 1.2: Get Your Database URL
1. In Supabase dashboard, go to **Settings** → **Database**
2. Find the connection string under "Connection pooling" or "Connection string"
3. Copy the full connection URI (looks like: `postgresql://user:password@host:port/db`)
4. Save this as `DATABASE_URL` - you'll need it later

### Step 1.3: Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - `anon public key` (SUPABASE_ANON_KEY)
   - `service_role secret key` (SUPABASE_SERVICE_ROLE_KEY)
   - `Project URL` (SUPABASE_URL)
3. Save these values

---

## PART 2: PREPARE YOUR APPLICATION

### Step 2.1: Create PostgreSQL-Compatible Connection File

The Supabase database is PostgreSQL-based, so your existing Prisma setup should work directly!

### Step 2.2: Update Environment Variables

Create `.env.production` files for both services:

**Backend - `/backend/.env.production`:**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@supabase-host:5432/postgres
JWT_SECRET=your_jwt_secret_key_here_min_32_chars_long
JWT_EXPIRE=7
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend - `/frontend/.env.production`:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## PART 3: BACKEND DEPLOYMENT ON RENDER

### Step 3.1: Prepare Backend for Production

1. Update `package.json` scripts in `/backend/package.json`:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/src/index.ts",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

2. Ensure you have a `tsconfig.json` in backend that compiles to `dist/`

### Step 3.2: Create Render Account & Deploy

1. Go to https://render.com and sign up
2. Connect your GitHub account (or use Git repo)
3. Click "New" → "Web Service"
4. Select your GitHub repo (is-prd-fs1)
5. Fill in service details:
   - **Name:** is-prd-fs1-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** 
     ```
     npm install && npm run build && npm run prisma:migrate && npm run prisma:seed
     ```
   - **Start Command:** 
     ```
     npm start
     ```
6. Add Environment Variables by clicking "Advanced":
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@supabase-host:5432/postgres
   JWT_SECRET=your_jwt_secret_key_here_min_32_chars_long
   JWT_EXPIRE=7
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```
7. Click "Create Web Service"
8. Wait for deployment (3-5 minutes)
9. Copy your service URL (will be: https://is-prd-fs1-backend.onrender.com)

### Step 3.3: Verify Backend Deployment

After deployment completes:
```bash
curl https://your-backend.onrender.com/api/charities
# Should return list of charities (or error if auth required)
```

---

## PART 4: FRONTEND DEPLOYMENT ON VERCEL

### Step 4.1: Prepare Frontend for Production

1. Ensure `.gitignore` in frontend includes:
```
.env.local
.env.*.local
.next
```

2. Update environment variables in `/frontend/.env.production.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4.2: Deploy to Vercel

1. Go to https://vercel.com and sign up
2. Click "Add New" → "Project"
3. Select your GitHub repo (is-prd-fs1)
4. Configure project:
   - **Framework:** Next.js
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
6. Click "Deploy"
7. Wait for build to complete (5-10 minutes)
8. Your frontend URL will be: https://is-prd-fs1.vercel.app

---

## PART 5: DATABASE MIGRATION & SEEDING

### Step 5.1: Create Prisma Migration for Supabase

Run this locally first to test (with a test Supabase DB):
```bash
cd backend

# Set DATABASE_URL to your Supabase URL
export DATABASE_URL="postgresql://user:password@supabase-host:5432/postgres"

# Apply migrations
npm run prisma:migrate

# Seed data
npm run prisma:seed
```

### Step 5.2: Supabase Schema Verification

In Supabase dashboard:
1. Go to **SQL Editor**
2. Run this to verify tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- User
- Charity
- Subscription
- Payment
- Score
- Draw
- DrawResult
- Winner

### Step 5.3: Verify Data Seeding

In Supabase SQL Editor:
```sql
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as charity_count FROM "Charity";
SELECT COUNT(*) as payment_count FROM "Payment";
```

---

## PART 6: CONFIGURE RENDER DEPLOYMENT WORKFLOW

### Step 6.1: Add Database Migration to Render Deploy

In Render dashboard for your backend service:
1. Go to **Environment** → Add this environment variable:
   ```
   DATABASE_URL=postgresql://user:password@supabase-host:5432/postgres
   ```

2. Update **Build Command** to:
   ```
   npm install && npm run build && npm run prisma:migrate
   ```

3. This will automatically run migrations when you deploy!

### Step 6.2: Enable Deploy Hooks (Optional)

To trigger redeployment when database changes:
1. In Render, go to **Deploy** → **Deploy hooks**
2. Create a hook (you can call it via webhook)

---

## PART 7: ENVIRONMENT CONFIGURATION

### For Production Backend (Render)

Set these in Render dashboard → Environment:
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@supabase:5432/postgres
JWT_SECRET=your_very_long_secret_key_minimum_32_characters
CORS_ORIGIN=https://is-prd-fs1.vercel.app
PORT=3000
```

### For Production Frontend (Vercel)

Set these in Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://is-prd-fs1-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## PART 8: FINAL VERIFICATION CHECKLIST

### Backend (Render)
- [ ] Service deployed successfully
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Health check endpoint responding
- [ ] CORS configured for Vercel domain

### Database (Supabase)
- [ ] Tables created
- [ ] Data seeded (9 users, 3 charities, etc.)
- [ ] Connection pooling enabled
- [ ] Backups configured

### Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variables set
- [ ] API URL pointing to Render backend
- [ ] Can login with test credentials

---

## PART 9: TROUBLESHOOTING

### Issue: Database Connection Fails on Render
**Solution:**
```bash
# Verify connection string locally first:
DATABASE_URL="postgresql://..." npm run prisma:migrate

# Check Supabase firewall:
# In Supabase → Settings → Database → Use Trusted Sources
# Add Render IP if needed
```

### Issue: Frontend Can't Connect to Backend
**Solution:**
1. Verify backend URL in Vercel env vars
2. Check CORS settings in backend (should allow Vercel domain)
3. Test: `curl https://your-backend.onrender.com/api/charities`

### Issue: Migrations Fail on Deploy
**Solution:**
```bash
# Run migrations manually:
export DATABASE_URL="your_supabase_url"
npm run prisma:migrate
npm run prisma:seed
```

### Issue: Data Not Showing in Frontend
**Solution:**
1. Check Supabase SQL Editor for data
2. Verify Prisma schema matches database
3. Check API response: `curl https://your-backend/api/charities`

---

## PART 10: ROLLBACK & RECOVERY

### Quick Rollback to Previous Deploy
1. In Render, go to **Deploy History**
2. Find previous successful deploy
3. Click "Redeploy" button

### Database Backup
1. In Supabase, go to **Backups**
2. Manual backups create on-demand
3. Automatic daily backups enabled

---

## HELPFUL LINKS

- **Supabase Docs:** https://supabase.com/docs
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment

---

## NEXT STEPS AFTER DEPLOYMENT

1. Test all features with deployed services
2. Monitor performance in production dashboards
3. Set up error tracking (Sentry, LogRocket, etc.)
4. Configure email notifications
5. Set up payment gateway (Razorpay) in production
6. Monitor Supabase database usage

---

