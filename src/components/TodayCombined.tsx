import type { ReactNode } from 'react';

// TodayCombined — responsive layout wrapper for today summary and quick-add card.
export default function TodayCombined({
  summary,
  quickAdd,
}: {
  summary: ReactNode;
  quickAdd?: ReactNode | null;
}) {
  return (
    <section aria-label="Home summary and quick-add" className="rounded-2xl bg-[var(--card)] p-4 shadow-sm ring-1 ring-[var(--border)]">
      <div className={`grid gap-4 ${quickAdd ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        <div>{summary}</div>
        {quickAdd && <div>{quickAdd}</div>}
      </div>
    </section>
  );
}
