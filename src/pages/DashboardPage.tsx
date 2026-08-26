import { Link } from 'react-router-dom';
import CelebrationBanner from '../components/CelebrationBanner';
import PageShell from '../components/PageShell';
import TodayCombined from '../components/TodayCombined';
import RemindersSection from '../components/dashboard/RemindersSection';
import HomeSummary from '../components/dashboard/HomeSummary';
import HomeEntries from '../components/dashboard/HomeEntries';
import { useDashboard } from '../hooks/useDashboard';

export default function DashboardPage() {
  const {
    selectedChild,
    selectedChildId,
    children,
    selectChild,
    enabled,
    on,
    todayLabel,
    dueReminders,
    totalMl,
    wetCount,
    passCount,
    urineSub,
    bowelCount,
    sleepCount,
    toiletCount,
    foodCount,
    moodCount,
    sensoryCount,
    medicationCount,
    therapyCount,
    routineCount,
    milestoneAchieved,
    childMilestones,
    celebration,
    snoozeReminders,
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
  } = useDashboard();

  if (!selectedChild) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl font-bold text-gray-900">No family profile yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Add a child profile or accept a shared invite to start tracking.
              </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link className="rounded-full bg-violet-500 px-4 py-3 text-sm font-semibold text-white" to="/settings">
                Open settings
              </Link>
              <Link className="rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700" to="/profiles">
                View profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-[var(--background)] min-h-screen">
      <PageShell
        heroAssetKey="pageDashboardHero"
        heroContent={
          <div className="pb-4">
            <div className="flex flex-col gap-1 px-4 pt-6">
              <h1 className="text-xl font-bold leading-snug text-[var(--foreground)]" aria-label="Dashboard heading">
                Home
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">Quickly capture and review drinks, sleeps, visits and meals for {selectedChild.name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{todayLabel}</p>
            </div>

            {children.length > 1 && (
              <select
                aria-label="Select child"
                value={selectedChildId ?? ''}
                onChange={(event) => selectChild(event.target.value)}
                className="mx-4 mt-3 mb-2 w-[calc(100%-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--input)] px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        }
      >
      <div className="space-y-4 px-4 pt-4">
        {dueReminders.length > 0 && selectedChildId && (
          <RemindersSection
            dueReminders={dueReminders}
            childName={selectedChild.name}
            snoozeReminders={snoozeReminders}
          />
        )}

        <CelebrationBanner
          emoji={celebration.emoji}
          title={celebration.title}
          message={celebration.message}
          tone={celebration.tone}
          dismissible
          action={
            <Link to="/add" className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
              Add a quick update
            </Link>
          }
        />

        <TodayCombined
          summary={
            <HomeSummary
              on={on}
              totalMl={totalMl}
              wetCount={wetCount}
              passCount={passCount}
              urineSub={urineSub}
              bowelCount={bowelCount}
              sleepCount={sleepCount}
              toiletCount={toiletCount}
              foodCount={foodCount}
              moodCount={moodCount}
              sensoryCount={sensoryCount}
              medicationCount={medicationCount}
              therapyCount={therapyCount}
              routineCount={routineCount}
              milestoneAchieved={milestoneAchieved}
              totalMilestones={childMilestones.length}
              dayDrinksCount={dayDrinks.length}
            />
          }
          quickAdd={null}
        />

        <HomeEntries
          enabled={enabled}
          dayDrinks={dayDrinks}
          dayUrine={dayUrine}
          dayBowel={dayBowel}
          daySleep={daySleep}
          dayToilet={dayToilet}
          dayFood={dayFood}
          dayMood={dayMood}
          daySensory={daySensory}
          dayMedication={dayMedication}
          dayTherapy={dayTherapy}
          dayRoutine={dayRoutine}
          deleteDrink={deleteDrink}
          deleteUrineEntry={deleteUrineEntry}
          deleteBowelEntry={deleteBowelEntry}
          deleteSleepEntry={deleteSleepEntry}
          deleteToiletAttemptEntry={deleteToiletAttemptEntry}
          deleteFoodEntry={deleteFoodEntry}
          deleteMoodEntry={deleteMoodEntry}
          deleteSensoryEntry={deleteSensoryEntry}
          deleteMedicationEntry={deleteMedicationEntry}
          deleteTherapyEntry={deleteTherapyEntry}
          deleteRoutineEntry={deleteRoutineEntry}
        />
      </div>
      </PageShell>
    </div>
  );
}
