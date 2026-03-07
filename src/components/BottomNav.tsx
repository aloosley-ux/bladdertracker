import { NavLink } from 'react-router-dom';
import { Compass, Crown, Home, Settings, UsersRound } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function BottomNav() {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { to: '/', icon: Home, label: 'Journal' },
    { to: '/charts', icon: Compass, label: 'Explore' },
    { to: '/caregiver', icon: UsersRound, label: 'Caregiver' },
    { to: '/profile', icon: Settings, label: 'Settings' },
    ...(isAdmin ? [{ to: '/admin', icon: Crown, label: 'Admin' }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-lavender-100/80 bg-white/95 backdrop-blur safe-area-bottom">
      <div className="mx-auto flex h-17 max-w-lg items-center justify-around px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition-all ${
                isActive
                  ? 'bg-lavender-50 text-lavender-700 font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-lavender-500'
              }`
            }
          >
            <Icon size={20} strokeWidth={2.1} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
