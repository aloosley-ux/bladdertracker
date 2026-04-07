import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, History, ChevronDown, Filter } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useApp } from '../context/useApp';

type AuditFilter = 'all' | 'account' | 'data' | 'settings';

// AuditTrailPage — audit log viewer with category filtering and expandable event details.
export default function AuditTrailPage() {
  const { auditTrail } = useApp();
  const [filter, setFilter] = useState<AuditFilter>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categorize = (action: string): AuditFilter => {
    const lower = action.toLowerCase();
    if (lower.includes('login') || lower.includes('logout') || lower.includes('admin') || lower.includes('account') || lower.includes('promoted')) return 'account';
    if (lower.includes('export') || lower.includes('import') || lower.includes('delete') || lower.includes('clear')) return 'data';
    if (lower.includes('setting') || lower.includes('module') || lower.includes('toggle') || lower.includes('theme') || lower.includes('reminder')) return 'settings';
    return 'all';
  };

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return auditTrail;
    return auditTrail.filter((event) => categorize(event.action) === filter);
  }, [auditTrail, filter]);

  const filterOptions: { value: AuditFilter; label: string }[] = [
    { value: 'all', label: 'All events' },
    { value: 'account', label: 'Account' },
    { value: 'data', label: 'Data' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3">
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/settings"
            aria-label="Back to settings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-lavender-50"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Audit Trail</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Complete history of account actions and changes
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Filters */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-4 shadow-sm ring-1 ring-[var(--border-color)]">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-lavender-500" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === opt.value
                    ? 'bg-lavender-500 text-white shadow-sm'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] ring-1 ring-[var(--border-color)] hover:bg-lavender-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-4 shadow-sm ring-1 ring-[var(--border-color)]">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <History size={16} className="text-lavender-500" />
            {filter === 'all' ? 'All events' : `${filterOptions.find((o) => o.value === filter)?.label ?? ''} events`}
            <span className="ml-auto text-xs font-normal text-[var(--text-secondary)]">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </h2>

          {filteredEvents.length === 0 ? (
            <div className="rounded-xl bg-[var(--bg-primary)] py-8 text-center">
              <span className="text-3xl">📋</span>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {filter === 'all' ? 'No audit events recorded yet.' : 'No events match this filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEvents.map((event) => {
                const isExpanded = expanded.has(event.id);
                return (
                  <button
                    key={event.id}
                    onClick={() => toggleExpanded(event.id)}
                    className="w-full rounded-xl bg-[var(--bg-primary)] px-4 py-3 text-left ring-1 ring-[var(--border-color)] transition hover:ring-lavender-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {event.action}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--text-secondary)]">
                          {event.subject}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 border-t border-[var(--border-color)] pt-2 space-y-1">
                        <div className="text-xs text-[var(--text-secondary)]">
                          <strong>Detail:</strong> {event.detail || 'No additional detail.'}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">
                          <strong>Timestamp:</strong> {format(new Date(event.createdAt), 'PPpp')}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">
                          <strong>Event ID:</strong> {event.id}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
