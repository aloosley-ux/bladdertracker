import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrandIcon from '../components/BrandIcon';
import PageShell from '../components/PageShell';
import EntryTabs from '../components/addentry/EntryTabs';
import { useAddEntry } from '../hooks/useAddEntry';
import {
  DrinkForm,
  UrineForm,
  BowelForm,
  SleepForm,
  ToiletAttemptForm,
  FoodForm,
  MoodForm,
  SensoryForm,
  MedicationForm,
  TherapyForm,
  RoutineForm,
} from '../components/forms';

// AddEntryPage — multi-tab entry form page routing to the appropriate tracker form.
export default function AddEntryPage() {
  const { tabs, activeTab, setActiveTab, hasTabs } = useAddEntry();
  const navigate = useNavigate();

  // Edge case: all modules disabled
  if (!hasTabs) {
    return (
      <div className="pb-20">
        <div className="bg-[var(--bg-secondary)] px-4 pt-4 pb-3">
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              aria-label="Back to dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-input)] text-[var(--text-secondary)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-card)]"
            >
              <ArrowLeft size={18} />
            </button>
            <BrandIcon width={110} />
          </div>
        </div>
        <div className="px-4 mt-8 text-center">
          <p className="text-3xl mb-3">🔧</p>
          <p className="text-sm font-semibold text-gray-700">No modules enabled</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Turn on at least one module in Settings to start logging.</p>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full bg-lavender-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lavender-600"
          >
            Open settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageShell
        heroAssetKey="pageAddEntryHero"
        heroContent={(
          <div className="px-4 pt-4 pb-3">
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                aria-label="Back to dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-input)] text-[var(--text-secondary)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-card)]"
              >
                <ArrowLeft size={18} />
              </button>
              <BrandIcon width={110} />
            </div>

            <div className="mb-3 px-1">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Add an update</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Choose the quickest thing you want to log.</p>
            </div>

            <EntryTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}
      >
        <div className="mt-4 px-4">
          {activeTab === 'drink' && <DrinkForm />}
          {activeTab === 'urine' && <UrineForm />}
          {activeTab === 'bowel' && <BowelForm />}
          {activeTab === 'sleep' && <SleepForm />}
          {activeTab === 'toilet' && <ToiletAttemptForm />}
          {activeTab === 'food' && <FoodForm />}
          {activeTab === 'mood' && <MoodForm />}
          {activeTab === 'sensory' && <SensoryForm />}
          {activeTab === 'medication' && <MedicationForm />}
          {activeTab === 'therapy' && <TherapyForm />}
          {activeTab === 'routine' && <RoutineForm />}
        </div>
      </PageShell>
    </div>
  );
}
