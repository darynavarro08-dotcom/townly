# Quormet — What To Do Next

> This doc picks up where the V1 spec ends.  
> Follow the phases in order. Each phase ends with a verify step before moving on.

---

## Phase 0 — Setup (Do this together, Day 1, ~2 hours)

Everyone does this at the same time to avoid "works on my machine" problems later.

### Steps

**1. Create the repo**
- One person creates a GitHub repo named `quormet`
- Add all 3 teammates as collaborators
- Create 3 branches: `frontend`, `backend`, `infra`
- Everyone works on their branch and opens PRs to `main`

**2. Initialize the project**
```bash
npx create-next-app@latest quormet --typescript --tailwind --app
cd quormet
npm install
```

**3. Install shared dependencies**
```bash
npm install @clerk/nextjs stripe @stripe/stripe-js axios zod @supabase/supabase-js
npm install -D prisma
npx prisma init
```

**4. Set up environment variables**
Create a `.env.local` file. Everyone needs this:
```
# Clerk (Person C sets these up at clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase (Person C sets these up at supabase.com)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Person B sets these up at dashboard.stripe.com)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
**Person C** is responsible for creating all accounts and sharing keys with the team via a private Discord message or shared password manager. Never commit `.env.local` to git.

**5. Set up the database**
Person B writes the Prisma schema based on the data models in the V1 spec, then runs:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### ✅ Verify Phase 0
- [ ] All 3 people can clone the repo and run `npm run dev` without errors
- [ ] `localhost:3000` loads the default Next.js page
- [ ] All 3 people have `.env.local` with real values filled in
- [ ] Prisma schema is committed and migration has run
- [ ] Database is reachable (`npx prisma studio` opens without error)
- [ ] Supabase storage bucket named `documents` is created and set to public

---

## Phase 1 — Auth + Skeleton (Day 1 afternoon, ~3 hours)

**Person C** leads this phase. A and B can start their own work in parallel.

### Steps

**1. Install and wrap the app with Clerk**

In `app/layout.tsx`:
```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html><body>{children}</body></html>
    </ClerkProvider>
  )
}
```

**2. Create auth pages**
- `app/sign-in/[[...sign-in]]/page.tsx` — renders `<SignIn />`
- `app/sign-up/[[...sign-up]]/page.tsx` — renders `<SignUp />`

**3. Protect routes**
Add `middleware.ts` at the root:
```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] }
```

**4. Create the onboarding page**
`app/onboarding/page.tsx` — two buttons:
- "Create a community" → form asking for community name → calls `POST /api/community`
- "Join with a code" → input field for join code → calls `POST /api/community/join`

**5. Create skeleton pages (Person A)**
Just empty pages with a title for now — Person B will wire up data later:
- `app/dashboard/page.tsx`
- `app/announcements/page.tsx`
- `app/polls/page.tsx`
- `app/dues/page.tsx`
- `app/documents/page.tsx`
- `app/events/page.tsx`
- `app/directory/page.tsx`

**6. Create the nav sidebar (Person A)**
A persistent left sidebar with links to each page. Show admin-only links conditionally based on user role. This is pure UI for now.

### ✅ Verify Phase 1
- [ ] Visiting `/dashboard` while logged out redirects to `/sign-in`
- [ ] User can sign up, land on `/onboarding`, and create a community
- [ ] User can sign up with a second account, enter the join code, and join the community
- [ ] Both users land on `/dashboard` after onboarding
- [ ] All 7 skeleton pages load without errors
- [ ] Sidebar renders and all nav links work

---

## Phase 2 — Core Features (Day 2, ~6 hours)

Work in parallel. Each person owns their features end-to-end.

---

### Person A — Frontend for all features

Build the UI for each feature page. Use placeholder/hardcoded data first, then swap in real API calls once Person B has endpoints ready. Coordinate on what the API response shape looks like before starting — agree on it in 10 minutes and write it in a shared `API_CONTRACTS.md` file in the repo.

**Priority order:**
1. Announcements page (simplest, good warmup)
2. Polls page (most important for the demo)
3. Dashboard summary page
4. Dues page
5. Events page
6. Documents page
7. Directory page

---

### Person B — Backend API routes

Build each API route in Next.js under `app/api/`. Use Prisma for all DB queries. Validate all inputs with Zod.

**Priority order:**
1. `POST /api/community` and `POST /api/community/join` (needed for onboarding)
2. Announcements CRUD
3. Polls + voting
4. Dues + Stripe checkout + webhook
5. Events + RSVP
6. Documents — upload files to Supabase Storage, save public URL to DB
7. Directory

**Stripe webhook setup:**
```bash
# Install Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/dues/webhook
```

---

### Person C — Deployment + Demo Data

**1. Deploy to Vercel**
```bash
npm install -g vercel
vercel
```
- Connect to GitHub repo
- Add all environment variables in Vercel dashboard
- Set `NEXT_PUBLIC_APP_URL` to the live Vercel URL

**2. Set up Supabase for production**
- Go to [supabase.com](https://supabase.com) and create a new project
- Copy the connection string from Settings → Database → Connection string (URI mode)
- Append `?pgbouncer=true&connection_limit=1` to the URL — this is required for Vercel's serverless functions to avoid exhausting DB connections
- Final URL format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`
- Copy `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into Vercel env vars
- Run migrations against production: `npx prisma migrate deploy`
- Create a storage bucket named `documents` in the Supabase dashboard, set it to **public**

**3. Seed demo data**
Create `prisma/seed.ts` with:
- 1 community called "Maplewood HOA"
- 1 admin user + 4 member users
- 3 announcements
- 2 polls (one active, one closed with results)
- 1 unpaid dues record for one member
- 2 upcoming events
- 3 documents

Run with: `npx prisma db seed`

**4. Start on the pitch deck**
Use the summary, feature list, and SDG alignment from earlier conversations. Slides needed:
1. Problem
2. Solution + product name/logo
3. Live demo (this is the most important slide — just a link to the app)
4. SDG 11 + 16 alignment
5. Business model / revenue
6. Market size
7. Team

### ✅ Verify Phase 2
- [ ] Admin can create an announcement and it appears for members
- [ ] Admin can create a poll, member can vote, results show correctly
- [ ] Member can click "Pay Dues" and complete a Stripe test payment
- [ ] Stripe webhook updates the member's `dues_paid` status in the database
- [ ] Admin can upload a document to Supabase Storage and member can download it via the public URL
- [ ] Admin can create an event and member can RSVP
- [ ] App is live on Vercel at a public URL
- [ ] Seed data loads correctly in the deployed app

---

## Phase 3 — Polish (Day 2 evening, ~2 hours)

Only do this after Phase 2 verify passes completely.

- [ ] Fix any broken layouts on mobile (basic responsive check)
- [ ] Add loading states to any buttons that call the API
- [ ] Add error messages if API calls fail
- [ ] Make sure the dashboard actually shows real data (not hardcoded)
- [ ] Replace any placeholder text or "TODO" labels
- [ ] Test the full user flow end-to-end on the live Vercel URL with a fresh account
- [ ] Record a 2-minute demo video as backup in case live demo fails

### ✅ Verify Phase 3
- [ ] Full flow works on the live URL: sign up → onboard → view dashboard → vote → pay dues
- [ ] No console errors on any page
- [ ] Pitch deck is complete with all 7 slides
- [ ] GitHub repo is clean (no `.env` files committed, README exists)
- [ ] Demo video is recorded and saved

---

## Final Submission Checklist

- [ ] GitHub repo link (public or shared with judges)
- [ ] Live app URL (Vercel)
- [ ] Pitch deck or video
- [ ] README with: what it is, how to run it locally, SDG alignment explanation
- [ ] If applying for **Wolfram Award**: integrate a Wolfram data visualization (e.g. community analytics chart using Wolfram Language) — do this only if Phase 2 is fully done
- [ ] If applying for **Business Innovator Award**: add a slide with revenue model, TAM/SAM/SOM market size numbers, and a 12-month growth plan

---

## If You Get Stuck

| Problem | Fix |
|---------|-----|
| Clerk auth not working | Check that middleware.ts is at the root, not inside `/app` |
| Prisma can't connect | Make sure `DATABASE_URL` ends with `?pgbouncer=true&connection_limit=1` on Vercel |
| Supabase file upload failing | Check that the `documents` bucket exists and is set to public in Supabase dashboard |
| Stripe webhook not firing locally | Run `stripe listen` CLI in a separate terminal |
| Vercel build failing | Check that all env vars are set in Vercel dashboard, not just `.env.local` |
| Merge conflicts | Each person stays on their branch and only touches their files — coordinate before touching shared files like `layout.tsx` |