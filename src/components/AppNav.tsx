import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BarChart3, Users, Settings, Crown, Star, Rainbow } from 'lucide-react';
import { useApp } from '../context/useApp';
import { DEFAULT_MODULES } from '../types';
import { BRAND } from '../content/presentation';
import NotificationBell from './NotificationBell';

/** Fallback used before enabledModules is populated. */
const DEFAULT_ENABLED = new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id));

export default function AppNav() {
  const { user, enabledModules } = useApp();
  const isAdmin = user?.role === 'admin';

  const enabled = useMemo(
    () => (enabledModules.length > 0 ? new Set(enabledModules) : DEFAULT_ENABLED),
    [enabledModules],
  );

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Today', mobileLabel: 'Today' },
    { to: '/log', icon: ClipboardList, label: 'Diary', mobileLabel: 'Diary' },
    { to: '/reports', icon: BarChart3, label: 'Reports', mobileLabel: 'Trends' },
    ...(enabled.has('milestones') ? [{ to: '/milestones', icon: Star, label: 'Milestones', mobileLabel: 'Goals' }] : []),
    ...(enabled.has('leaps') ? [{ to: '/leaps', icon: Rainbow, label: 'Leaps', mobileLabel: 'Leaps' }] : []),
    { to: '/profiles', icon: Users, label: 'Profiles', mobileLabel: 'Family' },
    { to: '/settings', icon: Settings, label: 'Settings', mobileLabel: 'Settings' },
    ...(isAdmin ? [{ to: '/admin', icon: Crown, label: 'Admin', mobileLabel: 'Admin' }] : []),
  ];

  return (
    <>
      {/* Desktop: sticky top navigation bar */}
      <nav
        role="navigation"
        aria-label="Primary navigation"
        className="sticky top-0 z-50 hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] md:block"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-lavender-700">
               {BRAND.name}
              </span>
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">
               {BRAND.tagline}
              </span>
            </div>
          <div className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                end={to === '/'}
                key={to}
                to={to}
                aria-label={label}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-lavender-700 underline underline-offset-4 decoration-2 decoration-lavender-500'
                      : 'text-[var(--text-secondary)] hover:text-lavender-600'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
            <NotificationBell />
          </div>
        </div>
      </nav>

      {/* Mobile: sticky top bar with brand + notification bell */}
      <header
        aria-label="App header"
        className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 md:hidden"
      >
        <span className="text-base font-bold tracking-tight text-lavender-700">{BRAND.name}</span>
        <NotificationBell />
      </header>

      {/* Mobile: fixed bottom navigation bar */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur safe-area-bottom md:hidden"
      >
        <div className="mx-auto flex h-17 max-w-2xl items-center justify-around px-2">
          {navItems.map(({ to, icon: Icon, label, mobileLabel }) => (
            <NavLink
              end={to === '/'}
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                `flex min-w-12 flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[10px] transition-all ${
                  isActive
                    ? 'bg-lavender-50 text-lavender-700 font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-lavender-500'
                }`
              }
            >
              <Icon size={20} strokeWidth={2.1} />
              <span>{mobileLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
