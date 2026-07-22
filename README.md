# Portfolio Template (Next.js + MongoDB)

An open-source, self-host developer portfolio: a responsive, dark/light public landing site
paired with a shadcn/ui admin panel, backed by MongoDB — all in a single Next.js 14.2 app.
Clone it, set your environment variables, seed the demo content, and configure everything
else (profile, projects, skills, blog posts, experience, which sections show and in what order)
through the admin panel — no code edits required.

## Features

- **Redesigned, responsive landing page** — Tailwind CSS + shadcn/ui, dark/light theme via
  `next-themes`.
- **Admin panel** with full CRUD for projects, skills, blog posts, experience entries,
  contributions, the owner profile, and admin/manager users.
- **Section show/hide + reorder** — toggle which landing sections (about, projects,
  contributions, experience, blogs, skills, contact) are visible and drag their order via
  up/down controls in the owner form, no redeploy needed.
- **Contact form → admin inbox** — visitor messages submitted from the public contact form land
  in a dedicated **Messages** inbox in the admin panel (read/unread, view, delete), with an
  optional outbound webhook notification.
- **Cloudinary signed image uploads** — profile photo and other image fields upload directly
  from the browser to Cloudinary using a short-lived signature issued by the app; no image
  ever touches your own server.
- **SEO out of the box** — dynamic `sitemap.xml`, `robots.txt`, and web app manifest generated
  from the owner profile, plus optional search-console verification meta tags.
- **Demo seed script** — populate a fresh database with realistic placeholder content in one
  command so the site looks complete immediately after setup.

## Tech stack

- **Framework:** Next.js 14.2 (App Router), React 18, TypeScript
- **Data:** MongoDB via Mongoose 7 (cached connection for serverless, under `src/server`)
- **Validation:** Zod (API route handlers)
- **Auth:** JSON Web Tokens (`jsonwebtoken`) in an httpOnly cookie, `bcryptjs` for password
  hashing, `src/middleware.ts` guarding `/admin/*`
- **UI:** Tailwind CSS + shadcn/ui (Radix primitives), `next-themes` (dark/light), lucide-react,
  TanStack Table
- **Client data fetching (admin):** RTK Query (`@reduxjs/toolkit` + `react-redux`) against the
  app's own API
- **Images:** Cloudinary (signed browser uploads)

## Prerequisites

- **Node.js 24** — an `.nvmrc` is included; run `nvm use` to pick it up
- A **MongoDB** database — Atlas (free tier), a local `mongod`, or Docker

## Setup

```bash
git clone <this-repo-url>
cd fullstack-portfolio-nextjs
nvm use                    # picks up Node 24 from .nvmrc
npm install
cp .env.example .env
# fill in the values in .env — see the environment variables table below
npm run seed:admin         # creates the first admin user from ADMIN_* in .env
npm run dev
```

The app runs at `http://localhost:3000` and redirects `/` → `/home`. Log in at `/login` with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.

### Getting a MongoDB database

Pick whichever is easiest for you — the app only needs a `DATABASE_URL` connection string.

- **MongoDB Atlas (free tier)** — create a free cluster at
  [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), add a database user, allow
  access from your IP (or `0.0.0.0/0` for convenience during setup), and copy the SRV connection
  string into `DATABASE_URL`.
- **Local `mongod`** — install MongoDB Community Server and run `mongod`, then use
  `mongodb://localhost:27017/portfolio` as `DATABASE_URL`.
- **Docker** — `docker run -d -p 27017:27017 mongo`, then use
  `mongodb://localhost:27017/portfolio` as `DATABASE_URL`.

## Environment variables

