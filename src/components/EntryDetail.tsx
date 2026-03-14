import { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import * as api from '../utils/api';
import type { AuditEvent } from '../types';

export default function EntryDetail({ type, entry }: { type: string; entry: unknown }) {
  const app = useApp();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(JSON.stringify(entry, null, 2));
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  useEffect(() => { setValue(JSON.stringify(entry, null, 2)); }, [entry]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const e = entry as { id?: unknown };
        if (e?.id && typeof e.id === 'string') {
          const events = await api.apiGetAuditEvents(e.id);
          if (mounted) setAudit(events);
        }
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [entry]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const parsed = JSON.parse(value);
      // Use app context update methods where available
      switch (type) {
        case 'drinks': await app.updateDrink(parsed); break;
        case 'urine': await app.updateUrineEntry(parsed); break;
        case 'bowel': await app.updateBowelEntry(parsed); break;
        case 'sleep': await app.updateSleepEntry(parsed); break;
        case 'toilet': await app.updateToiletAttemptEntry(parsed); break;
        case 'food': await app.updateFoodEntry(parsed); break;
        case 'mood': await app.updateMoodEntry(parsed); break;
        case 'sensory': await app.updateSensoryEntry(parsed); break;
        case 'medication': await app.updateMedicationEntry(parsed); break;
        case 'therapy': await app.updateTherapyEntry(parsed); break;
        case 'routine': await app.updateRoutineEntry(parsed); break;
        default: break;
      }
      setEditMode(false);
      // refresh audits
      const e = entry as { id?: unknown };
      if (e?.id && typeof e.id === 'string') {
        const events = await api.apiGetAuditEvents(e.id);
        setAudit(events);
      }
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save changes — check console');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-3 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-600 font-medium">Details</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 flex items-center gap-2">
            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
            Edit
          </label>
        </div>
      </div>

      {editMode ? (
        <div>
          <textarea className="w-full font-mono text-xs p-2 border rounded-md" rows={8} value={value} onChange={(e) => setValue(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSave} disabled={loading} className="px-3 py-2 bg-lavender-500 text-white rounded-md text-sm">{loading ? 'Saving…' : 'Save'}</button>
            <button onClick={() => { setEditMode(false); setValue(JSON.stringify(entry, null, 2)); }} className="px-3 py-2 bg-gray-100 text-sm rounded-md">Cancel</button>
          </div>
        </div>
      ) : (
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(entry, null, 2)}</pre>
      )}

      <div className="mt-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">Audit history</div>
        {audit.length === 0 ? (
          <div className="text-xs text-gray-400">No audit events</div>
        ) : (
          <ul className="text-xs text-gray-700 space-y-1">
            {audit.map((ev) => (
              <li key={ev.id} className="border-l border-gray-200 pl-2">
                <div className="text-gray-800 font-medium">{ev.action}</div>
                <div className="text-gray-500">{ev.detail}</div>
                <div className="text-gray-400 text-[11px]">{new Date(ev.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
