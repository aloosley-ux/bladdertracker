# 🧩 EveryStep

**Calm tracking for families, caregivers, and care teams** — a child development, continence, SEND, and daily routine tracker with NHS-style clarity and a mobile-first layout.

EveryStep helps families and care teams capture the full picture, not just isolated symptoms. It combines continence, sleep, meals, routines, mood, sensory notes, milestones, and caregiver collaboration in a single calm workflow that works both offline (localStorage) and in the cloud (Vercel + Neon Postgres).

![EveryStep app screenshot](docs/images/screenshot-home.png)

[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com)
[![Vite 7](https://img.shields.io/badge/Vite-7-646cff)](https://vite.dev)
[![CI](https://github.com/aloosley-ux/bladdertracker/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/aloosley-ux/bladdertracker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)

## ✨ Features

- **13 tracker modules** — drinks, wee, poo, sleep, toilet visits, meals, mood, sensory, medication, therapy, routines, milestones, leaps — toggled per child
- **Milestone engine** — full CRUD across 8 categories with status workflow, timeline views, and NHS-style guidance panels
- **Multi-child, multi-role** — parents, caregivers, school staff, and invite-only clinical labels, with data isolation per child
- **Reports & export** — Recharts visualisations, CSV export with consent confirmation, PDF via print
- **Offline-first PWA** — works locally without a database; optional shared cloud mode
- **Accessible by design** — Light/Dark/High Contrast themes, dyslexia-friendly font toggle, keyboard support

For the full product tour — module tables, page catalogue, API reference, theming details, benchmarking — see the [Product Guide](./docs/Product-Guide.md).

## 🚀 Quick Start

### Local development

```bash
git clone <repo-url> && cd everystep
npm install
npm run dev          # → http://localhost:5173
```

Local mode uses `localStorage` — no database required.

### Deploy (cloud mode: Vercel + Neon)

```bash
# 1. Set environment variables (see docs/Product-Guide.md for the full list)
export DATABASE_URL="postgres://<db-user>:***@<neon-host>/<db-name>?sslmode=require"
export JWT_SECRET="<32+ character random secret>"
export VITE_USE_CLOUD=true
export ADMIN_ACCESS_KEY="<admin-promotion-key>"

# 2. Initialize the database (creates all 20 tables)
curl -X POST https://your-app.vercel.app/api/migrate

# 3. Deploy to Vercel
vercel --prod
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/Product-Guide.md](./docs/Product-Guide.md) | Detailed product tour: features, pages, API reference, themes, benchmarking |
| [docs/architecture.md](./docs/architecture.md) | System architecture |
| [docs/MODULES.md](./docs/MODULES.md) | Module field reference and clinical guidance |
| [docs/API.md](./docs/API.md) | API endpoint reference |
| [docs/REPO_STATUS.md](./docs/REPO_STATUS.md) | **Authoritative list of remaining work** |
| [docs/Onboarding.md](./docs/Onboarding.md) | User step-by-step onboarding guide |
| [GDPR.md](./GDPR.md) | Full GDPR & Data Protection Policy |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Developer guide, module schema, adding features |
| [CHANGELOG.md](./CHANGELOG.md) | Release notes and version history |

Project status at a glance: active, feature-rich MVP; CI runs tests, linting, build, and API type-checks on pull requests. See [docs/REPO_STATUS.md](./docs/REPO_STATUS.md) for confirmed remaining work.

## 🧪 Testing

```bash
npm test             # Vitest + React Testing Library + accessibility checks
npm run lint         # ESLint across the project
npm run build        # Type-check + production bundle
npx tsc --project tsconfig.api.json --noEmit   # API type-check
```

`npm test` includes one live integration test that reaches a deployed Vercel hostname; if network access is unavailable, the rest of the suite must still pass.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports, feature requests, and documentation improvements go through the GitHub issue templates; security concerns are handled privately via [SECURITY.md](./SECURITY.md). Agent instructions live in [AGENTS.md](./AGENTS.md).

## 📄 License

Released under the [MIT License](./LICENSE).

## AI-Assisted Development

This project was built with heavy use of AI coding agents (GitHub Copilot workspace agent / SWE agent).
Human direction covered architecture, review, security decisions, and quality gates; the majority of
implementation commits were agent-generated. See the git history and `docs/DOCUMENTATION_AUDIT.md`
for an honest account of what was validated versus aspirational.
