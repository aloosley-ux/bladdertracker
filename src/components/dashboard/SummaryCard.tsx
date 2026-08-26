import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
  addTo?: string;
  addTab?: string | undefined;
}

export default function SummaryCard({ icon, label, value, sub, accent, addTo, addTab }: SummaryCardProps) {
  const CardWrapper = (addTo ? Link : 'div') as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    <CardWrapper
      to={addTo}
      state={addTab ? { tab: addTab } : undefined}
      aria-label={addTo ? `Add ${label} entry` : undefined}
      className="rounded-2xl bg-[var(--card)] pt-6 pb-3 px-3 pr-12 shadow-sm ring-1 ring-[var(--border)] overflow-hidden relative block min-h-[72px]"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <span
        className="absolute right-5 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold leading-none text-white shadow-sm"
        style={{ background: accent }}
        aria-hidden="true"
      >
        +
      </span>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-full p-2 bg-[var(--secondary)] flex items-center justify-center">{icon}</div>
          <div className="text-sm font-semibold text-[var(--muted-foreground)]">{label}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-base font-bold text-[var(--foreground)] leading-tight">{value}</div>
          <div className="text-[10px] text-[var(--muted-foreground)]">{sub}</div>
        </div>
      </div>
    </CardWrapper>
  );
}
