import { useState } from 'react';
import type { Child } from '../../types';

// DueDateEditor — editable date input for due date or date of birth with save confirmation.
export default function DueDateEditor({
  child,
  onSave,
  mode = 'due',
}: {
  child: Child;
  onSave: (date: string, useAsDue: boolean) => void;
  mode?: 'due' | 'dob';
}) {
  const initial = mode === 'dob' ? (child.dateOfBirth ?? child.dueDate ?? '') : child.dueDate ?? '';
  const [date, setDate] = useState(initial);
  const [useAsDue, setUseAsDue] = useState<boolean>(() => !!(mode === 'dob' && child.dueDate && (child.dueDate === initial)));
  const label = mode === 'dob' ? 'DOB (date of birth)' : 'Due date (for leap accuracy)';
  const aria = mode === 'dob' ? "Child's date of birth" : "Child's due date";
  const saveLabel = mode === 'dob' ? 'Save DOB' : 'Save';

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label htmlFor="due-date-input" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          id="due-date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
          aria-label={aria}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={useAsDue}
            onChange={() => setUseAsDue((v) => !v)}
            disabled={!date}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-lavender-600 focus:ring-lavender-200"
            aria-label="Use as due date until born"
            title="Use as due date until born"
          />
          <span className="text-sm text-gray-700">Use as due date</span>
        </label>
        <button
          onClick={() => {
            if (date) onSave(date, useAsDue);
          }}
          disabled={!date}
          className="rounded-lg bg-lavender-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-lavender-700 transition-colors"
          aria-label={saveLabel}
        >
          Save
        </button>
      </div>
    </div>
  );
}
