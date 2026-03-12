# Contributing to BladderTracker

Thank you for your interest in contributing! This guide will help you get up and running.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd bladdertracker
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Run locally (localStorage mode)**

   ```bash
   npm run dev
   ```

   This starts the Vite dev server with all data stored in the browser's localStorage.

4. **Run with cloud backend**

   ```bash
   VITE_USE_CLOUD=true vercel dev
   ```

   This connects to the Neon PostgreSQL database via Vercel Serverless Functions.

5. **Verify the build**

   ```bash
   npm run build
   ```

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Tailwind CSS 4** for styling
- **React Router v7** for routing
- **Recharts** for charts and data visualisation
- **Neon PostgreSQL** (`@neondatabase/serverless`) for cloud storage
- **Vercel Serverless Functions** for the API layer
- **lucide-react** for icons

## Project Structure

```
src/
├── components/     # Shared UI components (AppNav, EntryCard, etc.)
├── context/        # React Context providers (AppContext, ThemeContext)
├── pages/          # Page components (DashboardPage, LogPage, ReportsPage, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utilities (storage, api, importers, auth)
├── assets/         # Static assets
└── App.tsx         # Router and app shell
api/
├── _lib/           # Shared helpers (db, auth)
└── *.ts            # Serverless function endpoints
docs/               # Architecture and API documentation
```

## Adding a New Module

Follow these steps to add a new tracking module (e.g. sleep, meals, milestones):

1. **Define the type** — Add the entry interface and extend the `ModuleId` union in `src/types/index.ts`.
2. **Add storage functions** — Implement localStorage CRUD helpers in `src/utils/storage.ts`.
3. **Add API functions** — Add cloud CRUD functions in `src/utils/api.ts`.
4. **Create the serverless endpoint** — Add a new handler file in `api/` for the module.
5. **Wire up AppContext** — Add state and CRUD methods to `src/context/AppContext`.
6. **Add a tab to AddEntryPage** — Register the new module as a tab in the Add Entry page.
7. **Register the module** — Add the module to the `DEFAULT_MODULES` array.
8. **Add a migration table** — Define the new table in `api/_lib/db.ts` so it is created on `POST /api/migrate`.

## Database Schema

- The cloud backend uses **Neon PostgreSQL** with **20 tables**.
- Migrations are executed by calling `POST /api/migrate`.
- All entry tables follow a consistent pattern:

  | Column      | Description                  |
  | ----------- | ---------------------------- |
  | `id`        | Unique identifier            |
  | `childId`   | Associated child profile ID  |
  | `date`      | Entry date                   |
  | `time`      | Entry time                   |
  | `notes`     | Free-text notes              |
  | `createdBy` | User who created the entry   |
  | `createdAt` | Timestamp of creation        |

  Individual modules add extra columns as needed.

## Code Style

- **TypeScript strict mode** is enabled — avoid `any` types.
- **Tailwind CSS** for all styling — do not use inline styles or CSS modules.
- Follow **NHS-inspired design principles** (clear, accessible, calming).
- Use the existing colour palette: `lavender-50` through `lavender-950`.
- Include **ARIA labels** and follow accessibility best practices on all interactive elements.

## Testing

Use the following to validate changes:

```bash
# Unit, route smoke, storage, and accessibility checks
npm test

# Type-check and bundle
npm run build

# Lint with ESLint
npm run lint

# API type-check
./node_modules/.bin/tsc --project tsconfig.api.json --noEmit

# Manual testing
npm run dev
```

## Documentation Expectations

Please keep documentation in sync with the code you change.

- Update `README.md` when product behaviour, setup, routes, environment variables, or public-facing positioning changes.
- Update `docs/MODULES.md` when tracker labels, fields, or module defaults change.
- Update `docs/API.md` when request/response contracts, auth behaviour, or security notes change.
- Update `docs/ARCHITECTURE.md` when infrastructure, routing, storage, or major component structure changes.
- Update `docs/Onboarding.md` when first-run flow, key pages, or user guidance changes.

## Opening Issues Well

Before opening a new issue:

1. Search existing issues to avoid duplicates or stale reopenings.
2. Use the matching issue template for **bug reports**, **feature requests**, or **documentation improvements**.
3. Include the user problem, why it matters, scope boundaries, and clear acceptance criteria where possible.
4. Link the issue to `docs/REPO_STATUS.md` when it maps to an existing open item, or add a new item there if the gap is newly confirmed.

For security concerns, please follow [`SECURITY.md`](./SECURITY.md) instead of filing a public issue with sensitive details.

## Handling Sensitive Data

- Never commit real child data, screenshots containing personal data, or production credentials.
- Use anonymised examples in tests, fixtures, screenshots, and documentation.
- When changing authentication, export, deletion, sharing, or health-data flows, review the user-facing copy in `README.md`, `GDPR.md`, and `docs/API.md`.

## Pull Request Guidelines

- Keep changes **focused** — one feature or fix per PR.
- Ensure `npm test`, `npm run build`, `npm run lint`, and the API type-check pass before opening the PR.
- Follow **existing patterns** in the codebase for consistency.
- Describe what you changed and why in the PR description.

## Routes

| Path          | Page               |
| ------------- | ------------------ |
| `/`           | Dashboard          |
| `/log`        | Diary / History    |
| `/add`        | Add Entry          |
| `/reports`    | Reports            |
| `/milestones` | Milestones         |
| `/leaps`      | Leaps              |
| `/calendar`   | Calendar           |
| `/profiles`   | Profiles           |
| `/settings`   | Account / Settings |
| `/help`       | Help & Support     |
| `/admin`      | Admin Panel        |
