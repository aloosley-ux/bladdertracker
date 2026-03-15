import { useState } from 'react';
import type { ReactNode } from 'react';
  return (
    <article
      data-testid={`entry-${entry.id}`}
      className={clsx(
        "relative flex items-start gap-3 rounded-lg p-3",
        moduleBg && `bg-[${moduleBg}]`,
        className
      )}
    >
      <div className="flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{title}</div>
          <div className="text-xs text-[var(--text-muted)] flex-shrink-0 ml-2">{time}</div>
        </div>
        {subtitle && <div className="mt-1 text-sm text-[var(--text-muted)] truncate">{subtitle}</div>}
        {children && <div className="mt-2 text-sm text-[var(--text-primary)] truncate">{children}</div>}
      </div>
    </article>
  );
    <div data-entry-type={entryType ?? ''} className={`${color} rounded-2xl p-3 flex items-start gap-3 relative group`}>
      <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <button onClick={toggle} className="text-left flex-1" aria-expanded={expanded}>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">{title}</h4>
            {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{subtitle}</p>}
          </button>
          <div className="ml-3 flex-shrink-0">
            <span className="text-xs text-[var(--text-secondary)]">{time}</span>
          </div>
        </div>
        {expanded && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-400 transition-all text-xs"
          aria-label="Delete entry"
        >
          ✕
        </button>
      )}
      {/* If entryData is provided but no children, show a small JSON summary when expanded */}
      {expanded && !children && entryData !== undefined && entryData !== null && (
        <pre className="text-xs text-[var(--text-secondary)] mt-2 whitespace-pre-wrap">{JSON.stringify(entryData, null, 2)}</pre>
      )}
    </div>
  );
}
