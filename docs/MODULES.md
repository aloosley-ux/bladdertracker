# Tracker Modules — Field Reference

This document describes each tracker module, what it records, who should use it, and clinical guidance on each field.

---

## 🥤 Drinks

**Purpose:** Track all fluid intake throughout the day to monitor hydration, which directly impacts bladder function, bowel regularity, and overall health.

| Field | Type | Description |
|-------|------|-------------|
| `amountMl` | number | Volume consumed in millilitres. Typical values: cup ≈ 200ml, beaker ≈ 250ml, bottle ≈ 500ml |
| `type` | string | Vessel or drink type: `cup`, `beaker`, `bottle`, `sippy`, `other` |
| `date` | string | Date in `YYYY-MM-DD` format |
| `time` | string | Time in `HH:MM` format |
| `notes` | string | Optional free text — e.g., "refused half", "added squash" |

**Clinical note:** Most children need 1–1.5 litres of fluid daily. Concentrated dark urine or infrequent voiding may indicate under-hydration.

---

## 💦 Urine

**Purpose:** Track voiding patterns including whether events are wet (leakage) or pass (toilet success), volume output, urgency, and leakage severity.

| Field | Type | Description |
|-------|------|-------------|
| `wet` | boolean | True if urine was present in pad/pants |
| `pass` | boolean | True if urine was passed into the toilet |
| `volumeMl` | number \| null | Measured volume if using collection device or scales |
| `urgency` | number \| null | Urgency scale 1–5: 1 = no urgency, 5 = urgent/desperate |
| `leakageAmount` | string | `none`, `small`, `moderate`, `large` |
| `notes` | string | Free text observations |

**Clinical note:** Recording urgency and leakage patterns helps identify overactive bladder, detrusor instability, or toilet avoidance behaviours.

---

## 🚽 Bowel

**Purpose:** Track bowel movements using the internationally recognised Bristol Stool Scale to identify constipation, diarrhoea, or healthy patterns.

| Field | Type | Description |
|-------|------|-------------|
| `bristolType` | number (1–7) | Bristol Stool Scale: 1–2 = constipation, 3–4 = ideal, 5–7 = diarrhoea |
| `amount` | string | Estimated quantity: `small`, `medium`, `large` |
| `location` | string | Where it occurred: `toilet`, `pad`, `pants` |
| `laxativesGiven` | boolean | Whether laxatives were administered |
| `date` / `time` | string | When it occurred |
| `notes` | string | Optional observations |

**Bristol Stool Scale:**
- **Type 1:** Hard, separate lumps (severe constipation)
- **Type 2:** Lumpy, sausage-shaped (mild constipation)
- **Type 3:** Sausage with cracks (normal)
- **Type 4:** Smooth, soft sausage (ideal)
- **Type 5:** Soft blobs (lacking fibre)
- **Type 6:** Fluffy, mushy pieces (mild diarrhoea)
- **Type 7:** Watery, no solids (diarrhoea)

---

## 🌙 Sleep

**Purpose:** Track sleep patterns including onset, waking, naps, and quality to identify sleep-bladder relationships and overall wellbeing.

| Field | Type | Description |
|-------|------|-------------|
| `eventType` | string | `onset` (falling asleep), `wake` (waking up), `nap`, `disturbed` |
| `durationMinutes` | number \| null | Duration of sleep or nap in minutes |
| `quality` | number \| null | Sleep quality 1–5: 1 = very poor, 5 = excellent |
| `nighttimeEvent` | boolean | Whether this occurred between 10pm–6am |
| `notes` | string | Free text |

**Clinical note:** Disrupted sleep and nocturnal enuresis (bed-wetting) are often linked. Tracking both can reveal patterns and support clinical discussions.

---

## 🎯 Toilet Attempts

**Purpose:** Track structured toilet training sessions to measure success rates, identify optimal timing, and support positive reinforcement planning.

| Field | Type | Description |
|-------|------|-------------|
| `outcome` | string | `success` (produced urine/stool), `failure` (nothing produced), `refused` |
| `supervised` | boolean | Whether a carer was present |
| `prompted` | boolean | Whether the child was asked/reminded to try |
| `durationMinutes` | number \| null | How long they sat on the toilet |
| `notes` | string | Observations |

---

## 🍽️ Food

**Purpose:** Track dietary intake to correlate with bowel patterns, energy levels, and fluid balance.

| Field | Type | Description |
|-------|------|-------------|
| `mealType` | string | `breakfast`, `lunch`, `dinner`, `snack` |
| `description` | string | Brief description of what was eaten |
| `portions` | number \| null | Portions consumed: `0.25`, `0.5`, `0.75`, `1`, `1.5` |
| `notes` | string | Free text |

---

## 😊 Mood

