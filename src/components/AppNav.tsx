import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BarChart3, Users, Settings, Crown, Star, Rainbow } from 'lucide-react';
import { useApp } from '../context/useApp';
import { BRAND } from '../content/presentation';

export default function AppNav() {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Today', mobileLabel: 'Today' },
    { to: '/log', icon: ClipboardList, label: 'Diary', mobileLabel: 'Diary' },
    { to: '/reports', icon: BarChart3, label: 'Reports', mobileLabel: 'Trends' },
    { to: '/milestones', icon: Star, label: 'Milestones', mobileLabel: 'Goals' },
    { to: '/leaps', icon: Rainbow, label: 'Leaps', mobileLabel: 'Leaps' },
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
        className="sticky top-0 z-50 hidden border-b border-lavender-100 bg-white md:block"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-lavender-700">
               {BRAND.name}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
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
                      : 'text-gray-500 hover:text-lavender-600'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile: fixed bottom navigation bar */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-lavender-100/80 bg-white/95 backdrop-blur safe-area-bottom md:hidden"
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
                    : 'text-gray-400 hover:text-lavender-500'
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
