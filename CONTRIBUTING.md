# Contributing to Child Development Tracker

Thank you for your interest in contributing! This guide will help you get up and running.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd bladdertracker
   ```

2. **Install dependencies**

   ```bash
   npm install
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

- The cloud backend uses **Neon PostgreSQL** with **19 tables**.
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

There is no automated test suite yet. Use the following to validate changes:

```bash
# Type-check and bundle
npm run build

# Lint with ESLint
npm run lint

# Manual testing
npm run dev
```

## Pull Request Guidelines

- Keep changes **focused** — one feature or fix per PR.
- Ensure `npm run build` and `npm run lint` pass before opening the PR.
- Follow **existing patterns** in the codebase for consistency.
- Describe what you changed and why in the PR description.

## Routes

| Path        | Page               |
| ----------- | ------------------ |
| `/`         | Dashboard          |
| `/log`      | Log / History      |
| `/add`      | Add Entry          |
| `/reports`  | Reports            |
| `/calendar` | Calendar           |
| `/profiles` | Profiles           |
| `/settings` | Account / Settings |
| `/help`     | Help & Support     |
| `/admin`    | Admin Panel        |