**Purpose:** Track emotional wellbeing to identify correlations with behaviour, sleep, pain, or environmental factors.

| Field | Type | Description |
|-------|------|-------------|
| `level` | number (1–5) | 1 = very distressed, 2 = upset/sad, 3 = neutral/calm, 4 = happy, 5 = very happy |
| `triggers` | string | Possible causes — e.g., "transition anxiety", "new environment", "pain" |
| `notes` | string | Additional context |

**Clinical note:** Mood tracking can highlight pre-meltdown patterns, pain indicators, or the impact of changes in routine.

---

## 🎨 Sensory

**Purpose:** Track sensory processing events to build a sensory profile and identify triggers, helping to design sensory diets and environmental supports.

| Field | Type | Description |
|-------|------|-------------|
| `sensoryType` | string | `tactile`, `auditory`, `visual`, `gustatory`, `olfactory`, `vestibular`, `proprioceptive`, `other` |
| `response` | string | `seeking` (wanting more input), `avoiding` (withdrawing), `neutral` |
| `intensity` | number (1–5) | Strength of event: 1 = barely noticeable, 5 = overwhelming |
| `notes` | string | Observations |

**Sensory types explained:**
- **Tactile:** Touch, textures, temperature (e.g., labels in clothes, sand play)
- **Auditory:** Sounds, volume, pitch (e.g., fire alarms, crowded spaces)
- **Visual:** Light, colour, movement (e.g., flickering lights, busy patterns)
- **Gustatory:** Taste, texture of food (e.g., mixed textures, strong flavours)
- **Olfactory:** Smell (e.g., perfume, food smells)
- **Vestibular:** Balance and movement (e.g., swings, car travel)
- **Proprioceptive:** Body position and pressure (e.g., weighted blankets, tight hugs)

---

## 💊 Medication

**Purpose:** Log medication administration to ensure dosing consistency and record missed or refused doses.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Medication name as prescribed |
| `dosage` | string | Dose given — e.g., "5mg", "1 tablet", "10ml" |
| `administered` | boolean | Whether the dose was successfully given (false = missed/refused) |
| `notes` | string | Observations — e.g., "refused, tried again 30min later" |

**Reminder:** This app records medication for *diary purposes only* and is not a substitute for medical advice. Always follow the prescriber's instructions.

---

## 🧩 Therapy

**Purpose:** Log therapy sessions to track frequency, duration, and goals — supporting communication between home and clinical teams.

| Field | Type | Description |
|-------|------|-------------|
| `therapyType` | string | `speech` (SALT), `OT` (Occupational Therapy), `PT` (Physiotherapy), `ABA`, `behavioural`, `music`, `art`, `other` |
| `provider` | string | Therapist name or organisation |
| `durationMinutes` | number | Session length |
| `goals` | string | Goals targeted in this session |
| `notes` | string | Session observations |

---

## 📋 Routine

**Purpose:** Track daily routine completion to identify difficulties with transitions, build consistency, and celebrate achievements.

| Field | Type | Description |
|-------|------|-------------|
| `routineName` | string | Short label — e.g., "Morning teeth brushing", "Getting dressed" |
| `completed` | boolean | Whether the routine step was completed |
| `durationMinutes` | number \| null | How long it took |
| `notes` | string | Observations — e.g., "needed 3 prompts", "did it independently!" |

---

## ⭐ Milestones

**Purpose:** Track developmental milestones across 8 domains to celebrate achievements and share progress with clinical teams.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Milestone name — e.g., "Requests using words", "Dresses independently" |
| `category` | string | `speech`, `motor`, `social`, `cognitive`, `self_care`, `routine`, `sensory`, `other` |
| `status` | string | `not_started`, `in_progress`, `achieved` |
| `dateAchieved` | string \| null | Date achieved in `YYYY-MM-DD` format |
| `description` | string | Detailed description of the milestone goal |
| `notes` | string | Progress notes |

**Categories:**
- **Speech:** Communication, language, AAC/PECS use
- **Motor:** Gross motor (walking, climbing) and fine motor (writing, using tools)
- **Social:** Eye contact, turn-taking, peer interaction
- **Cognitive:** Problem solving, memory, academic skills
- **Self-care:** Dressing, feeding, hygiene, toilet independence
- **Routine:** Following schedules, transition management
- **Sensory:** Sensory tolerance, sensory diet goals
- **Other:** Any domain not listed above

---

## Module Settings

Modules can be toggled on or off per child in **Settings → Modules for [Child Name]**. Click **Save Module Settings** to persist changes to the database.

The 6 core modules (Drinks, Urine, Bowel, Sleep, Toilet Attempts, Food) are enabled by default. The 5 newer modules (Mood, Sensory, Medication, Therapy, Routine) are disabled by default and must be enabled per child.

Milestones are always accessible from the navigation regardless of module settings.
