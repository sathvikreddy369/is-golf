# Deployment Guide

## Local Development Defaults

- Backend runs on `http://localhost:5001`
- Frontend calls backend via `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

## 1. Supabase (Postgres)

1. Create a Supabase project.
2. Copy the pooled Postgres connection string from Supabase settings.
3. Set `DATABASE_URL` in Render backend service environment variables.
4. Run Prisma migrations against Supabase from backend CI or local:
   - `npx prisma migrate deploy`

## 2. Backend on Render

1. Create a new Web Service from backend root.
2. Build command:
   - `npm install && npm run prisma:generate && npm run build`
3. Start command:
   - `npm run start`
4. Set env vars:
   - `DATABASE_URL`
   - `PORT`
   - `NODE_ENV=production`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=1d`
   - `CLIENT_URL` (Vercel frontend URL)
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `DRAW_POOL_PERCENTAGE=0.5`
   - `CHARITY_MIN_PERCENTAGE=0.1`

## 3. Frontend on Vercel

1. Import frontend project in Vercel.
2. Framework preset: Next.js.
3. Set env vars:
   - `NEXT_PUBLIC_API_URL` = Render backend URL + `/api`
   - `NEXT_PUBLIC_APP_NAME`
4. Deploy.

## 4. Post Deployment Checklist

1. Verify `/health` endpoint on backend.
2. Test signup/login and token-protected routes.
3. Test subscription create with `simulateSuccess=true`.
4. Trigger webhook simulation endpoint.
5. Run draw in simulation and publish mode from admin panel.
6. Check reports endpoint for revenue and charity totals.
