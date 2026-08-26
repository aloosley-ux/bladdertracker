import { Link } from 'react-router-dom';
import SymptomLogger from '../components/leaps/SymptomLogger';
import LeapDiary from '../components/leaps/LeapDiary';
import { useApp } from '../context/useApp';

// LeapEntryPage — leap symptom logger and diary view for the selected child.
export default function LeapEntryPage() {
  const { selectedChild, children } = useApp();
  const child = selectedChild ?? children[0] ?? null;

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">Leap entry</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Add a child profile first to log symptoms or diary notes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-violet-700">Leap entry</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Record Symptoms &amp; Diary notes for {child.name}</p>
        </div>
        <Link to="/leaps" className="text-sm text-violet-600 hover:underline">Back to Leaps</Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SymptomLogger child={child} />
        </div>
        <div>
          <LeapDiary child={child} />
        </div>
      </div>
    </div>
  );
}