Set these in `.env` locally (see `.env.example`), and as Environment Variables in your hosting
provider's project settings when deploying.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB connection string (Atlas SRV URI, local, or Docker) used by Mongoose. |
| `NEXT_PUBLIC_APP_URL` | Public origin of the app; the landing pages fetch their own `/api/v1/*` using this URL, and the demo seed script uses it to find the running server. Set to `http://localhost:3000` locally and the deployed URL in production. |
| `NEXT_PUBLIC_SITE_NAME` | Fallback brand name (nav, footer, SEO) used before the owner profile is loaded. |
| `BCRYPT_SALT_ROUNDS` | Cost factor for `bcryptjs` password hashing (e.g. `12`). |
| `JWT_SECRET` | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens. |
| `JWT_EXPIRES_IN` | Access token lifetime (e.g. `1d`). |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `30d`). |
| `SITE_VERIFICATION_GOOGLE` *(optional)* | Google Search Console verification code, rendered as a meta tag when set. |
| `SITE_VERIFICATION_YANDEX` *(optional)* | Yandex Webmaster verification code, rendered as a meta tag when set. |
| `SITE_VERIFICATION_YAHOO` *(optional)* | Yahoo site verification code, rendered as a meta tag when set. |
| `NEXT_PUBLIC_TWITTER_HANDLE` *(optional)* | Your `@handle`, used for the `twitter:site`/`twitter:creator` meta tags. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name, used by the browser uploader and to build the upload URL. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key, used by the browser uploader. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret, used server-side only to sign upload requests — never exposed to the browser. |
| `MESSAGE_NOTIFY_WEBHOOK_URL` *(optional)* | URL POSTed to (fire-and-forget) whenever a contact-form message is created; the message is saved to the Messages inbox regardless of whether this succeeds. |
| `ADMIN_EMAIL` | Email for the first admin user, used by `npm run seed:admin` and by `npm run seed` to log in. |
| `ADMIN_PASSWORD` | Plaintext password for the first admin user; hashed with `BCRYPT_SALT_ROUNDS` before storage. |
| `ADMIN_NAME` *(optional)* | Display name for the seeded admin user, defaults to `Admin`. |
| `ADMIN_PHONE` *(optional)* | Phone number for the seeded admin user, defaults to `N/A`. |
| `ADMIN_ADDRESS` *(optional)* | Address for the seeded admin user, defaults to `N/A`. |

## First run: creating the admin and seeding demo content

The admin panel has no public sign-up — the first admin user and the demo content are created by
two separate scripts.

1. **Create the first admin user** (idempotent — safe to re-run; it looks up `ADMIN_EMAIL` first
   and does nothing if that user already exists):

   ```bash
   npm run seed:admin
   ```

2. **Start the dev server:**

   ```bash
   npm run dev
   ```

3. **In a second terminal, with the dev server still running**, populate demo content:

   ```bash
   npm run seed
   ```

   This script talks to the app's own running `/api/v1` REST API — the same routes and validation
   the admin panel uses — so it **requires the dev server (or a production server) to already be
   running**, and requires a working `ADMIN_EMAIL` / `ADMIN_PASSWORD` to log in with. It is
   idempotent: each resource (owner, skills, projects, blogs, experiences, contributions) is
   checked first and only populated if it's currently empty, so it's safe to re-run.

## Admin walkthrough

1. Log in at `/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
2. Go to **Owner** first — fill in your profile (name, designation, about, contact links), upload
   a profile photo (via Cloudinary), set your résumé URL, and use the **Landing sections** card to
   show/hide and reorder which sections (about, projects, contributions, experience, blogs,
   skills, contact) appear on the public site.
3. Fill in **Projects**, **Skills**, **Blogs**, **Experiences**, and **Contributions** through
   their respective CRUD pages.
4. Check the **Messages** inbox for anything submitted through the public contact form.
5. Manage additional admin/manager logins under **Users** (admin-only).

## Cloudinary (image uploads)

Image fields (like the owner's profile photo) upload directly from the browser to Cloudinary
using a short-lived signature issued by `/api/v1/uploads/sign`. This is optional — you can always
paste a manual image URL instead — but for the upload button to work:

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy your **Cloud name** and **API Key** into `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   and `NEXT_PUBLIC_CLOUDINARY_API_KEY`.
3. Copy the **API Secret** into `CLOUDINARY_API_SECRET` (server-only — never exposed to the
   browser; used to sign upload requests).

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import it into a new Vercel project — the Next.js framework preset is auto-detected, no
   `vercel.json` needed.
