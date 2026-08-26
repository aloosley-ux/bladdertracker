# Deploying EveryStep (Free Tier)

Exact steps to run EveryStep in cloud mode on **Vercel** (hosting + serverless
functions) and **Neon** (PostgreSQL), both on their free plans. Local/offline
mode needs none of this — it runs entirely in the browser.

---

## 1. Prerequisites

- A GitHub account with this repository pushed to it.
- A Vercel account (sign in with GitHub — no credit card needed).
- A Neon account (sign in with GitHub or Google — no credit card needed).

---

## 2. Create the Neon database

1. Sign in at [neon.tech](https://neon.tech) → **New Project**.
2. Name: `everystep`. Postgres version: **17** (or latest default).
3. Cloud region: pick **EU (Frankfurt)** if your users are UK-based, otherwise
   the region nearest you. Keep **Compute size: Free**.
4. When the project is ready, open the **Connection Details / Dashboard** panel
   and copy the pooled connection string. It looks like:

   ```
   postgresql://user:password@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

5. Use the string containing **`-pooler`** for serverless functions (it
   survives many short-lived connections). Keep it secret — treat it like a
   password.

Database schema is created automatically: on first API use,
`api/_lib/db.ts` runs idempotent migrations (`CREATE TABLE IF NOT EXISTS`,
`ADD COLUMN IF NOT EXISTS`).

---

## 3. Generate secrets

Create two random strings locally:

```bash
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 24   # ADMIN_ACCESS_KEY
```

(Any long random string works; these are examples.)

---

## 4. Import the repo into Vercel

1. [vercel.com/new](https://vercel.com/new) → select this GitHub repository.
2. Framework preset is detected as **Vite** (`vercel.json` pins build command
   `npm run build`, output directory `dist`, and SPA rewrites). Leave defaults.
3. Do **not** deploy yet — first add environment variables.

---

## 5. Set environment variables (Project → Settings → Environment Variables)

| Variable | Scope | Value |
|----------|-------|-------|
| `VITE_USE_CLOUD` | Production, Preview | `true` |
| `DATABASE_URL` | Production, Preview | Your Neon pooled connection string |
| `JWT_SECRET` | Production | Random 64-char hex from step 3 (**required** — production API refuses to start without it) |
| `ADMIN_ACCESS_KEY` | Production | Random key from step 3 (enables cloud admin promotion via `x-admin-key` header) |
| `ALLOWED_ORIGIN` | Production | Your final URL, e.g. `https://every-step.vercel.app` (CORS allow-list for API calls) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | optional | Only if you enable rate limiting (see §8) |

Frontend variables prefixed `VITE_` are baked into the JS bundle at build time
— they must exist before the build. `VITE_ADMIN_KEY` is only for local-mode
development; leave it unset in production.

Click **Deploy**. First deployment builds the PWA and provisions the 12
serverless functions under `api/`.

After deployment, open your URL once and sign up — the Neon database migrates
itself on the first request.

---

## 6. Verify the deployment

- App loads at `https://<project>.vercel.app`.
- Register an account, add a child, add one entry — data round-trips after a page reload.
- Admin promotion (optional): sign in, then `POST /api/auth {"action":"promote"}` with header `x-admin-key: <your ADMIN_ACCESS_KEY>`, e.g.

  ```bash
  curl -X POST https://<project>.vercel.app/api/auth \
    -H "Content-Type: application/json" \
    -H "x-admin-key: <key>" \
    -b "bt_session=<cookie value>" \
    -d '{"action":"promote"}'
  ```

- Install prompt: Chrome desktop/mobile should offer "Install app" (PWA manifest + service worker).

---

## 7. Free-tier limits and what happens when they're hit

### Vercel Hobby (free)

| Limit | Free allowance | What happens when you hit it |
|-------|----------------|------------------------------|
| Serverless function invocations | Generous; effectively unmetered for a family-scale tracker | No hard cutoff; sustained commercial-scale traffic triggers Vercel's fair-use review by email, not an outage |
| Function execution time | 10 s per invocation (Hobby cap) | Requests taking longer fail with `FUNCTION_INVOCATION_TIMEOUT`; every endpoint here is sub-second except cold starts |
| Bandwidth | 100 GB/month fast path | Site/API slows (100 Kbps) rather than stopping until the month resets |
| Builds | 6,000 minutes/month, 1 concurrent build | Pushes queue instead of deploying until minutes reset |
| Projects | 1 concurrent project slot beyond included | Extra projects pause oldest deployments |

Practical reality: one family/care-team using EveryStep stays far below all of these.

### Neon Free plan

| Limit | Free allowance | What happens when you hit it |
|-------|----------------|------------------------------|
| Storage | 0.5 GB | Writes start failing with "disk full"-style Postgres errors; reads keep working. Text diary entries are tiny — years of daily entries stay well under this |
| Compute hours | ~190 h/month autosuspend compute | After exhaustion, compute pauses until next month; the app shows API errors while paused |
| Autosuspend | Scales to zero after 5 min idle | First request after idle adds ~500 ms cold-start latency; no data loss |
| Databases/projects | Limited project count | Creating another Neon project requires deleting an old one |

### What "hitting the limit" never does

- Neither provider deletes your data when you exceed free limits.
- Nothing auto-upgrades or charges you without explicit action in the dashboard.

If you outgrow free tiers: Neon Launch plan (~$19/mo) removes storage/compute
caps; Vercel Pro ($20/user/mo) raises bandwidth and concurrency. Both optional.

---

## 8. Optional: rate limiting (Upstash free tier)

The API supports optional rate limiting via Upstash Redis. Create a free
database at [upstash.com](https://upstash.com), then set
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Without them the API
runs unthrottled — acceptable for a private family instance, not recommended
for a public URL with signups open.

---

## 9. Updating the app

Push to `main` → Vercel rebuilds automatically. Migrations are additive and
run on first API call after each deploy, so old and new clients can coexist
during the rollout window.

## 10. Tearing it down

Delete the Vercel project and the Neon project from their dashboards. All
user data lives only in those two places (plus each device's localStorage for
local mode) — deleting both removes everything permanently.
