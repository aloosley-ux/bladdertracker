import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Baby, Crown, Download, LogOut, Palette, Save, Settings, Shield, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useTheme } from '../context/useTheme';
import { generateId } from '../utils/storage';
import BrandBanner from '../components/BrandBanner';
import type { Child, ModuleId } from '../types';
import { DEFAULT_MODULES } from '../types';

export default function ProfilePage() {
  const { user, children, selectedChild, selectChild, addChild, removeChild, exportData, auditTrail, logout, clearAllData, enabledModules, setEnabledModules } = useApp();
  const { theme, setTheme } = useTheme();
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');

  // Child removal state
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [removeConfirmText, setRemoveConfirmText] = useState('');

  // Clear data confirmation state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const canManageChildren = isAdmin || isParent;

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
      caregivers: user.role === 'parent' || user.role === 'admin' ? [] : [user.id],
      parentIds: user.role === 'parent' || user.role === 'admin' ? [user.id] : [],
      createdBy: user.id,
      lastUpdatedAt: new Date().toISOString(),
    };

    addChild(child);
    setChildName('');
    setChildDob('');
    setShowAddChild(false);
  };

  const handleRemoveChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child || removeConfirmText !== child.name) return;
    removeChild(childId);
    setRemoveTargetId(null);
    setRemoveConfirmText('');
  };

  const handleClearAllData = () => {
    if (clearConfirmText !== 'DELETE') return;
    clearAllData();
    setShowClearConfirm(false);
    setClearConfirmText('');
  };

  const formatRole = (role: string) => {
    if (role === 'schoolAdmin') return 'School admin';
    if (role === 'admin') return 'Administrator';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4">
        <BrandBanner />
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="mt-1 text-base font-bold text-gray-900">Security, profiles, and audit</h1>
          <p className="mt-0.5 text-xs text-gray-500">Designed for a calmer, production-style experience with clearer ownership and data handling.</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* User profile card */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-lavender-50 text-lg font-bold text-lavender-700">
              {userInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                {isAdmin && <Crown size={12} className="text-amber-500" />}
                {formatRole(user?.role ?? '')}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Theme switcher */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Palette size={16} className="text-lavender-500" /> Appearance
          </h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'high-contrast'] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  theme === t ? 'bg-lavender-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-lavender-50'
                }`}>
                {t === 'light' ? '☀️ Light' : t === 'dark' ? '🌙 Dark' : '🔲 High Contrast'}
              </button>
            ))}
          </div>
        </section>

        {/* Module management */}
        {selectedChild && (
          <ModuleSettings
            key={selectedChild.id}
            childName={selectedChild.name}
            initialModules={enabledModules}
            onSave={setEnabledModules}
          />
        )}

        {/* Child profiles — only admin/parent can add/remove */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Baby size={16} className="text-lavender-500" /> Child profiles
            </h3>
            {canManageChildren && (
              <button onClick={() => setShowAddChild((v) => !v)} className="text-xs font-semibold text-lavender-600">
                + Add child
              </button>
            )}
          </div>

          <div className="space-y-2">
            {children.map((child) => (
              <div key={child.id} className="relative">
                <button
                  onClick={() => selectChild(child.id)}
                  className={`w-full rounded-[1.5rem] p-4 text-left ring-1 transition-all ${
                    selectedChild?.id === child.id ? 'bg-lavender-50 ring-lavender-200' : 'bg-[#faf7ff] ring-lavender-100'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">{child.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{child.dateOfBirth || 'DOB not recorded'}</div>
                </button>

                {/* Remove child button — admin/parent only */}
                {canManageChildren && (
                  <button
                    onClick={() => { setRemoveTargetId(removeTargetId === child.id ? null : child.id); setRemoveConfirmText(''); }}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 transition"
                    title={`Remove ${child.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Remove child confirmation modal */}
                {removeTargetId === child.id && (
                  <div className="mt-2 rounded-[1.5rem] bg-rose-50 p-4 ring-1 ring-rose-200">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-rose-700">Remove {child.name}?</p>
                        <p className="text-xs text-rose-600 mt-1">
                          This action is <strong>irreversible</strong>. All diary entries, sleep records, food logs, and toilet attempt data for this child will be permanently deleted.
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-rose-600 mb-2">
                      Type <strong>{child.name}</strong> to confirm:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={removeConfirmText}
                        onChange={(e) => setRemoveConfirmText(e.target.value)}
                        placeholder={child.name}
                        className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                      />
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        disabled={removeConfirmText !== child.name}
                        className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => { setRemoveTargetId(null); setRemoveConfirmText(''); }}
                        className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showAddChild && canManageChildren && (
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

        {/* Privacy & security */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Shield size={16} className="text-lavender-500" /> Privacy & security
          </h3>
          <div className="mt-3 rounded-[1.5rem] bg-[#faf7ff] p-4 text-sm text-gray-600 ring-1 ring-lavender-100">
            Passwords are securely hashed before storage, invites are role-scoped, and audit activity is tracked. When connected to cloud storage, your data syncs across devices with NHS/school-grade privacy.
          </div>
        </section>

        {/* Audit trail */}
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

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex w-full items-center gap-3 rounded-[1.75rem] bg-amber-50 p-5 shadow-sm ring-1 ring-amber-200"
          >
            <Crown size={18} className="text-amber-500" />
            <div>
              <div className="text-sm font-semibold text-amber-800">Admin panel</div>
              <div className="text-xs text-amber-600">Manage users, roles, passwords, and system data.</div>
            </div>
          </Link>
        )}

        {/* Actions */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-2">
          <button onClick={exportData} className="flex w-full items-center gap-3 rounded-[1.5rem] bg-[#faf7ff] p-4 text-left ring-1 ring-lavender-100">
            <Download size={18} className="text-lavender-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Export diary</div>
              <div className="text-xs text-gray-500">Download {selectedChild?.name ? `${selectedChild.name}'s` : 'the current child\'s'} journal as CSV.</div>
            </div>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center gap-3 rounded-[1.5rem] bg-[#fff4f5] p-4 text-left ring-1 ring-rose-100"
          >
            <Trash2 size={18} className="text-rose-500" />
            <div>
              <div className="text-sm font-semibold text-rose-600">Clear all data</div>
              <div className="text-xs text-gray-500">Remove all saved app data from this browser.</div>
            </div>
          </button>

          {/* Clear data confirmation */}
          {showClearConfirm && (
            <div className="rounded-[1.5rem] bg-rose-50 p-4 ring-1 ring-rose-200">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-rose-700">Clear all saved data?</p>
                  <p className="text-xs text-rose-600 mt-1">
                    This will <strong>permanently delete</strong> all accounts, children, diary entries, invites, and audit history from this browser. This cannot be undone.
                  </p>
                </div>
              </div>
              <p className="text-xs text-rose-600 mb-2">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                />
                <button
                  onClick={handleClearAllData}
                  disabled={clearConfirmText !== 'DELETE'}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Clear all
                </button>
                <button
                  onClick={() => { setShowClearConfirm(false); setClearConfirmText(''); }}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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


// ── Module Settings subcomponent ─────────────────────────────────────
// Using a keyed subcomponent so state resets naturally when child switches.
interface ModuleSettingsProps {
  childName: string;
  initialModules: ModuleId[];
  onSave: (modules: ModuleId[]) => void | Promise<void>;
}

function ModuleSettings({ childName, initialModules, onSave }: ModuleSettingsProps) {
  const [pending, setPending] = useState<ModuleId[]>(initialModules);
  const [saved, setSaved] = useState(false);

  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-1">
        <Settings size={16} className="text-lavender-500" /> Modules for {childName}
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Toggle tracker modules on or off for this child. Click Save to persist your changes.
      </p>
      <div className="space-y-2">
        {DEFAULT_MODULES.map((mod) => {
          const enabled = pending.includes(mod.id);
          return (
            <label
              key={mod.id}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 cursor-pointer hover:bg-lavender-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{mod.icon}</span>
                <div>
                  <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                  <p className="text-[10px] text-gray-400">{mod.description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...pending, mod.id]
                    : pending.filter((m) => m !== mod.id);
                  setPending(next);
                  setSaved(false);
                }}
                className="h-4 w-4 rounded border-gray-300 text-lavender-500 focus:ring-lavender-400"
              />
            </label>
          );
        })}
      </div>
      <button
        onClick={async () => {
          await onSave(pending);
          setSaved(true);
        }}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-lavender-200"
      >
        <Save size={15} />
        {saved ? '✓ Saved!' : 'Save Module Settings'}
      </button>
    </section>
  );
}
