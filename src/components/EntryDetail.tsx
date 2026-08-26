/**
 * EntryDetail — expandable read/edit panel shown inside an EntryCard.
 *
 * View mode  : labelled field-value grid, styled to match the rest of the app.
 * Edit mode  : inline form with the same pill-buttons / inputs as the Add Entry
 *              forms.  Cancel reverts by unmounting the form sub-component.
 * Audit pane : shows structured audit history fetched from /api/audit.
 */
import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import * as api from '../utils/api';
import EntryEditModal from './EntryEditModal';
import type { AuditEvent, ToiletAttemptOutcome } from '../types';
import { TOILET_OUTCOME_LABELS } from '../content/presentation';

type FieldRow = {
  label: string;
  value: string | number | boolean | null | undefined;
  wide?: boolean;
};

function buildViewRows(type: string, r: Record<string, unknown>): FieldRow[] {
  const when: FieldRow[] = [
    { label: 'Date', value: (r.date as string) ?? null },
    { label: 'Time', value: (r.time as string) ?? null },
  ];

  const notes: FieldRow = { label: 'Notes', value: (r.notes as string) ?? null, wide: true };

  switch (type) {
    case 'drinks':
      return [
        ...when,
        { label: 'Type', value: (r.type as string) ?? null },
        { label: 'Amount', value: r.amountMl != null ? `${r.amountMl as number} ml` : null },
        notes,
      ];
    case 'urine': {
      const outcomeKey = (r.outcome as ToiletAttemptOutcome) || undefined;
      return [
        ...when,
        { label: 'Outcome', value: outcomeKey ? (TOILET_OUTCOME_LABELS[outcomeKey] ?? outcomeKey) : null },
        notes,
      ];
    }
    case 'bowel':
      return [
        ...when,
        { label: 'Type', value: (r.type as string) ?? null },
        notes,
      ];
    case 'sleep':
      return [
        ...when,
        { label: 'Duration', value: (r.durationMin as number) ? `${r.durationMin as number} min` : null },
        notes,
      ];
    default:
      return [
        ...when,
        { label: 'Data', value: JSON.stringify(r) },
      ];
  }
}

function ViewFields({ type, entry }: { type: string; entry: Record<string, unknown> }) {
  const rows = buildViewRows(type, entry || {});
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {rows.map((row) => (
        <div key={row.label} className={row.wide ? 'col-span-2' : ''}>
          <div className="text-[11px] text-gray-400">{row.label}</div>
          <div className="text-sm text-gray-800">{row.value ?? <span className="text-gray-300">—</span>}</div>
        </div>
      ))}
    </div>
  );
}

export default function EntryDetail({ type, entry }: { type: string; entry: unknown }) {
  const [editMode, setEditMode] = useState(false);
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const e = entry as { id?: unknown };
    if (e?.id && typeof e.id === 'string') {
      api.apiGetAuditEvents(e.id).then(setAudit).catch(() => {});
    }
  }, [entry]);

  const handleSaved = (id: string) => {
    setEditMode(false);
    api.apiGetAuditEvents(id).then(setAudit).catch(() => {});
  };

  return (
    <div className="mt-2 rounded-2xl bg-white border border-gray-100 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {editMode ? 'Edit entry' : 'Details'}
        </span>
        {!editMode && (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1 text-xs text-violet-600 font-semibold hover:text-violet-800 transition-colors"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <EntryEditModal type={type} entry={entry} onSaved={handleSaved} onCancel={() => setEditMode(false)} />
      ) : (
        <ViewFields type={type} entry={(entry as unknown) as Record<string, unknown>} />
      )}

      {audit.length > 0 && (
        <div className="border-t border-gray-100 pt-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">History</div>
          <ul className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {audit.map((ev) => (
              <li key={ev.id} className="border-l-2 border-violet-200 pl-2.5">
                <div className="text-xs font-medium text-gray-700">{ev.action}</div>
                {ev.detail && <div className="text-[11px] text-gray-500">{ev.detail}</div>}
                <div className="text-[10px] text-gray-400 mt-0.5">{new Date(ev.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
