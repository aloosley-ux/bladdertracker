import { useEffect, useRef, useState } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { useApp } from '../context/useApp';
import { format, parseISO } from 'date-fns';

const MAX_DISPLAYED_NOTIFICATIONS = 15;

/**
 * NotificationBell — shows unread notification count and a dropdown panel.
 * Handles marking individual notifications as read and clearing all.
 */
export default function NotificationBell() {
  const { notifications, markNotificationRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read);
  const recent = notifications.slice(0, MAX_DISPLAYED_NOTIFICATIONS);

  // Close when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const markAllRead = () => {
    unread.forEach((n) => markNotificationRead(n.id));
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-label={`Notifications${unread.length > 0 ? `, ${unread.length} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center rounded-xl p-2 text-gray-500 transition-colors hover:bg-lavender-50 hover:text-lavender-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lavender-500"
      >
        {unread.length > 0 ? (
          <Bell size={20} strokeWidth={2} className="text-lavender-600" aria-hidden="true" />
        ) : (
          <BellOff size={20} strokeWidth={2} aria-hidden="true" />
        )}
        {unread.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none"
          >
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications panel"
          className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-lavender-100 bg-white shadow-xl"
          style={{ top: '100%' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-lavender-50 px-4 py-3">
            <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
            <div className="flex items-center gap-2">
              {unread.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-lavender-600 hover:bg-lavender-50 transition-colors"
                  aria-label="Mark all notifications as read"
                >
                  <Check size={12} aria-hidden="true" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2.5 text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Close notifications"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <ul
            className="max-h-72 overflow-y-auto divide-y divide-gray-50"
            role="list"
            aria-label="Notification items"
          >
            {recent.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                No notifications yet.
              </li>
            ) : (
              recent.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => { if (!n.read) markNotificationRead(n.id); }}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-lavender-50 ${
                      n.read ? 'opacity-60' : ''
                    }`}
                    aria-label={`${n.title}: ${n.message}${n.read ? ' (read)' : ' (unread)'}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-lavender-500"
                        />
                      )}
                      <div className={!n.read ? '' : 'ml-4'}>
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.message}</p>
                        <p className="text-[10px] text-gray-300 mt-1">
                          {format(parseISO(n.createdAt), 'd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          {notifications.length > MAX_DISPLAYED_NOTIFICATIONS && (
            <div className="border-t border-gray-50 px-4 py-2 text-center text-xs text-gray-400">
              Showing 15 most recent
            </div>
          )}
        </div>
      )}
    </div>
  );
}
