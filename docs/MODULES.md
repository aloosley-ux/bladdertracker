# Tracker Modules — Current Field Reference

This file documents the current module set and field contracts used by the app (`src/types/index.ts`, form components, and API/storage layers).

## Module defaults

### Enabled by default
- Drinks
- Wee (Urine)
- Poo (Bowel)
- Sleep
- Toilet visits
- Meals
- Milestones

### Disabled by default (opt-in per child)
- Mood
- Sensory
- Medication
- Therapy
- Routines
- Leaps

Milestones has a dedicated page and remains available in navigation.

---

## Drinks (`drinks`)
- `type`: `cup | beaker | bottle | sippy | other`
- `amountMl`: number
- `date`, `time`, `notes`

## Wee / Urine (`urine`)
- `wet`: boolean
- `pass`: boolean
- `volumeMl?`: number | null
- `urgency?`: `1 | 2 | 3 | 4 | 5`
- `leakageAmount?`: `none | small | medium | large`
- `date`, `time`, `notes`

## Poo / Bowel (`bowel`)
- `location`: `toilet | nappy`
- `amount`: `S | M | L`
- `bristolType`: `1..7`
- `laxativesGiven`: boolean
- `imageUrl?`: string
- `date`, `time`, `notes`

## Sleep (`sleep`)
- `eventType`: `onset | wake | nap_start | nap_end`
- `bedtime?`: `HH:mm` (primarily for onset)
- `sleepOnsetMinutes?`: number | null
- `durationMinutes?`: number | null
- `quality?`: `1..5`
- `nighttimeEvent?`: boolean
- `nightActivity?`: boolean
- `date`, `time`, `notes`

## Toilet visits (`toilet`)
- `outcome`: `success | failure | no_event`
- `supervised`: boolean
- `prompted`: boolean
- `durationMinutes?`: number | null
- `date`, `time`, `notes`

## Meals / Food (`food`)
- `mealType`: `breakfast | lunch | dinner | snack`
- `description`: string
- `portions?`: number | null
- `isTrying?`: boolean
- `texture?`: `pureed | mashed | soft | chopped | whole | mixed`
- `accepted?`: `accepted | refused | partial | first_try`
- `date`, `time`, `notes`

## Mood (`mood`)
- `level`: `1..5`
- `triggers`: string
- `date`, `time`, `notes`

## Sensory (`sensory`)
- `sensoryType`: string
- `response`: `seeking | avoiding | neutral`
- `intensity`: `1..5`
- `date`, `time`, `notes`

## Medication (`medication`)
- `name`: string
- `dosage`: string
- `administered`: boolean
- `date`, `time`, `notes`

## Therapy (`therapy`)
- `therapyType`: string
- `provider`: string
- `durationMinutes`: number
- `goals`: string
- `date`, `time`, `notes`

## Routines (`routine`)
- `routineName`: string
- `completed`: boolean
- `durationMinutes?`: number | null
- `date`, `time`, `notes`

## Milestones (`milestones`)
- `name`: string
- `description`: string
- `category`: `speech | motor | social | cognitive | self_care | routine | sensory | other`
- `moduleId?`: `ModuleId`
- `milestoneType?`: `developmental | educational | medical | therapy | custom`
- `status`: `not_started | in_progress | achieved`
- `targetDate?`: string | null
- `dateAchieved?`: string | null
- `sourceRole?`: `UserRole`
- `notes`: string

## Leaps (`leaps`)
Leaps is configured as a module and has a dedicated page (`/leaps`) with three sub-sections:

- **Milestones** (default tab): Quick-log symptom/diary entries, milestone progress by category, missed milestones alerts, and guidance/support links. Links to the dedicated Milestones page for detailed management.
- **Overview**: Age calculator, leap progress chart, current leap guidance with skills and parental tips, missed milestones alert, and quick stats.
- **Timeline**: Leap timeline and a link to the full Milestones page.

The previous "Tools" tab has been removed — SymptomLogger and LeapDiary are now available directly on the Milestones sub-page. Leap reminder settings have been moved to the Settings page under "Reminder preferences". The inline DOB editor has been removed; users are directed to Settings to set a due date.

Current persistence note:
- Leap diary entries and leap symptom logs are handled through local storage helpers only.
- There is currently no cloud `/api/*` endpoint for leap diary or leap symptom log CRUD.

---

## Reminder preferences
Reminder preferences are **module-wide** — not milestone-only. Any enabled module can have a reminder configured. The reminder scope decision is: **module-wide**.

Supported reminder modules (those that appear in reminder settings):
- `milestones`
- `therapy`
- `routine`
- `mood`
- `leaps`

Each preference is scoped per user + child + module and supports:
- `frequency`: `daily | weekly`
- `enabled`: boolean
- `snoozedUntil?`: ISO timestamp (reminder is suppressed until this time)
- `nextReminderAt?`: ISO timestamp

The dashboard reminder banner covers all active module reminders, not just milestones. The Settings page calls these "module reminders".

---

## Import/export caveats

- The **Settings UI import flow** currently parses CSV / JSON / XLSX templates for **drinks, urine, and bowel** rows.
- The underlying `/api/data` import endpoint can also accept direct payload arrays for **sleep**, **toilet attempts**, and **food**.
- CSV export covers all diary trackers and milestones available in the current storage mode.

---

## Cloud / Local parity matrix for extended tracker fields

This table documents which fields exist in all persistence paths. ✅ = supported, ❌ = not supported.

| Field | Type definition | localStorage | Cloud DB | API GET | API POST/PUT | CSV export | CSV import |
|---|---|---|---|---|---|---|---|
| **Sleep** | | | | | | | |
| `eventType` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `durationMinutes` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `quality` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `nighttimeEvent` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `bedtime` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sleepOnsetMinutes` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `nightActivity` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Food** | | | | | | | |
| `mealType` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `description` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `portions` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isTrying` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `texture` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `accepted` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
