import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import CalendarStrip from '../components/CalendarStrip';
import ModuleFilter from '../components/log/ModuleFilter';
import { useLogPage } from '../hooks/useLogPage';
import { useLogEntryList } from '../hooks/useLogEntryList';

export default function LogPage() {
  const {
    selectedChild,
    selectedChildId,
    children,
    selectChild,
    enabledKeys,
    selectedDate,
    setSelectedDate,
    activeFilters,
    dateLabel,
    toggleFilter,
    dayDrinks,
    dayUrine,
    dayBowel,
    daySleep,
    dayToilet,
    dayFood,
    dayMood,
    daySensory,
    dayMedication,
    dayTherapy,
    dayRoutine,
    deleteDrink,
    deleteUrineEntry,
    deleteBowelEntry,
    deleteSleepEntry,
    deleteToiletAttemptEntry,
    deleteFoodEntry,
    deleteMoodEntry,
    deleteSensoryEntry,
    deleteMedicationEntry,
    deleteTherapyEntry,
    deleteRoutineEntry,
    navigate,
  } = useLogPage();

  const entries = useLogEntryList({
    activeFilters,
    dayDrinks,
    dayUrine,
    dayBowel,
    daySleep,
    dayToilet,
    dayFood,
    dayMood,
    daySensory,
    dayMedication,
    dayTherapy,
    dayRoutine,
    deleteDrink,
    deleteUrineEntry,
    deleteBowelEntry,
    deleteSleepEntry,
    deleteToiletAttemptEntry,
    deleteFoodEntry,
    deleteMoodEntry,
    deleteSensoryEntry,
    deleteMedicationEntry,
    deleteTherapyEntry,
    deleteRoutineEntry,
  });

  // --- no child selected ---
  if (!selectedChild) {
    return (
      <div className="pb-20">
        <div className="px-4 pt-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <EmptyState
              icon="👶"
              title="No family profile yet"
              description="Add a child profile or accept a shared invite to start logging."
              actionLabel="Open settings"
              onAction={() => navigate('/settings')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Diary</h1>
        <p className="mt-0.5 text-sm text-gray-500">Review daily updates and tidy up anything you need to change.</p>
      </div>

      {/* Child selector */}
      {children.length > 1 && (
        <div className="px-4 pb-2">
          <select
            value={selectedChildId ?? ''}
            onChange={(e) => selectChild(e.target.value)}
            className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none ring-1 ring-black/5"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Calendar strip */}
      <div className="rounded-2xl bg-white mx-4 shadow-sm ring-1 ring-black/5">
        <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* Module filters */}
      <ModuleFilter
        enabledKeys={enabledKeys}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />

      {/* Entry heading */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <h2 className="text-sm font-bold text-gray-700">
          {dateLabel} updates for {selectedChild.name}
        </h2>
        <span className="text-xs text-gray-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Entry list */}
      <div className="space-y-3 px-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <EmptyState
              icon="📭"
              title="No updates found"
              description={activeFilters.size === 0
                ? 'Turn on some filters above to see updates.'
                : 'Nothing has been recorded for this date and filter combination.'}
              actionLabel="Add an update"
              onAction={() => navigate('/add')}
            />
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.key} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              {e.node}
            </div>
          ))
        )}
      </div>

      {/* Floating add entry button */}
      <div className="fixed bottom-24 right-4 z-30">
        <Link
          to="/add"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600 active:scale-95"
          aria-label="Add new entry"
        >
          <span className="text-2xl leading-none">+</span>
        </Link>
      </div>
    </div>
  );
}
