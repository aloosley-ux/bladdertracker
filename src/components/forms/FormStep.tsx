// FormStep — step counter badge and title wrapper used by all tracker entry forms.
export function FormStep({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white"
        >
          {step}
        </span>
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">{title}</span>
      </div>
      <div className="pl-7 space-y-2">{children}</div>
    </div>
  );
}
