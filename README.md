# BladderTracker 🧸

A responsive web app for families to digitally track paediatric bladder and bowel diaries. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Multi-user profiles** — Parent/caregiver & child profiles with easy switching
- **Dashboard** — Daily and weekly overview with calendar strip, summary cards, and clinical reminders
- **Drink tracking** — Log time, type (cup/beaker/bottle/sippy), amount in ml, and notes
- **Urine tracking** — Log time, wet/pass events, and notes
- **Bowel tracking** — Log date/time, toilet/nappy, amount (S/M/L), Bristol Stool Chart type (visual picker), laxatives given, and notes
- **Charts & Insights** — Fluid intake bar chart, events timeline, stool type distribution
- **Calendar review** — Monthly calendar with coloured indicators for each entry type
- **Export** — Download diary as CSV for clinic visits
- **Invite caregivers** — Share tracking responsibility
- **Clinical advice** — Reminders for constipation/bladder health
- **Mobile-first** — Responsive design optimised for phones

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Recharts 3
- Lucide React icons
- date-fns

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── BottomNav.tsx
│   ├── BristolStoolPicker.tsx
│   ├── CalendarStrip.tsx
│   └── EntryCard.tsx
├── context/          # React context for app state
│   └── AppContext.tsx
├── pages/            # Page components
│   ├── AddEntryPage.tsx
│   ├── CalendarPage.tsx
│   ├── ChartsPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   └── storage.ts
├── App.tsx
├── index.css
└── main.tsx
```
