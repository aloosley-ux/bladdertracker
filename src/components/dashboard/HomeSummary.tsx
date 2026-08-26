import { getModuleLabel } from '../../content/presentation';
import SummaryCard from './SummaryCard';

interface HomeSummaryProps {
  on: (id: string) => boolean;
  totalMl: number;
  wetCount: number;
  passCount: number;
  urineSub: string;
  bowelCount: number;
  sleepCount: number;
  toiletCount: number;
  foodCount: number;
  moodCount: number;
  sensoryCount: number;
  medicationCount: number;
  therapyCount: number;
  routineCount: number;
  milestoneAchieved: number;
  totalMilestones: number;
  dayDrinksCount: number;
}

export default function HomeSummary(props: HomeSummaryProps) {
  const { on, totalMl, wetCount, passCount, urineSub, bowelCount, sleepCount, toiletCount, foodCount, moodCount, sensoryCount, medicationCount, therapyCount, routineCount, milestoneAchieved, totalMilestones, dayDrinksCount } = props;

  return (
    <section aria-label="Home summary">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--foreground)]">Home snapshot</h2>
        <p className="text-xs text-[var(--muted-foreground)]">At-a-glance totals</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {on('drinks') && (
          <SummaryCard
            icon={<span className="text-2xl">🥤</span>}
            label={getModuleLabel('drinks', 'summary')}
            value={`${totalMl}ml`}
            sub={`${dayDrinksCount} entries`}
            accent="#0ea5e9"
            addTo="/add"
            addTab="drink"
          />
        )}
        {on('urine') && (
          <SummaryCard
            icon={<span className="text-2xl">💦</span>}
            label={getModuleLabel('urine', 'summary')}
            value={`${wetCount + passCount}`}
            sub={urineSub}
            accent="#f59e0b"
            addTo="/add"
            addTab="urine"
          />
        )}
        {on('bowel') && (
          <SummaryCard
            icon={<span className="text-2xl">🚽</span>}
            label={getModuleLabel('bowel', 'summary')}
            value={`${bowelCount}`}
            sub="entries"
            accent="#22c55e"
            addTo="/add"
            addTab="bowel"
          />
        )}
        {on('sleep') && (
          <SummaryCard
            icon={<span className="text-2xl">🌙</span>}
            label="Sleep"
            value={`${sleepCount}`}
            sub="events"
            accent="#6366f1"
            addTo="/add"
            addTab="sleep"
          />
        )}
        {on('toilet') && (
          <SummaryCard
            icon={<span className="text-2xl">🎯</span>}
            label={getModuleLabel('toilet', 'summary')}
            value={`${toiletCount}`}
            sub="logged"
            accent="#a855f7"
            addTo="/add"
            addTab="toilet"
          />
        )}
        {on('food') && (
          <SummaryCard
            icon={<span className="text-2xl">🍽️</span>}
            label={getModuleLabel('food', 'summary')}
            value={`${foodCount}`}
            sub="logged"
            accent="#f97316"
            addTo="/add"
            addTab="food"
          />
        )}
        {on('mood') && (
          <SummaryCard
            icon={<span className="text-2xl">😊</span>}
            label="Mood"
            value={`${moodCount}`}
            sub="entries"
            accent="#ec4899"
            addTo="/add"
            addTab="mood"
          />
        )}
        {on('sensory') && (
          <SummaryCard
            icon={<span className="text-2xl">🎨</span>}
            label="Sensory"
            value={`${sensoryCount}`}
            sub="events"
            accent="#14b8a6"
            addTo="/add"
            addTab="sensory"
          />
        )}
        {on('medication') && (
          <SummaryCard
            icon={<span className="text-2xl">💊</span>}
            label="Meds"
            value={`${medicationCount}`}
            sub="doses"
            accent="#ef4444"
            addTo="/add"
            addTab="medication"
          />
        )}
        {on('therapy') && (
          <SummaryCard
            icon={<span className="text-2xl">🧩</span>}
            label="Therapy"
            value={`${therapyCount}`}
            sub="sessions"
            accent="#06b6d4"
            addTo="/add"
            addTab="therapy"
          />
        )}
        {on('routine') && (
          <SummaryCard
            icon={<span className="text-2xl">📋</span>}
            label="Routine"
            value={`${routineCount}`}
            sub="entries"
            accent="#84cc16"
            addTo="/add"
            addTab="routine"
          />
        )}
        {on('milestones') && (
          <SummaryCard
            icon={<span className="text-2xl">⭐</span>}
            label="Milestones"
            value={`${milestoneAchieved}`}
            sub={`of ${totalMilestones}`}
            accent="#eab308"
            addTo="/milestones#top"
            addTab={undefined}
          />
        )}
      </div>
    </section>
  );
}