3. **Before the first build**, set every environment variable from the table above under Project
   Settings → Environment Variables — the build itself reads the database for the landing page's
   ISR content and metadata, so a missing variable can fail the build, not just runtime.
4. Set `NEXT_PUBLIC_APP_URL` to the deployment's own URL (e.g. `https://your-project.vercel.app`),
   since the landing pages fetch their own API using this value.
5. Node.js version: Vercel's current default Node.js runtime is **24.x**, which matches this
   project's `.nvmrc` — no override needed.
6. After the first deploy, run `npm run seed:admin` locally (pointed at the same `DATABASE_URL`)
   to create the admin login if you haven't already, then optionally `npm run seed` pointed at the
   deployed `NEXT_PUBLIC_APP_URL` to populate demo content.

### Known caveat: webhook notifications on serverless

`MESSAGE_NOTIFY_WEBHOOK_URL` is fired fire-and-forget (not awaited) when a contact-form message is
created, so the message save itself is never blocked or slowed down by it. On Vercel's serverless
functions, though, the function can freeze or terminate right after the HTTP response is sent,
before that background webhook request finishes — so delivery isn't guaranteed there. The message
is always saved to the Messages inbox regardless of whether the webhook fires. If you need
guaranteed delivery of notifications, integrate an email/SMTP provider (or a queue) instead of, or
in addition to, the webhook.

## Project structure

```
src/
  app/
    home/           # public landing pages (server-rendered/ISR)
    admin/          # shadcn/ui admin pages (client-rendered, cookie-guarded)
    login/          # admin login page
    api/v1/         # route handlers — the app's REST API
    sitemap.ts, robots.ts, manifest.ts   # SEO
  server/           # framework-agnostic backend: db connection, lib (jwt, authGuard,
                    # sendResponse, ApiError, pagination, config), and modules/<resource>
                    # (model + service + validation) for owner, project, skill, blog,
                    # experience, contribution, message, user, auth
  components/
    user/           # landing UI components
    admin/          # admin UI components (data table, forms per resource)
    ui/             # shadcn/ui primitives
  lib/              # shared client-side helpers (utils, section normalization)
  redux/            # RTK Query API slices used by the admin panel
  middleware.ts     # cookie presence-check guarding /admin/*
scripts/
  seed-admin.mjs    # creates the first admin user directly against MongoDB
  seed.mjs          # populates demo content via the running app's own API
  seed-data.mjs     # editable demo content used by seed.mjs
```

## API

All endpoints live under `/api/v1`. Resources: `owners` (+ `owners/getOwner`), `projects`,
`skills`, `blogs`, `experiences`, `contributions`, `messages`, `users`, and `auth` (`login`,
`logout`, `refresh-token`, `change-password`, `me`).

Reads (list/get) on `projects`, `skills`, `blogs`, `experiences`, and `owners/getOwner` are
public — the landing pages consume them directly. Creating a message (the contact form) is also
public. Every other mutation requires an authenticated `ADMIN` or `MANAGER` session (`users`
management is `ADMIN`-only), verified via the httpOnly cookie set on login. Responses follow a
frozen shape: `{ success, statusCode, message, data, meta? }` on success,
`{ success: false, message, errorMessages: [{ path, message }] }` on error.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Serve the production build (after `build`). |
| `npm run lint` | Run `next lint`. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run seed:admin` | Create the first admin user (idempotent). |
| `npm run seed` | Populate demo content via the running app's API (idempotent). |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local dev setup, quality gates, and conventions.

## License

[MIT](./LICENSE) © 2026 Md Jahedul Hoque
