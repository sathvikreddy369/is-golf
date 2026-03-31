# 🔧 DEPLOYMENT TROUBLESHOOTING GUIDE

## Common Issues & Solutions

---

## 1. DATABASE CONNECTION ISSUES

### Problem: "Error: getaddrinfo ENOTFOUND host"
**Cause:** Database URL is invalid or host is unreachable

**Solution:**
```bash
# 1. Verify your Supabase connection string:
# In Supabase Dashboard → Settings → Database
# The URL should look like:
postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres

# 2. Test connection locally first:
export DATABASE_URL="postgresql://user:password@host:port/db"
npm run prisma:migrate

# 3. If using Supabase, wait 2-3 minutes after project creation
# 4. Check if database is in hibernation (free tier)
```

### Problem: "Error: connect ECONNREFUSED - Connection refused"
**Cause:** Database is down or credentials are wrong

**Solution:**
```bash
# 1. Check credentials in Render environment variables
# 2. Verify password doesn't have special characters (escape if needed)
# 3. Check Supabase project status dashboard
# 4. Try resetting password in Supabase
```

### Problem: "Prisma error: The column does not exist"
**Cause:** Migrations didn't run or schema is out of sync

**Solution:**
```bash
# 1. Run migrations manually:
export DATABASE_URL="your_supabase_url"
npx prisma migrate deploy

# 2. If failed, check migration files:
ls backend/prisma/migrations/

# 3. Rollback and retry:
npx prisma migrate resolve --rolled-back 20260331184200_prd_charity_profile_enhancements
```

---

## 2. RENDER DEPLOYMENT ISSUES

### Problem: "Build failed: Command not found: npm"
**Cause:** Node.js not installed or wrong environment

**Solution:**
```
In Render Dashboard:
1. Go to Service Settings
2. Check Environment → Node version (should be 18+)
3. Base Docker Image (should be default)
4. Clear build cache: Delete all previous builds
5. Redeploy
```

### Problem: "Build succeeded but service won't start"
**Cause:** Start command is incorrect or port issue

**Solution:**
```bash
# Check logs in Render dashboard:
# Look for error messages
# Common issues:
# - PORT not set (add PORT=3000 to env vars)
# - npm start fails (ensure dist/ exists after build)

# Fix: Update Start Command to:
npm start
# Or if that fails:
node dist/src/server.js
```

### Problem: "dyno crashed due to SIGTERM"
**Cause:** Process not handling shutdown signals

**Solution:**
```bash
# This is normal if your server doesn't gracefully shutdown
# Add to backend/src/server.ts:

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
```

### Problem: Render service takes forever to deploy
**Cause:** Build is stuck (usually migrations)

**Solution:**
```
1. Click "Cancel Deployment"
2. Go to Logs tab
3. Look for what's stuck
4. In Build Command, increase timeout:
   npm install && timeout 300 npm run build && timeout 300 npx prisma migrate deploy
5. If migrations fail, disable auto-seed:
   npm install && npm run build && npx prisma migrate deploy
```

---

## 3. VERCEL DEPLOYMENT ISSUES

### Problem: "Build failed: Module not found"
**Cause:** Dependencies not installed or import path wrong

**Solution:**
```bash
# 1. Test build locally:
cd frontend
npm run build

# 2. If it works locally but fails on Vercel:
# - Clear cache in Vercel
# - Go to Settings → Git
# - Click "Redeploy"

# 3. Check for import errors:
npm run lint
```

### Problem: "TypeError: Cannot read properties of undefined"
**Cause:** Environment variable not set

**Solution:**
```bash
# 1. Verify in Vercel dashboard:
# Settings → Environment Variables
# Check these are set:
NEXT_PUBLIC_API_URL=[your backend URL]
NEXT_PUBLIC_SUPABASE_URL=[your supabase URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your key]

# 2. All NEXT_PUBLIC_* vars must be set before deploy
# 3. After adding/removing env vars, redeploy:
# Deployments → Failed Build → Redeploy
```

