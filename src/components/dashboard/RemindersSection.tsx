import { Link } from 'react-router-dom';

interface RemindersSectionProps {
  dueReminders: { id?: string }[];
  childName: string;
  snoozeReminders: () => void;
}

export default function RemindersSection({ dueReminders, childName, snoozeReminders }: RemindersSectionProps) {
  return (
    <section aria-label="Reminders" className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
      <h2 className="text-sm font-bold text-violet-900">Reminders</h2>
      <p className="mt-1 text-xs text-violet-700">
        {dueReminders.length} reminder{dueReminders.length > 1 ? 's are' : ' is'} active for {childName}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/settings" className="rounded-full bg-violet-700 px-4 py-2 text-xs font-semibold text-white">
          Review reminders
        </Link>
        <button
          type="button"
          onClick={snoozeReminders}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-800"
        >
          Snooze 1 hour
        </button>
      </div>
    </section>
  );
}
