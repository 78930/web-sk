# Sketu — Web App

A modern, responsive, **dynamic** website for Sketu, the factory ↔ worker job
marketplace. It is a Vite + React + Tailwind single-page app that talks to your
**existing** Express/MongoDB backend (`../backend-api`) — reusing the same REST
APIs, auth flow, and data shapes as the mobile app. No backend changes required.

## What it includes

**Public pages**

- `/` — Home: hero, live open-job count, features, how-it-works, latest jobs (live from MongoDB), CTA
- `/jobs` — Job board with live filters (search, area, role, skill) → `GET /api/jobs`
- `/jobs/:id` — Job detail + one-click apply for logged-in workers → `GET /api/jobs/:id`, `POST /api/jobs/:id/apply`
- `/talent` — Worker search with filters → `GET /api/workers/search`
- `/features` — How it works (workers + factories)
- `/about`, `/contact`, plus a 404 page

**Auth** (mirrors the mobile app exactly — phone + name, no passwords)

- `/login` — Name + phone, or phone OTP → `POST /api/auth/login`, `/request-otp`, `/verify-otp`
- `/register` — Worker or Factory → `POST /api/auth/register`

**Protected dashboards** (`/dashboard`, role-aware)

- **Worker**: profile view/edit + application history with status → `/api/workers/me/profile`, `/api/workers/me/applications`
- **Factory**: live KPI summary, post a job, manage postings, view applicants, shortlist & hire → `/api/factories/dashboard/summary`, `/api/factories/jobs`, `POST /api/jobs`, `/api/jobs/:id/applications`, `/api/applications/:id/shortlist`, `/hire`

**UX**: light/dark mode, mobile-first responsive layout, loading skeletons, empty
states, error states with retry, smooth hover/transition effects, and per-page
SEO titles + meta descriptions (via `react-helmet-async`).

## Where this folder lives

```
sketu-clean/
├── backend-api/      ← existing Express + MongoDB API (unchanged)
├── mobile-app/       ← existing Expo app (unchanged)
└── web/              ← THIS web app (new)
```

## Run it locally

1. **Start the backend** (in `../backend-api`):

   ```bash
   cd ../backend-api
   npm install
   npm run dev          # serves http://localhost:5000
   ```

   Make sure `backend-api/.env` has `CLIENT_ORIGIN=http://localhost:5173`
   (the web dev server origin) — or keep it as `*` for local development.

2. **Start the web app** (in this folder):

   ```bash
   npm install
   npm run dev          # serves http://localhost:5173
   ```

   In development, requests to `/api/*` are proxied to the backend
   (`http://localhost:5000`) by `vite.config.js`, so there are no CORS issues
   and no API URL to configure.

## Environment variables

Copy `.env.example` to `.env`. For local dev you can leave it as-is.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Production API origin (e.g. `https://api.yourdomain.com`). Leave **empty** in dev to use the Vite proxy. |
| `VITE_API_PROXY_TARGET` | Dev-only. Where the Vite proxy forwards `/api` (default `http://localhost:5000`). Never shipped to the browser. |

Only the JWT (returned by your existing auth endpoints) is stored client-side, in
`localStorage`. No secrets live in the frontend.

## Build & deploy

```bash
npm run build        # outputs static files to web/dist
npm run preview      # preview the production build locally
```

Deploy `web/dist` to any static host (Vercel, Netlify, Nginx, S3+CloudFront).
For production set `VITE_API_BASE_URL` to your deployed backend origin **before**
building, and add that web origin to the backend's `CLIENT_ORIGIN`.

Because it's a single-page app, configure your host to rewrite all unknown paths
to `/index.html` (Vercel/Netlify do this automatically; for Nginx use
`try_files $uri /index.html;`).

## How existing code is reused

- `src/lib/api.js`, `src/lib/mappers.js` are direct ports of
  `mobile-app/lib/*` — same request contract and the same field normalisation,
  so the web and mobile clients agree on every data shape.
- `src/services/*` mirror `mobile-app/services/*` one-to-one (same endpoints,
  same payloads).
- Auth (phone + name + OTP, JWT, `WORKER`/`FACTORY` roles) matches
  `backend-api/src/routes/auth.routes.ts` exactly.

Nothing in `backend-api` or `mobile-app` was modified.

## File map

```
web/
├── index.html, vite.config.js, tailwind.config.js, postcss.config.js
├── .env, .env.example
├── public/favicon.svg
└── src/
    ├── main.jsx, App.jsx, index.css
    ├── lib/         api.js · storage.js · mappers.js
    ├── services/    auth.js · jobs.js · workers.js · factory.js · applications.js
    ├── context/     AuthContext.jsx · ThemeContext.jsx
    ├── routes/      ProtectedRoute.jsx
    ├── components/
    │   ├── layout/  Navbar.jsx · Footer.jsx · Layout.jsx
    │   ├── ui/       Icons.jsx · Seo.jsx · States.jsx · Pill.jsx · Field.jsx
    │   ├── jobs/     JobCard.jsx
    │   └── talent/   WorkerCard.jsx
    └── pages/        Home · Jobs · JobDetail · Talent · About · Features ·
                      Contact · Login · Register · Dashboard ·
                      WorkerDashboard · FactoryDashboard · NotFound
```


<!-- QA fixes applied: vercel.json SPA routing, SEO meta, accessibility, form validation, contact page, shift normalization -->