### Problem: "Frontend can't connect to backend (CORS error)"
**Cause:** CORS not configured in backend

**Solution:**
```bash
# 1. Check backend CORS settings:
# In backend/src/app.ts, verify:
cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://is-prd-fs1.vercel.app',
      'http://localhost:3000'
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
})

# 2. Check in Render environment variables:
CLIENT_URL=https://is-prd-fs1.vercel.app

# 3. Restart Render service after changing
```

### Problem: "ISR/Static generation timeout"
**Cause:** Static pages taking too long to generate

**Solution:**
```
In frontend/vercel.json or pages:
// Add to getStaticProps:
export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  }
}
```

---

## 4. AUTHENTICATION ISSUES

### Problem: "Login fails: 401 Unauthorized"
**Cause:** Wrong credentials or user doesn't exist

**Solution:**
```bash
# 1. Check test user exists in database:
# In Supabase SQL Editor:
SELECT * FROM "User" WHERE email = 'testuser1@example.com';

# 2. If no users, seed database:
export DATABASE_URL="your_url"
npm run prisma:seed

# 3. Test login via API:
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@example.com","password":"Test@123"}'

# 4. Check password hashing:
# Default test passwords from seed are hashed with bcrypt
# Don't change seed.ts or password won't work
```

### Problem: "JWT token invalid or expired"
**Cause:** Wrong JWT_SECRET or token generation failed

**Solution:**
```bash
# 1. Ensure JWT_SECRET is same in all environments:
# Render env var: JWT_SECRET=[your secret]
# Generate new: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Check JWT expiration:
# In Render: JWT_EXPIRES_IN=7d (or 7, not 7000)

# 3. If you change JWT_SECRET, all existing tokens become invalid
# Users will need to login again
```

### Problem: "Admin endpoints return 403 Forbidden"
**Cause:** User role is not ADMIN

**Solution:**
```bash
# 1. Check user role in database:
# In Supabase SQL Editor:
SELECT email, role FROM "User" WHERE email = 'admin@golfcharity.app';

# 2. Should show: admin@golfcharity.app | ADMIN

# 3. If not, update:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@golfcharity.app';

# 4. Logout and login again to get new token with ADMIN role
```

---

## 5. ENVIRONMENT VARIABLE ISSUES

### Problem: "Invalid environment variables: DATABASE_URL is required"
**Cause:** Env var not set in Render/Vercel

**Solution:**
```
Render (Backend):
1. Go to Service Settings
2. Scroll to "Environment"
3. Add Variable:
   Key: DATABASE_URL
   Value: postgresql://user:password@host:port/db
4. Click "Save"
5. Redeploy

Vercel (Frontend):
1. Go to Settings → Environment Variables
2. Add for all environments (Production, Preview, Development)
3. Key: NEXT_PUBLIC_API_URL
   Value: https://your-backend.onrender.com/api
4. Deploy
```

### Problem: "Undefined is not a function - env.PORT"
**Cause:** Environment variable parsing failed

**Solution:**
```bash
# In backend, env vars must match expected types
# Check src/config/env.ts

# If error is about PORT:
# In Render, add: PORT=3000

# If error about other vars:
# Check the Zod schema in env.ts
# Make sure all required fields are set
```

---

## 6. DATABASE SEEDING ISSUES

### Problem: "Seed failed: Foreign key constraint violated"
**Cause:** Referenced charity/user doesn't exist

**Solution:**
```bash
# 1. Check seed.ts - charities must be created first
# 2. Verify migration ran before seed

# 3. Manual seed (if needed):
export DATABASE_URL="your_url"
npx prisma db push
npm run prisma:seed

# 4. If still fails, reset database (WARNING: deletes all data):
# In Supabase:
# 1. Go to SQL Editor
# 2. Run: SELECT pg_terminate_backend(...) 
# 3. Drop all tables
# 4. Delete all migrations: rm -rf backend/prisma/migrations/*
# 5. Create new migration: npx prisma migrate dev --name init
# 6. Redeploy
```

