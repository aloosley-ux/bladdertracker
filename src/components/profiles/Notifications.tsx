import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NotificationItem } from '../../types';

interface NotificationsProps {
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
}

export default function Notifications(props: NotificationsProps) {
  const { notifications, markNotificationRead } = props;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
          <Bell size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="mt-1 text-xs text-gray-400">Recent activity and updates.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.slice(0, 6).map((notification) => (
          <button
            key={notification.id}
            onClick={() => markNotificationRead(notification.id)}
            className={`w-full rounded-2xl px-4 py-3 text-left ring-1 transition-all ${
              notification.read ? 'bg-white ring-gray-100' : 'bg-lavender-50 ring-lavender-100'
            }`}
          >
            <div className="text-sm font-semibold text-gray-900">{notification.title}</div>
            <div className="mt-1 text-xs text-gray-500">{notification.message}</div>
            <div className="mt-2 text-[11px] text-gray-400">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </div>
          </button>
        ))}
        {notifications.length === 0 && <p className="text-sm text-gray-500">No notifications yet.</p>}
      </div>
    </section>
  );
}
