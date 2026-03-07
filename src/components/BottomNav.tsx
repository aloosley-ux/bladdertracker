import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Calendar, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/add', icon: PlusCircle, label: 'Add Entry' },
  { to: '/charts', icon: BarChart3, label: 'Charts' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-lavender-100 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-lavender-600 font-semibold'
                  : 'text-gray-400 hover:text-lavender-400'
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
