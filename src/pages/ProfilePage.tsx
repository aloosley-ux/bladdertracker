import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Baby, Download, LogOut, Shield, Trash2 } from 'lucide-react';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import type { Child } from '../types';

export default function ProfilePage() {
  const { user, children, selectedChild, selectChild, addChild, exportData, auditTrail, logout, clearAllData } = useApp();
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');

  const userInitials = useMemo(
    () =>
      user?.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ?? 'BT',
    [user?.name]
  );

  const handleAddChild = (event: React.FormEvent) => {
    event.preventDefault();
    if (!childName.trim() || !user) return;

    const child: Child = {
      id: generateId(),
      name: childName.trim(),
      dateOfBirth: childDob,
      caregivers: user.role === 'parent' ? [] : [user.id],
      parentIds: user.role === 'parent' ? [user.id] : [],
      createdBy: user.id,
      lastUpdatedAt: new Date().toISOString(),
    };

    addChild(child);
    setChildName('');
    setChildDob('');
    setShowAddChild(false);
  };

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] px-4 pb-4 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender-500">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Security, profiles, and audit</h1>
        <p className="mt-2 text-sm text-gray-500">Designed for a calmer, production-style experience with clearer ownership and data handling.</p>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-lavender-50 text-lg font-bold text-lavender-700">
              {userInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm capitalize text-gray-500">{user?.role === 'schoolAdmin' ? 'School admin' : user?.role}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Baby size={16} className="text-lavender-500" /> Child profiles
            </h3>
            <button onClick={() => setShowAddChild((value) => !value)} className="text-xs font-semibold text-lavender-600">
              + Add child
            </button>
          </div>

          <div className="space-y-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => selectChild(child.id)}
                className={`w-full rounded-[1.5rem] p-4 text-left ring-1 transition-all ${
                  selectedChild?.id === child.id ? 'bg-lavender-50 ring-lavender-200' : 'bg-[#faf7ff] ring-lavender-100'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">{child.name}</div>
                <div className="mt-1 text-xs text-gray-500">{child.dateOfBirth || 'DOB not recorded'}</div>
              </button>
            ))}
          </div>

          {showAddChild && (
            <form onSubmit={handleAddChild} className="mt-4 space-y-3 rounded-[1.5rem] bg-[#faf7ff] p-4 ring-1 ring-lavender-100">
              <input
                type="text"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                placeholder="Child's name"
                className="input-card"
                required
              />
              <input
                type="date"
                value={childDob}
                onChange={(event) => setChildDob(event.target.value)}
                className="input-card"
              />
              <button className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white">Save child profile</button>
            </form>
          )}
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Shield size={16} className="text-lavender-500" /> Privacy & security
          </h3>
          <div className="mt-3 rounded-[1.5rem] bg-[#faf7ff] p-4 text-sm text-gray-600 ring-1 ring-lavender-100">
            Passwords are securely hashed before storage, invites are role-scoped, and audit activity is tracked. When connected to cloud storage, your data syncs across devices with NHS/school-grade privacy.
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700">Recent audit trail</h3>
          <div className="mt-3 space-y-3">
            {auditTrail.slice(0, 5).map((event) => (
              <div key={event.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                <div className="text-sm font-semibold text-gray-900">{event.action}</div>
                <div className="mt-1 text-xs text-gray-500">{event.detail}</div>
                <div className="mt-2 text-[11px] text-gray-400">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
            {auditTrail.length === 0 && <p className="text-sm text-gray-500">No audit events yet.</p>}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-2">
          <button onClick={exportData} className="flex w-full items-center gap-3 rounded-[1.5rem] bg-[#faf7ff] p-4 text-left ring-1 ring-lavender-100">
            <Download size={18} className="text-lavender-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Export diary</div>
              <div className="text-xs text-gray-500">Download the current child&apos;s journal as CSV.</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('Clear all saved app data? This cannot be undone.')) {
                clearAllData();
              }
            }}
            className="flex w-full items-center gap-3 rounded-[1.5rem] bg-[#fff4f5] p-4 text-left ring-1 ring-rose-100"
          >
            <Trash2 size={18} className="text-rose-500" />
            <div>
              <div className="text-sm font-semibold text-rose-600">Clear all data</div>
              <div className="text-xs text-gray-500">Remove all saved app data from this browser.</div>
            </div>
          </button>

          <button onClick={logout} className="flex w-full items-center gap-3 rounded-[1.5rem] bg-[#faf7ff] p-4 text-left ring-1 ring-lavender-100">
            <LogOut size={18} className="text-rose-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Sign out</div>
              <div className="text-xs text-gray-500">End your current session.</div>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}
