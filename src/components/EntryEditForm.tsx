import { useState } from 'react';
import { useApp } from '../context/useApp';
import BristolStoolPicker from './BristolStoolPicker';
import type {
  DrinkEntry,
  SleepEntry,
  FoodEntry,
  BristolStoolType,
  BowelAmount,
  MoodLevel,
  SleepEventType,
  ToiletAttemptOutcome,
  TherapyType,
  UrgencyLevel,
  LeakageAmount,
  SensoryResponseType,
} from '../types';

const inputCls =
  'w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm';

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-gray-600">
      {children}
    </label>
  );
}

function PillBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-violet-50'
      }`}
    >
      {children}
    </button>
  );
}

function YesNo({ value, onChange, yesLabel = '✓ Yes', noLabel = '✗ No' }: { value: boolean; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string }) {
  return (
    <div className="flex gap-2 mt-1">
      <PillBtn active={value} onClick={() => onChange(true)}>{yesLabel}</PillBtn>
      <PillBtn active={!value} onClick={() => onChange(false)}>{noLabel}</PillBtn>
    </div>
  );
}

// EntryEditForm — unified edit form that handles all tracker module entry types.
export default function EntryEditForm({
  type,
  entry,
  onSaved,
  onCancel,
}: {
  type: string;
  entry: unknown;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const app = useApp();
  const raw = entry as Record<string, unknown>;
  const [saving, setSaving] = useState(false);

  // Shared
  const [date, setDate] = useState(String(raw.date ?? ''));
  const [time, setTime] = useState(String(raw.time ?? ''));
  const [notes, setNotes] = useState(String(raw.notes ?? ''));

  // Drink
  const [drinkType, setDrinkType] = useState(String(raw.type ?? 'cup'));
  const [amountMl, setAmountMl] = useState(raw.amountMl != null ? String(raw.amountMl) : '');

  // Urine
  const [wet, setWet] = useState(Boolean(raw.wet));
  const [pass, setPass] = useState(Boolean(raw.pass));
  const [volumeMl, setVolumeMl] = useState(raw.volumeMl != null ? String(raw.volumeMl) : '');
  const [urgency, setUrgency] = useState<number | null>(raw.urgency != null ? Number(raw.urgency) : null);
  const [leakageAmount, setLeakageAmount] = useState(String(raw.leakageAmount ?? 'none'));

  // Bowel
  const [bowelLocation, setBowelLocation] = useState<'toilet' | 'nappy'>((raw.location as 'toilet' | 'nappy') ?? 'toilet');
  const [bowelAmount, setBowelAmount] = useState<BowelAmount>((raw.amount as BowelAmount) ?? 'M');
  const [bristolType, setBristolType] = useState<BristolStoolType | null>((raw.bristolType as BristolStoolType) ?? null);
  const [laxativesGiven, setLaxativesGiven] = useState(Boolean(raw.laxativesGiven));

  // Sleep
  const [sleepEventType, setSleepEventType] = useState<SleepEventType>((raw.eventType as SleepEventType) ?? 'onset');
  const [bedtime, setBedtime] = useState(raw.bedtime != null ? String(raw.bedtime) : '');
  const [sleepOnsetMins, setSleepOnsetMins] = useState(raw.sleepOnsetMinutes != null ? String(raw.sleepOnsetMinutes) : '');
  const [sleepDuration, setSleepDuration] = useState(raw.durationMinutes != null ? String(raw.durationMinutes) : '');
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5 | null>((raw.quality as 1 | 2 | 3 | 4 | 5) ?? null);
  const [nighttimeEvent, setNighttimeEvent] = useState(Boolean(raw.nighttimeEvent));
  const [nightActivity, setNightActivity] = useState(Boolean(raw.nightActivity));

  // Toilet
  const [outcome, setOutcome] = useState<ToiletAttemptOutcome>((raw.outcome as ToiletAttemptOutcome) ?? 'success');
  const [supervised, setSupervised] = useState(Boolean(raw.supervised));
  const [prompted, setPrompted] = useState(Boolean(raw.prompted));
  const [toiletDuration, setToiletDuration] = useState(raw.durationMinutes != null ? String(raw.durationMinutes) : '');

  // Food
  const [mealType, setMealType] = useState(String(raw.mealType ?? 'breakfast'));
  const [description, setDescription] = useState(String(raw.description ?? ''));
  const [portions, setPortions] = useState(raw.portions != null ? String(raw.portions) : '');
  const [isTrying, setIsTrying] = useState(Boolean(raw.isTrying));

  // Mood
  const [moodLevel, setMoodLevel] = useState<MoodLevel>((raw.level as MoodLevel) ?? 3);
  const [triggers, setTriggers] = useState(String(raw.triggers ?? ''));

  // Sensory
  const [sensoryType, setSensoryType] = useState(String(raw.sensoryType ?? ''));
  const [sensoryResponse, setSensoryResponse] = useState<SensoryResponseType>((raw.response as SensoryResponseType) ?? 'neutral');
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>((raw.intensity as 1 | 2 | 3 | 4 | 5) ?? 3);

  // Medication
  const [medName, setMedName] = useState(String(raw.name ?? ''));
  const [dosage, setDosage] = useState(String(raw.dosage ?? ''));
  const [administered, setAdministered] = useState(Boolean(raw.administered));

  // Therapy
  const [therapyType, setTherapyType] = useState<TherapyType>((raw.therapyType as TherapyType) ?? 'speech');
  const [therapyProvider, setTherapyProvider] = useState(String(raw.provider ?? ''));
  const [therapyDuration, setTherapyDuration] = useState(raw.durationMinutes != null ? String(raw.durationMinutes) : '');
  const [goals, setGoals] = useState(String(raw.goals ?? ''));

  // Routine
  const [routineName, setRoutineName] = useState(String(raw.routineName ?? ''));
  const [completed, setCompleted] = useState(Boolean(raw.completed));
  const [routineDuration, setRoutineDuration] = useState(raw.durationMinutes != null ? String(raw.durationMinutes) : '');

  const id = raw.id as string;
  const childId = raw.childId as string;
  const createdBy = raw.createdBy as string;
  const createdAt = raw.createdAt as string;

  const handleSave = async () => {
    setSaving(true);
    try {
      switch (type) {
        case 'drinks':
          await app.updateDrink({
            id, childId, date, time,
            type: drinkType as DrinkEntry['type'],
            amountMl: Number(amountMl),
            notes, createdBy, createdAt,
          });
          break;
        case 'urine':
          await app.updateUrineEntry({
            id, childId, date, time, wet, pass,
            volumeMl: volumeMl ? Number(volumeMl) : null,
            urgency: urgency as UrgencyLevel | null,
            leakageAmount: leakageAmount as LeakageAmount,
            notes, createdBy, createdAt,
          });
          break;
        case 'bowel':
          if (!bristolType) return;
          await app.updateBowelEntry({
            id, childId, date, time,
            location: bowelLocation,
            amount: bowelAmount,
            bristolType,
            laxativesGiven,
            notes, createdBy, createdAt,
          });
          break;
        case 'sleep':
          await app.updateSleepEntry({
            id, childId, date, time,
            eventType: sleepEventType,
            bedtime: bedtime || null,
            sleepOnsetMinutes: sleepOnsetMins ? Number(sleepOnsetMins) : null,
            durationMinutes: sleepDuration ? Number(sleepDuration) : null,
            quality: sleepQuality as SleepEntry['quality'],
            nighttimeEvent,
            nightActivity,
            notes, createdBy, createdAt,
          });
          break;
        case 'toilet':
          await app.updateToiletAttemptEntry({
            id, childId, date, time, outcome, supervised, prompted,
            durationMinutes: toiletDuration ? Number(toiletDuration) : null,
            notes, createdBy, createdAt,
          });
          break;
        case 'food':
          await app.updateFoodEntry({
            id, childId, date, time,
            mealType: mealType as FoodEntry['mealType'],
            description,
            portions: portions ? Number(portions) : null,
            isTrying,
            texture: (raw.texture as FoodEntry['texture']) ?? null,
            accepted: (raw.accepted as FoodEntry['accepted']) ?? null,
            notes, createdBy, createdAt,
          });
          break;
        case 'mood':
          await app.updateMoodEntry({
            id, childId, date, time, level: moodLevel, triggers, notes, createdBy, createdAt,
          });
          break;
        case 'sensory':
          await app.updateSensoryEntry({
            id, childId, date, time, sensoryType,
            response: sensoryResponse,
            intensity,
            notes, createdBy, createdAt,
          });
          break;
        case 'medication':
          await app.updateMedicationEntry({
            id, childId, date, time, name: medName, dosage, administered, notes, createdBy, createdAt,
          });
          break;
        case 'therapy':
          await app.updateTherapyEntry({
            id, childId, date, time, therapyType,
            provider: therapyProvider,
            durationMinutes: Number(therapyDuration) || 0,
            goals, notes, createdBy, createdAt,
          });
          break;
        case 'routine':
          await app.updateRoutineEntry({
            id, childId, date, time, routineName, completed,
            durationMinutes: routineDuration ? Number(routineDuration) : null,
            notes, createdBy, createdAt,
          });
          break;
        default:
          break;
      }
      onSaved(id);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save — check console');
    } finally {
      setSaving(false);
    }
  };

  function WhenRow() {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="entry-date">Date</Label>
          <input id="entry-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <Label htmlFor="entry-time">Time</Label>
          <input id="entry-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
        </div>
      </div>
    );
  }

  function NotesRow() {
    return (
      <div>
        <Label>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="Optional notes…"
        />
      </div>
    );
  }

  function renderFields() {
    switch (type) {
      case 'drinks': {
        const drinkTypes = [
          { value: 'cup', label: '🥤 Cup' }, { value: 'beaker', label: '🍶 Beaker' },
          { value: 'bottle', label: '🍼 Bottle' }, { value: 'sippy', label: '🧃 Sippy' },
          { value: 'other', label: '🫗 Other' },
        ];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Drink type</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {drinkTypes.map((dt) => (
                  <PillBtn key={dt.value} active={drinkType === dt.value} onClick={() => setDrinkType(dt.value)}>
                    {dt.label}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Amount (ml)</Label>
              <input type="number" value={amountMl} onChange={(e) => setAmountMl(e.target.value)}
                className={inputCls} min="0" placeholder="ml" />
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {[50, 100, 150, 200, 250, 300].map((v) => (
                  <button key={v} type="button" onClick={() => setAmountMl(String(v))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      amountMl === String(v)
                        ? 'bg-sky-200 text-sky-800'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-sky-50'
                    }`}>
                    {v}ml
                  </button>
                ))}
              </div>
            </div>
            <NotesRow />
          </div>
        );
      }

      case 'urine': {
        const urgencyLabels = [
          { v: 1, emoji: '😌' }, { v: 2, emoji: '🙂' }, { v: 3, emoji: '😐' },
          { v: 4, emoji: '😣' }, { v: 5, emoji: '🆘' },
        ];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>What happened</Label>
              <div className="flex gap-3 mt-1">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  wet ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white hover:border-yellow-200'
                }`}>
                  <input type="checkbox" checked={wet} onChange={(e) => setWet(e.target.checked)} className="sr-only" />
                  <span>💧</span><span className="text-sm font-medium text-gray-700">Wet clothes</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  pass ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'
                }`}>
                  <input type="checkbox" checked={pass} onChange={(e) => setPass(e.target.checked)} className="sr-only" />
                  <span>🚽</span><span className="text-sm font-medium text-gray-700">Used toilet</span>
                </label>
              </div>
            </div>
            <div>
              <Label>Volume (ml) — optional</Label>
              <input type="number" value={volumeMl} onChange={(e) => setVolumeMl(e.target.value)}
                className={inputCls} min="0" placeholder="ml" />
            </div>
            <div>
              <Label>Urgency (1–5)</Label>
              <div className="flex gap-2 mt-1">
                {urgencyLabels.map(({ v, emoji }) => (
                  <PillBtn key={v} active={urgency === v} onClick={() => setUrgency(urgency === v ? null : v)}>
                    {emoji} {v}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Leakage</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {(['none', 'small', 'medium', 'large'] as const).map((v) => (
                  <PillBtn key={v} active={leakageAmount === v} onClick={() => setLeakageAmount(v)}>
                    {v === 'none' ? '✅ None' : v === 'small' ? '💧 Small' : v === 'medium' ? '💦 Medium' : '🌊 Large'}
                  </PillBtn>
                ))}
              </div>
            </div>
            <NotesRow />
          </div>
        );
      }

      case 'bowel':
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Location</Label>
              <div className="flex gap-2 mt-1">
                <PillBtn active={bowelLocation === 'toilet'} onClick={() => setBowelLocation('toilet')}>🚽 Toilet</PillBtn>
                <PillBtn active={bowelLocation === 'nappy'} onClick={() => setBowelLocation('nappy')}>👶 Nappy</PillBtn>
              </div>
            </div>
            <div>
              <Label>Amount</Label>
              <div className="flex gap-2 mt-1">
                {(['S', 'M', 'L'] as const).map((v) => (
                  <PillBtn key={v} active={bowelAmount === v} onClick={() => setBowelAmount(v)}>
                    {v === 'S' ? '🔹 Small' : v === 'M' ? '🔸 Medium' : '🔶 Large'}
                  </PillBtn>
                ))}
              </div>
            </div>
            <BristolStoolPicker value={bristolType} onChange={setBristolType} />
            <div>
              <Label>Laxatives given?</Label>
              <YesNo value={laxativesGiven} onChange={setLaxativesGiven} yesLabel="💊 Yes" noLabel="❌ No" />
            </div>
            <NotesRow />
          </div>
        );

      case 'sleep': {
        const sleepEvents = [
          { value: 'onset', label: '😴 Sleep onset' }, { value: 'wake', label: '☀️ Wake up' },
          { value: 'nap_start', label: '💤 Nap start' }, { value: 'nap_end', label: '⏰ Nap end' },
        ];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Event type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {sleepEvents.map((se) => (
                  <PillBtn key={se.value} active={sleepEventType === se.value} onClick={() => setSleepEventType(se.value as SleepEventType)}>
                    {se.label}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Bedtime</Label>
                <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Onset delay (min)</Label>
                <input type="number" value={sleepOnsetMins} onChange={(e) => setSleepOnsetMins(e.target.value)} className={inputCls} min="0" />
              </div>
            </div>
            <div>
              <Label>Duration (min)</Label>
              <input type="number" value={sleepDuration} onChange={(e) => setSleepDuration(e.target.value)} className={inputCls} min="0" />
            </div>
            <div>
              <Label>Sleep quality (1–5)</Label>
              <div className="flex gap-2 mt-1">
                {([1, 2, 3, 4, 5] as const).map((v) => (
                  <PillBtn key={v} active={sleepQuality === v} onClick={() => setSleepQuality(sleepQuality === v ? null : v)}>
                    {v === 1 ? '😫' : v === 2 ? '😕' : v === 3 ? '😐' : v === 4 ? '🙂' : '😊'} {v}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nighttimeEvent} onChange={(e) => setNighttimeEvent(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">🌙 Night event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nightActivity} onChange={(e) => setNightActivity(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">🚽 Bladder disrupted</span>
              </label>
            </div>
            <NotesRow />
          </div>
        );
      }

      case 'toilet': {
        const outcomes = [
          { value: 'success', label: `✅ success` },
          { value: 'failure', label: `❌ failure` },
          { value: 'no_event', label: `🚫 no event` },
        ];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Outcome</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {outcomes.map((o) => (
                  <PillBtn key={o.value} active={outcome === o.value} onClick={() => setOutcome(o.value as ToiletAttemptOutcome)}>
                    {o.label}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={supervised} onChange={(e) => setSupervised(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">👀 Supervised</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={prompted} onChange={(e) => setPrompted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">🔔 Prompted</span>
              </label>
            </div>
            <div>
              <Label>Duration (min) — optional</Label>
              <input type="number" value={toiletDuration} onChange={(e) => setToiletDuration(e.target.value)}
                className={inputCls} min="0" />
            </div>
            <NotesRow />
          </div>
        );
      }

      case 'food': {
        const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Meal</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {meals.map((m) => (
                  <PillBtn key={m} active={mealType === m} onClick={() => setMealType(m)}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                className={inputCls} placeholder="What was eaten…" />
            </div>
            <div>
              <Label>Portions — optional</Label>
              <input type="number" value={portions} onChange={(e) => setPortions(e.target.value)}
                className={inputCls} min="0" step="0.5" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isTrying} onChange={(e) => setIsTrying(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">🌟 New food trial</span>
            </label>
            <NotesRow />
          </div>
        );
      }

      case 'mood':
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Mood level (1–5)</Label>
              <div className="flex gap-2 mt-1">
                {([1, 2, 3, 4, 5] as const).map((l) => (
                  <PillBtn key={l} active={moodLevel === l} onClick={() => setMoodLevel(l as MoodLevel)}>
                    {l === 1 ? '😢' : l === 2 ? '😟' : l === 3 ? '😐' : l === 4 ? '🙂' : '😁'} {l}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Triggers</Label>
              <input value={triggers} onChange={(e) => setTriggers(e.target.value)}
                className={inputCls} placeholder="What caused this mood…" />
            </div>
            <NotesRow />
          </div>
        );

      case 'sensory':
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Sensory type</Label>
              <input value={sensoryType} onChange={(e) => setSensoryType(e.target.value)}
                className={inputCls} placeholder="e.g. auditory, tactile, visual…" />
            </div>
            <div>
              <Label>Response</Label>
              <div className="flex gap-2 mt-1">
                {(['seeking', 'avoiding', 'neutral'] as const).map((r) => (
                  <PillBtn key={r} active={sensoryResponse === r} onClick={() => setSensoryResponse(r)}>
                    {r}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Intensity (1–5)</Label>
              <div className="flex gap-2 mt-1">
                {([1, 2, 3, 4, 5] as const).map((v) => (
                  <PillBtn key={v} active={intensity === v} onClick={() => setIntensity(v)}>
                    {v}
                  </PillBtn>
                ))}
              </div>
            </div>
            <NotesRow />
          </div>
        );

      case 'medication':
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Medication name</Label>
              <input value={medName} onChange={(e) => setMedName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label>Dosage</Label>
              <input value={dosage} onChange={(e) => setDosage(e.target.value)}
                className={inputCls} placeholder="e.g. 5mg, 1 tablet" />
            </div>
            <div>
              <Label>Administered?</Label>
              <YesNo value={administered} onChange={setAdministered} yesLabel="✅ Yes" noLabel="❌ No" />
            </div>
            <NotesRow />
          </div>
        );

      case 'therapy': {
        const therapyTypes: { value: TherapyType; label: string }[] = [
          { value: 'speech', label: '🗣️ Speech' },
          { value: 'occupational', label: '✂️ OT' },
          { value: 'physical', label: '🏃 Physical' },
          { value: 'behavioral', label: '🧠 Behavioral' },
          { value: 'other', label: '📌 Other' },
        ];
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Therapy type</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {therapyTypes.map((t) => (
                  <PillBtn key={t.value} active={therapyType === t.value} onClick={() => setTherapyType(t.value)}>
                    {t.label}
                  </PillBtn>
                ))}
              </div>
            </div>
            <div>
              <Label>Provider</Label>
              <input value={therapyProvider} onChange={(e) => setTherapyProvider(e.target.value)}
                className={inputCls} placeholder="Provider name…" />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <input type="number" value={therapyDuration} onChange={(e) => setTherapyDuration(e.target.value)}
                className={inputCls} min="0" />
            </div>
            <div>
              <Label>Goals</Label>
              <input value={goals} onChange={(e) => setGoals(e.target.value)}
                className={inputCls} placeholder="Session goals…" />
            </div>
            <NotesRow />
          </div>
        );
      }

      case 'routine':
        return (
          <div className="space-y-3">
            <WhenRow />
            <div>
              <Label>Routine name</Label>
              <input value={routineName} onChange={(e) => setRoutineName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label>Completed?</Label>
              <YesNo value={completed} onChange={setCompleted} yesLabel="✅ Completed" noLabel="❌ Not done" />
            </div>
            <div>
              <Label>Duration (min) — optional</Label>
              <input type="number" value={routineDuration} onChange={(e) => setRoutineDuration(e.target.value)}
                className={inputCls} min="0" />
            </div>
            <NotesRow />
          </div>
        );

      default:
        return <p className="text-xs text-gray-400 italic">Unknown entry type</p>;
    }
  }

  return (
    <div className="space-y-3">
      {renderFields()}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-violet-200"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