### Problem: "Seed didn't create expected records"
**Cause:** Seed ran but created nothing

**Solution:**
```bash
# 1. Check seed output:
# In Render: Go to Logs
# Look for "✅ Seed completed successfully!"

# 2. Verify data in Supabase:
# SQL Editor:
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Charity";

# 3. If count is 0, check seed.ts has no errors:
npx ts-node backend/prisma/seed.ts

# 4. Check Decimal handling (might need adjustment for Supabase)
```

---

## 7. VERCEL + RENDER COMMUNICATION

### Problem: "Frontend gets gateway error connecting to backend"
**Cause:** Render service is sleeping (free tier) or URL wrong

**Solution:**
```bash
# 1. Render free tier sleeps after 15 min of inactivity
# Ping it to wake up:
curl https://is-prd-fs1-backend.onrender.com/api/health

# 2. Verify backend URL in frontend env vars:
# In Vercel Settings → Environment Variables
# NEXT_PUBLIC_API_URL should be exactly:
https://is-prd-fs1-backend.onrender.com/api

# 3. Check for trailing slashes - they matter!
# Wrong: https://is-prd-fs1-backend.onrender.com/api/
# Right: https://is-prd-fs1-backend.onrender.com/api

# 4. Test from browser console:
fetch('https://is-prd-fs1-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 8. SUPABASE-SPECIFIC ISSUES

### Problem: "Your project is idle or paused"
**Cause:** Supabase free tier auto-pauses after 7 days of inactivity

**Solution:**
```
In Supabase Dashboard:
1. You'll see a "Resume Project" button
2. Click to resume
3. Wait 30 seconds for restart
```

### Problem: "Connection pool error: Too many connections"
**Cause:** Too many idle connections

**Solution:**
```
In Supabase → Settings → Database:
1. Use Connection Pooling (already done)
2. Set Max Pool Size: 20
3. Connection Idle Timeout: 30s
```

### Problem: "Row Level Security (RLS) permissions error"
**Cause:** Table has RLS enabled but no policies

**Solution:**
```sql
-- In Supabase SQL Editor:
-- Disable RLS for tables (use with caution in production):
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Charity" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" DISABLE ROW LEVEL SECURITY;
-- etc for all tables
```

---

## 9. QUICK FIXES CHECKLIST

- [ ] Try redeploying on Render (clears cache)
- [ ] Try redeploying on Vercel (clears cache)
- [ ] Check all environment variables are set
- [ ] Verify database connection string is correct
- [ ] Confirm neither service is in hibernation
- [ ] Check service logs for specific error messages
- [ ] Test API directly with curl
- [ ] Verify charities exist in database
- [ ] Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- [ ] Try incognito/private window

---

## 10. GET MORE HELP

### Check Logs
- **Render:** Service Logs tab (shows real-time logs)
- **Vercel:** Deployments tab → click deployment → Logs
- **Supabase:** Database Logs (not verbose but useful)

### Test Endpoints
```bash
# Health check
curl https://is-prd-fs1-backend.onrender.com/api/health

# Get charities (public)
curl https://is-prd-fs1-backend.onrender.com/api/charities

# Login
curl -X POST https://is-prd-fs1-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@example.com","password":"Test@123"}'
```

### Still stuck?
1. Check this guide again for your specific error
2. Google the error message
3. Check service status pages:
   - https://status.render.com
   - https://www.vercelstatus.com
   - https://status.supabase.com
4. Ask in Discord/community forums

---

**Remember:** Most issues resolve with:
1. Clearing cache/redeploying
2. Setting correct environment variables
3. Verifying database connection
4. Checking service logs

Good luck! 🚀

