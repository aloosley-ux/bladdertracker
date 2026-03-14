import type { ReactNode } from 'react';

export default function TodayCombined({
  summary,
  quickAdd,
}: {
  summary: ReactNode;
  quickAdd: ReactNode;
}) {
  return (
    <section aria-label="Today summary and quick-add" className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {summary}
        </div>
        <div>
          {quickAdd}
        </div>
      </div>
    </section>
  );
}
