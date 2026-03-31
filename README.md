# Golf Charity Subscription Platform

Production-quality full-stack scaffold using Next.js 14 + Express + Prisma + Supabase Postgres.

## Local Defaults

- Backend base URL: `http://localhost:5001`
- Frontend API URL: `http://localhost:5001/api`

## Run From Root

```bash
cd /Users/sathvikreddy/Documents/projects/is-prd-fs1
npm install
npm run dev
```

This starts both backend and frontend together using a root orchestrator script.

## STEP 1: Folder Structure

```
is-prd-fs1/
  backend/
    prisma/
      schema.prisma
      seed.ts
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      types/
      utils/
      validators/
      app.ts
      server.ts
    package.json
    tsconfig.json
    .env.example
  frontend/
    app/
      admin/
      dashboard/
      enter-score/
      my-scores/
      my-winnings/
      subscription/
      settings/
      how-it-works/
      charities/
      pricing/
      login/
      signup/
      layout.tsx
      page.tsx
    components/
      charts/
      layout/
      shared/
      skeletons/
    lib/
      api/
      auth/
      validations/
    package.json
    tailwind.config.ts
    .env.example
  docs/
    deployment.md
```

## STEP 2: Prisma Schema

Implemented in `backend/prisma/schema.prisma` with models:
- User
- Subscription
- Score
- Draw
- DrawResult
- Charity
- Winner
- Payment

Includes enums for role, plans, payment/subscription/draw/winner states.

## STEP 3: Backend Setup

- Express + TypeScript app with MVC modular architecture.
- Security middleware: helmet, CORS, rate limiting, sanitization.
- Error handling middleware + async handler.
- Prisma integration in a dedicated config module.

## STEP 4: Auth System

- Email/password signup and login.
- bcrypt hashing.
- JWT access token generation and verification.
- Protected routes + role-based middleware.

## STEP 5: Main Features

- Subscription creation with Razorpay TEST-mode style simulated order and webhook simulation endpoint.
- Score management with max 5 scores retention and newest-first order.
- Draw run flow with random and weighted modes, simulation/publish status.
- Prize pool and tiered split logic.
- Charity listing and admin CRUD.
- Admin user management, winner verification, and reports.
- User activity history and winnings history endpoints.
- Subscription cancellation endpoint for lifecycle management.

## STEP 6: Frontend Pages

Public:
- /
- /how-it-works
- /charities
- /pricing
- /login
- /signup

User:
- /dashboard
- /enter-score
- /history
- /my-scores
- /my-winnings
- /subscription
- /settings

Admin:
- /admin
- /admin/users
- /admin/draw
- /admin/charities
- /admin/reports

## STEP 7: Integration

- Axios API layer with interceptors.
- JWT token storage and expiry checks.
- React Hook Form + Zod form validation on auth pages.
- Recharts dashboard chart + skeleton loaders.
- Role-based frontend route guarding (public/user/admin redirects).
- Centralized auth state management with app-wide provider.
- Unified member shell navigation with profile/logout controls.

## STEP 8: Deployment

See `docs/deployment.md`.

## Quality Hardening

- Backend unit/integration tests with Vitest + Supertest.
- CI pipeline for backend and frontend builds, Prisma validation/generation, and test execution.

## API Endpoints

Auth:
- POST /api/auth/register
- POST /api/auth/login

User:
- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/history
- GET /api/user/winnings

Subscription:
- POST /api/subscription/create
- GET /api/subscription/status
- PATCH /api/subscription/cancel
- POST /api/subscription/webhook/simulate

Scores:
- POST /api/scores
- GET /api/scores

Draw:
- POST /api/draw/run
- GET /api/draw/latest

Charity:
- GET /api/charities
- POST /api/charities
- PUT /api/charities/:id
- DELETE /api/charities/:id

Admin:
- GET /api/admin/users
- PATCH /api/admin/users/:id/status
- PATCH /api/admin/winners/:id/verify
- GET /api/admin/reports

## Local Run

Backend:
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend env notes:
- Set `PORT=5001`

Frontend:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend env notes:
- Set `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

## Deployable Project Notes

- Root `package.json` provides unified dev/build/test scripts.
- `.gitignore` excludes local env files, node_modules, and build artifacts.
- Backend and frontend remain independently deployable to Render and Vercel.

## Verification Commands

Backend:
```bash
cd backend
npm run test
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```
