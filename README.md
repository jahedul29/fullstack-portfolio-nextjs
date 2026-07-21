# Fullstack Portfolio (Next.js)

A fullstack Next.js portfolio app: a pixel-identical public landing site plus a modern shadcn/ui admin panel, backed by MongoDB with cookie-based JWT authentication — all in a single Next.js project deployed as one Vercel app.

## Tech stack

- **Framework:** Next.js 14.2 (App Router), React 18, TypeScript
- **Data:** MongoDB via Mongoose 7 (cached serverless connection under `src/server`)
- **Validation:** Zod (API route handlers)
- **Auth:** JSON Web Tokens (`jsonwebtoken`) in an httpOnly cookie, `bcryptjs` for password hashing, `src/middleware.ts` guarding `/admin/*`
- **Landing UI** (verbatim, unchanged): antd 5, Tailwind CSS 3 + daisyUI 3, framer-motion, react-particles, react-multi-carousel, react-type-animation, react-scroll, react-skillbars
- **Admin UI:** shadcn/ui (Radix primitives) + Tailwind, TanStack Table, lucide-react, next-themes, RTK Query (`@reduxjs/toolkit` + `react-redux`) for data fetching against the app's own API

## Prerequisites

- **Node.js 24** — an `.nvmrc` is included; run `nvm use` to pick it up
- A **MongoDB** database (MongoDB Atlas recommended) and its connection string

## Setup

```bash
git clone <this-repo-url>
cd fullstack-portfolio-nextjs
nvm use            # picks up Node 24 from .nvmrc
npm install
cp .env.example .env
# fill in the values in .env — see the table below
npm run dev
```

The app runs at `http://localhost:3000` and redirects `/` → `/home`.

## Environment variables

Set these in `.env` locally, and as Environment Variables in the Vercel project when deploying.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB connection string (e.g. an Atlas SRV URI) used by Mongoose. |
| `BCRYPT_SALT_ROUNDS` | Cost factor for `bcryptjs` password hashing (e.g. `12`). |
| `JWT_SECRET` | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens. |
| `JWT_EXPIRES_IN` | Access token lifetime (e.g. `1d`). |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `30d`). |
| `NEXT_PUBLIC_APP_URL` | Public origin of the app; the landing pages fetch their own `/api/v1/*` using this URL. Set to `http://localhost:3000` locally and to the deployed URL on Vercel. |

The following are only needed when running the admin-seed script (see below) and are not read by the app itself, so they aren't in `.env.example` — add them to your local `.env` (or pass inline) before seeding:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Email for the seeded admin user (required to run the seed script). |
| `ADMIN_PASSWORD` | Plaintext password for the seeded admin user; hashed with `BCRYPT_SALT_ROUNDS` before storage (required). |
| `ADMIN_NAME` | Display name for the seeded admin user (optional, defaults to `Admin`). |
| `ADMIN_PHONE` | Phone number for the seeded admin user (optional, defaults to `N/A`). |
| `ADMIN_ADDRESS` | Address for the seeded admin user (optional, defaults to `N/A`). |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Serve the production build (after `build`). |
| `npm run lint` | Run `next lint`. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run seed:admin` | Create the first admin user (see below). |

## Creating the first admin user

The admin panel has no public sign-up — the first `ADMIN` user is created with the seed script:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (and optionally `ADMIN_NAME` / `ADMIN_PHONE` / `ADMIN_ADDRESS`) in `.env`, alongside a working `DATABASE_URL`.
2. Run `npm run seed:admin`.

The script is **idempotent**: it looks up `ADMIN_EMAIL` in the `users` collection first and simply logs and exits without writing anything if a user with that email already exists, so it's safe to re-run (e.g. during a redeploy).

## Project structure

```
src/
  app/
    home/           # public landing pages (server-rendered/ISR, verbatim UI)
    admin/          # shadcn admin pages (client-rendered, cookie-guarded)
    login/          # admin login page
    api/v1/         # route handlers — the app's REST API
  server/           # framework-agnostic backend: db connection, lib (jwt,
                     # authGuard, sendResponse, ApiError, pagination), and
                     # modules/<resource> (model + service + validation)
  components/
    user/           # landing UI components (verbatim)
    admin/          # admin UI components (tables, forms per resource)
    ui/             # shadcn/ui primitives
  redux/            # RTK Query API slices used by the admin panel
  middleware.ts     # cookie presence-check guarding /admin/*
```

## API

All endpoints live under `/api/v1`. Resources: `owners` (+ `owners/getOwner`), `projects`, `skills`, `blogs`, `experiences`, `contributions`, `users`, and `auth` (`login`, `logout`, `refresh-token`, `change-password`, `me`).

Reads (list/get) on `projects`, `skills`, `blogs`, `experiences`, and `owners/getOwner` are public — the landing pages consume them directly. Creating a contribution (the contact form) is also public. Every other mutation — create/update/delete on `projects`, `skills`, `blogs`, `experiences`, `owners`, and all of `users` — requires an authenticated `ADMIN` or `MANAGER` session (`users` management is `ADMIN`-only), verified via the httpOnly cookie set on login. Responses follow a frozen shape: `{ success, statusCode, message, data, meta? }` on success, `{ success: false, message, errorMessages: [{ path, message }] }` on error.

## Deploy to Vercel

1. Import this repository into a new Vercel project — the Next.js framework preset is auto-detected, no configuration needed.
2. Add the environment variables from the table above (`DATABASE_URL`, `BCRYPT_SALT_ROUNDS`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `NEXT_PUBLIC_APP_URL`) under Project Settings → Environment Variables.
3. Set `NEXT_PUBLIC_APP_URL` to the deployment's own URL (e.g. `https://your-project.vercel.app`), since the landing pages fetch their own API using this value.
4. Node.js version: Vercel's current default Node.js runtime is **24.x** (with 22.x and 20.x also available), so no override is required — this project's `package.json` sets `"engines": { "node": ">=22" }`, which is compatible with Vercel's default and resolves to the latest available major. To pin explicitly, set **Node.js Version** to `24.x` under Project Settings → Build and Deployment (fall back to `22.x` there only if a given project's default has been pinned lower).
5. No `vercel.json` is needed — this is a standard Next.js App Router project and Vercel's zero-config Next.js support handles the build, functions, and routing automatically.
6. After the first deploy, run `npm run seed:admin` (locally, pointed at the same `DATABASE_URL`) to create the admin login if one doesn't exist yet.

## Notes

- The landing site (`src/app/home/**`) is server-rendered/ISR and fetches its own data from this app's `/api/v1/*` at build/request time — it does not talk to MongoDB directly.
- The admin panel (`src/app/admin/**`) is client-rendered and guarded by the httpOnly session cookie, both at the edge (`src/middleware.ts`, presence check) and per-request (`authGuard` in route handlers, signature + role check).
