import { useRef, useState } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { useApp } from '../context/useApp';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

const MAX_DISPLAYED_NOTIFICATIONS = 15;

/**
 * NotificationBell — shows unread notification count and a dialog panel.
 * Handles marking individual notifications as read and clearing all.
 */
export default function NotificationBell() {
  const { notifications, markNotificationRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read);
  const recent = notifications.slice(0, MAX_DISPLAYED_NOTIFICATIONS);

  const markAllRead = () => {
    unread.forEach((n) => markNotificationRead(n.id));
  };

  return (
    <div ref={ref}>
      <button
        aria-label={`Notifications${unread.length > 0 ? `, ${unread.length} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center rounded-xl p-2 text-gray-500 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        {unread.length > 0 ? (
          <Bell size={20} strokeWidth={2} className="text-violet-600" aria-hidden="true" />
        ) : (
          <BellOff size={20} strokeWidth={2} aria-hidden="true" />
        )}
        {unread.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white leading-none"
          >
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) setOpen(false); }}>
        <DialogContent className="max-w-sm rounded-2xl border border-violet-100 shadow-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-bold text-gray-800">Notifications</DialogTitle>
              <div className="flex items-center gap-2">
                {unread.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllRead}
                    className="h-auto p-1 text-xs text-violet-600 hover:bg-violet-50"
                  >
                    <Check size={12} /> Mark all read
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <ul
            className="max-h-72 divide-y divide-gray-50 overflow-y-auto"
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
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-violet-50 ${
                      n.read ? 'opacity-60' : ''
                    }`}
                    aria-label={`${n.title}: ${n.message}${n.read ? ' (read)' : ' (unread)'}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500"
                        />
                      )}
                      <div className={!n.read ? '' : 'ml-4'}>
                        <p className="text-xs font-semibold leading-tight text-gray-800">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-snug text-gray-500">{n.message}</p>
                        <p className="mt-1 text-[10px] text-gray-300">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
