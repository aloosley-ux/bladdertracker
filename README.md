# BladderTracker 🧸

A responsive web app for families to digitally track paediatric bladder and bowel diaries. Built with React, TypeScript, and Tailwind CSS with a Vercel-compatible cloud backend.

## Features

- **Cloud-synced accounts** — Register, sign in, and reset your password; data is available across all devices and sessions
- **Multi-user profiles** — Parent/caregiver & child profiles with easy switching
- **Role-based access** — Parents, caregivers, and school admins with real permissions management
- **Dashboard** — Daily and weekly overview with calendar strip, summary cards, and clinical reminders
- **Drink tracking** — Log time, type (cup/beaker/bottle/sippy), amount in ml, and notes
- **Urine tracking** — Log time, wet/pass events, and notes
- **Bowel tracking** — Log date/time, toilet/nappy, amount (S/M/L), Bristol Stool Chart type (visual picker), laxatives given, and notes
- **Charts & Insights** — Fluid intake bar chart, events timeline, stool type distribution
- **Calendar review** — Monthly calendar with coloured indicators for each entry type
- **Export** — Download diary as CSV for clinic visits
- **Import** — Import CSV, JSON, or XLSX diary data for bulk updates
- **Invite caregivers** — Role-specific secure invite links for parents, caregivers, and school admins
- **Notifications & audit** — Track invite acceptance, data changes, and caregiver activity
- **Clinical advice** — Reminders for constipation/bladder health
- **Mobile-first** — Responsive design optimised for phones (max-width: 48rem)

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite 7, Tailwind CSS 4, React Router 7, Recharts 3, Lucide React icons, date-fns
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Vercel Postgres (Neon-compatible)
- **Auth:** JWT sessions with httpOnly cookies, bcrypt password hashing

## Architecture

```
├── api/                  # Vercel Serverless Functions (10 functions, Hobby-plan safe)
│   ├── _lib/             # Shared utilities (not deployed as functions)
│   │   ├── auth.ts       # JWT session management, CORS helpers
│   │   └── db.ts         # Database connection, migration, shared queries
│   ├── auth.ts           # POST /api/auth (action: register|login|logout|reset), GET /api/auth (session)
│   ├── children.ts       # GET/POST/PUT /api/children
│   ├── drinks.ts         # GET/POST/PUT/DELETE /api/drinks
│   ├── urine.ts          # GET/POST/PUT/DELETE /api/urine
│   ├── bowel.ts          # GET/POST/PUT/DELETE /api/bowel
│   ├── invites.ts        # GET/POST /api/invites (create & accept)
│   ├── notifications.ts  # GET/PUT /api/notifications
│   ├── audit.ts          # GET /api/audit
│   ├── data.ts           # GET /api/data (CSV export), POST /api/data (bulk import)
│   └── migrate.ts        # POST /api/migrate (database setup)
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── context/          # React context for app state
│   ├── pages/            # Page components (routed)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── api.ts        # Frontend API client (fetch-based)
│   │   ├── auth.ts       # Client-side auth helpers (local mode)
│   │   ├── importers.ts  # File import parsers (CSV/JSON/XLSX)
│   │   └── storage.ts    # localStorage fallback (local mode)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── vercel.json           # Vercel deployment configuration
└── package.json
```

## Getting Started

### Local Development (No Cloud)

By default, the app runs in **local mode** using `localStorage`. No database setup is needed:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. All data is stored in your browser's localStorage.

### Cloud Mode with Vercel

To enable cloud-synced storage with a Postgres database:

#### 1. Create a Vercel Project

```bash
npm install -g vercel
vercel link
```

#### 2. Set Up a Postgres Database

Option A: Use the **Vercel Marketplace** to add a Neon Postgres database to your project.

Option B: Use any Postgres-compatible database and set the connection string manually.

#### 3. Configure Environment Variables

Set these environment variables in your Vercel project (or in a `.env.local` file for local development):

```env
# Database connection (provided by Vercel/Neon integration)
POSTGRES_URL="postgres://user:password@host:5432/dbname?sslmode=require"

# JWT secret for session tokens (generate a secure random string)
JWT_SECRET="your-random-secret-at-least-32-characters-long"

# Enable cloud mode in the frontend
VITE_USE_CLOUD="true"
```

> **Note:** The `VITE_USE_CLOUD` variable must be prefixed with `VITE_` so Vite exposes it to the frontend bundle. When this variable is set, the app uses API calls instead of localStorage.

#### 4. Run Database Migration

After deploying (or locally with `vercel dev`), run the migration endpoint to create database tables:

```bash
curl -X POST https://your-app.vercel.app/api/migrate
```

Or visit the endpoint in your browser's developer tools.

#### 5. Local Development with Cloud Backend

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run with Vercel's development server (includes serverless functions)
vercel dev
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_URL` | For cloud mode | PostgreSQL connection string |
| `JWT_SECRET` | For cloud mode | Secret key for JWT session tokens |
| `VITE_USE_CLOUD` | For cloud mode | Set to `"true"` to enable cloud API calls |

## Security & Privacy

- **Password hashing:** bcrypt with cost factor 12 (server-side) or PBKDF2 with 600,000 iterations (local mode)
- **Session management:** JWT tokens stored in httpOnly, SameSite cookies
- **Role-based access:** Parents, caregivers, and school admins have scoped data access
- **Audit trail:** All data modifications are logged with timestamps
- **HTTPS only:** Session cookies are marked `Secure` in production
- **Data isolation:** Users can only access children they are linked to

## Modes of Operation

| Feature | Local Mode | Cloud Mode |
|---------|-----------|------------|
| Data storage | Browser localStorage | Vercel Postgres |
| Cross-device sync | ❌ | ✅ |
| Auth backend | Client-side hashing | Server-side bcrypt + JWT |
| Invite system | Same-browser only | Cross-device, persistent |
| Import/export | ✅ | ✅ |
| Offline support | ✅ | ❌ |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── BottomNav.tsx
│   ├── BristolStoolPicker.tsx
│   ├── CalendarStrip.tsx
│   └── EntryCard.tsx
├── context/          # React context for app state
│   ├── AppContext.tsx
│   ├── appContextDef.ts
│   └── useApp.ts
├── pages/            # Page components
│   ├── AddEntryPage.tsx
│   ├── CalendarPage.tsx
│   ├── CaregiverPortalPage.tsx
│   ├── ChartsPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── api.ts        # Cloud API client
│   ├── auth.ts       # Local auth helpers
│   ├── importers.ts  # Import file parsers
│   └── storage.ts    # localStorage layer
├── App.tsx
├── index.css
└── main.tsx
```
