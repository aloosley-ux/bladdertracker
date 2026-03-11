import { useState } from 'react';
import type { Child } from '../../types';

export default function DueDateEditor({ child, onSave }: { child: Child; onSave: (dueDate: string) => void }) {
  const [dueDate, setDueDate] = useState(child.dueDate ?? '');
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label htmlFor="due-date-input" className="block text-sm font-medium text-gray-700 mb-1">
          Due date (for leap accuracy)
        </label>
        <input
          id="due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
          aria-label="Child's due date"
        />
      </div>
      <button
        onClick={() => { if (dueDate) onSave(dueDate); }}
        disabled={!dueDate}
        className="rounded-lg bg-lavender-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-lavender-700 transition-colors"
        aria-label="Save due date"
      >
        Save
      </button>
    </div>
  );
}
