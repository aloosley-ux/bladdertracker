import { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import { updateChild } from '../utils/storage';
import type { Child } from '../types';
import {
  DueDateEditor,
  AgeCalculator,
  LeapTimeline,
  SymptomLogger,
  LeapDiary,
  LeapNotifications,
  LeapCalendarWidget,
  LeapProgressChart,
} from '../components/leaps';

// ── Page Component ───────────────────────────────────────────────────

export default function LeapsPage() {
  const { selectedChild, children } = useApp();
  const [dueDateChild, setDueDateChild] = useState<Child | null>(null);

  // Use the selected child, or the first child available
  const child = selectedChild ?? children[0] ?? null;

  // Sync dueDateChild whenever child changes
  useEffect(() => {
    setDueDateChild(child);
  }, [child]);

  const handleSaveDueDate = (dueDate: string) => {
    if (!child) return;
    const updatedChild = { ...child, dueDate, lastUpdatedAt: new Date().toISOString() };
    updateChild(updatedChild);
    setDueDateChild(updatedChild);
  };

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">🌈</span>
        <h1 className="text-xl font-bold text-gray-700 mb-2">Developmental Leaps</h1>
        <p className="text-sm text-gray-500">Add a child profile first to use the leap tracker.</p>
      </div>
    );
  }

  // Use patched child with dueDate if available
  const effectiveChild = dueDateChild ?? child;

  return (
    <div className="space-y-5 pb-4">
      <header className="px-1">
        <h1 className="text-xl font-bold text-lavender-700">🌈 Developmental Leaps</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track <strong>{effectiveChild.name}&apos;s</strong> developmental leaps, age, and symptoms
        </p>
      </header>

      {/* Due-date editor (if not set) */}
      {!effectiveChild.dueDate && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-700 mb-3">
            💡 For more accurate leap predictions, set {effectiveChild.name}&apos;s due date.
          </p>
          <DueDateEditor child={effectiveChild} onSave={handleSaveDueDate} />
        </div>
      )}

      <AgeCalculator child={effectiveChild} />
      <LeapProgressChart child={effectiveChild} />
      <LeapTimeline child={effectiveChild} />
      <SymptomLogger child={effectiveChild} />
      <LeapDiary child={effectiveChild} />
      <LeapNotifications key={effectiveChild.id} child={effectiveChild} />
      <LeapCalendarWidget child={effectiveChild} />
    </div>
  );
}
