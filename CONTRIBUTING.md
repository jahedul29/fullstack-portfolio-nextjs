# Contributing

Thanks for considering a contribution to this project. It's an open-source, self-hostable
developer-portfolio template (Next.js 14.2 + MongoDB + shadcn/ui admin), and contributions —
bug fixes, small features, docs improvements — are welcome.

## Local development setup

1. Use Node 24 (an `.nvmrc` is included): `nvm use`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and fill in at least `DATABASE_URL`, `JWT_SECRET`,
   `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, and `NEXT_PUBLIC_APP_URL`
   (see the README's environment variable table for the full list).
4. Create the first admin user: `npm run seed:admin`.
5. Start the dev server: `npm run dev`.
6. Optionally, in a second terminal with the dev server still running, populate demo content:
   `npm run seed`.

## Quality gates

Before opening a pull request, all of the following must pass locally:

```bash
npm run typecheck
npm run lint
npm run build
```

A PR that fails any of these will not be merged. Please run them yourself first rather than
relying on CI to catch problems.

## Conventions

- **No code comments in source files.** This codebase is deliberately kept comment-free —
  code should be self-explanatory through naming and structure. (Prose in Markdown docs like this
  one is fine.) `scripts/*.mjs` are a narrow exception where a short header comment explains
  non-obvious operational behavior (idempotency, why a script bypasses the app's models).
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, ...) with a short, imperative subject line.
- Keep the API response shape frozen: success responses are
  `{ success, statusCode, message, data, meta? }`; error responses are
  `{ success: false, message, errorMessages: [{ path, message }] }`. Don't change this shape
  without updating every consumer (landing pages + admin RTK Query slices).
- Landing pages under `src/app/home/**` and `src/components/user/**` are the public-facing design —
  keep changes there deliberate and consistent with the existing Tailwind + shadcn/ui direction.

## Pull requests

- Keep PRs focused on a single change; avoid bundling unrelated refactors.
- Describe *why* the change is needed, not just what changed.
- Update the README's environment variable table if you add, rename, or remove an environment
  variable, and keep `.env.example` in sync.
- If you touch behavior that affects the demo seed (`scripts/seed.mjs`, `scripts/seed-data.mjs`),
  confirm the seed script is still idempotent (safe to re-run against a populated database).
