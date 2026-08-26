import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Bell,
  Crown,
  Download,
  FileUp,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Palette,
  Settings,
  Shield,
  Trash2,
  Type,
  Upload,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useTheme } from '../context/useTheme';
import ModuleSettings from '../components/settings/ModuleSettings';
import PageShell from '../components/PageShell';
import { generateId } from '../utils/storage';
import { apiDeleteAccount, apiResetPassword } from '../utils/api';
import { getImportTemplateDescription, parseImportFile } from '../utils/importers';
import { DueDateEditor } from '../components/leaps';
import type { Child, ModuleId } from '../types';

const REMINDER_ENABLED_MODULES: ModuleId[] = ['milestones', 'therapy', 'routine', 'mood', 'leaps'];

// SettingsPage — user settings for theme, font, notifications, password, and data import/export.
export default function SettingsPage() {
  const {
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    addChild,
    removeChild,
    exportData,
    importDiaryData,
    auditTrail,
    logout,
    clearAllData,
    enabledModules,
    setEnabledModules,
    reminderPreferences,
    setReminderPreferences,
    updateChild,
  } = useApp();
  const { theme, setTheme, dyslexiaFont, setDyslexiaFont } = useTheme();

  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');

  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [removeConfirmText, setRemoveConfirmText] = useState('');

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteAccountText, setDeleteAccountText] = useState('');

  // Change password state (cloud mode only)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Import state
  const [importMessage, setImportMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Due date editing state for child profiles
  const [dueDateTargetId, setDueDateTargetId] = useState<string | null>(null);
  // local editor UI state

  const handleSaveDueDate = (child: Child, date: string, useAsDue = false) => {
    const updated: Partial<Child> = { ...child, lastUpdatedAt: new Date().toISOString() };
    // Always save to dateOfBirth (used by leap calculations)
    updated.dateOfBirth = date;

    if (child.isBorn) {
      // If child is already born, ensure any dueDate is cleared
      updated.dueDate = undefined;
    } else {
      // If child is not born, optionally treat this DOB value as the due date until born
      if (useAsDue) {
        updated.dueDate = date;
      } else {
        updated.dueDate = undefined;
      }
    }

    updateChild(updated as Child);
    setDueDateTargetId(null);
  };

  const cloud = typeof window !== 'undefined' && !!import.meta.env.VITE_USE_CLOUD;

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
    [user?.name],
  );

  const formatRole = (role: string) => {
    if (role === 'schoolAdmin') return 'School admin';
    if (role === 'admin') return 'Administrator';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

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

  const handleDeleteAccount = async () => {
    if (deleteAccountText !== 'DELETE MY ACCOUNT') return;
    try {
      await apiDeleteAccount();
      clearAllData();
    } catch {
      setDeleteAccountText('');
      setShowDeleteAccount(false);
      alert('Account deletion failed. Please try again or contact support.');
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await apiResetPassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Could not change password. Check your current password and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChildId) return;

    setImportMessage('');
    setImporting(true);
    try {
      const payload = await parseImportFile(file);
      const summary = await importDiaryData(payload, selectedChildId);
      const total =
        summary.drinks +
        summary.urineEntries +
        summary.bowelEntries +
        summary.sleepEntries +
        summary.toiletAttemptEntries +
        summary.foodEntries;
      const errorText = summary.errors.length > 0 ? ` ${summary.errors.join(' ')}` : '';
      setImportMessage(`Imported ${total} records.${errorText}`);
    } catch {
      setImportMessage('Could not read that file. Please use CSV, JSON, or XLSX with the provided template structure.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const visibleAudit = auditTrail.slice(0, 5);
  const templateHints = getImportTemplateDescription();
  const reminderForChild = selectedChildId
    ? reminderPreferences.filter((entry) => entry.childId === selectedChildId)
    : [];
  const reminderModules = enabledModules.filter((moduleId) => REMINDER_ENABLED_MODULES.includes(moduleId));

  return (
    <div className="pb-20">
      <PageShell
        heroAssetKey="pageSettingsHero"
        heroContent={(
          <div className="px-4 pb-6 pt-8">
            <h1 className="text-xl font-bold text-[var(--foreground)]">Account &amp; Settings</h1>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              Manage your profile, preferences, data, and privacy in one place.
            </p>
          </div>
        )}
      >
      <div className="space-y-4 px-4 pt-2">
        {/* ── User Profile Card ─────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-lg font-bold text-violet-700">
              {userInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="flex items-center gap-1.5 text-sm text-gray-500">
                {isAdmin && <Crown size={12} className="text-amber-500" />}
                {formatRole(user?.role ?? '')}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* ── Change Password (cloud only) ──────────────────────────── */}
        {cloud && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="password-heading">
            <h3 id="password-heading" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Lock size={16} className="text-violet-500" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label htmlFor="current-password" className="mb-1 block text-xs font-semibold text-gray-600">Current password</label>
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="mb-1 block text-xs font-semibold text-gray-600">New password</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-xs font-semibold text-gray-600">Confirm new password</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              {passwordError && <p className="text-xs font-semibold text-red-600" role="alert">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs font-semibold text-green-600" role="status">{passwordSuccess}</p>}
              <button
                type="submit"
                disabled={changingPassword}
                className="rounded-xl bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-600 disabled:opacity-50"
                aria-label="Change password"
              >
                {changingPassword ? 'Changing…' : 'Change password'}
              </button>
            </form>
          </section>
        )}

        {/* ── Role & Permissions ────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="role-heading">
          <h3 id="role-heading" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
            <UserCheck size={16} className="text-violet-500" /> Your Role &amp; Access
          </h3>
          <div className="mb-3 rounded-xl bg-violet-50 p-3">
            <p className="mb-1 text-xs font-semibold text-violet-800">
              {formatRole(user?.role ?? '')} — what you can do:
            </p>
            <ul className="list-inside list-disc space-y-1 text-xs text-violet-700">
              {(user?.role === 'admin' || user?.role === 'parent') && (
                <>
                  <li>Add, edit, and remove child profiles</li>
                  <li>Log and delete all diary entries</li>
                  <li>Invite caregivers, school admins, therapists, and specialists</li>
                  <li>Toggle modules per child and export data</li>
                </>
              )}
              {user?.role === 'caregiver' && (
                <>
                  <li>View and log diary entries for linked children</li>
                  <li>Cannot add or remove child profiles</li>
                  <li>Cannot invite other users or export data</li>
                </>
              )}
              {user?.role === 'schoolAdmin' && (
                <>
                  <li>View diary entries for linked children</li>
                  <li>Log school-time entries (food, routine, toilet attempts)</li>
                  <li>Cannot modify child profiles, but can send caregiver invites for linked children</li>
                </>
              )}
              {(user?.role === 'therapist' || user?.role === 'specialist') && (
                <>
                  <li>Caregiver-level diary access for linked children</li>
                  <li>Can log the same diary entries as other invited caregivers</li>
                  <li>Role label is retained for therapy or clinical context</li>
                </>
              )}
            </ul>
          </div>
          <p className="text-[10px] text-gray-400">
            Roles are assigned at invite time. Contact the account owner to change your role.
          </p>
        </section>

        {/* ── Appearance ────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
            <Palette size={16} className="text-violet-500" /> Appearance
          </h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'high-contrast'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  theme === t
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-violet-50'
                }`}
              >
                {t === 'light' ? '☀️ Light' : t === 'dark' ? '🌙 Dark' : '🔲 High Contrast'}
              </button>
            ))}
          </div>

          {/* Dyslexia-friendly font toggle [7] */}
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Type size={16} className="shrink-0 text-violet-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Dyslexia-friendly font</p>
                <p className="text-xs text-gray-500">Switches to Atkinson Hyperlegible — designed for readability</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={dyslexiaFont}
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className="nhs-toggle shrink-0"
              data-on={dyslexiaFont}
              aria-label="Toggle dyslexia-friendly font"
            />
          </div>
        </section>

        {/* ── Module Management ─────────────────────────────────────── */}
        {selectedChild && (
          <ModuleSettings
            key={selectedChild.id}
            childName={selectedChild.name}
            initialModules={enabledModules}
            onSave={setEnabledModules}
          />
        )}

        {selectedChild && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Bell size={16} className="text-violet-500" /> Reminder preferences
            </h3>
            <p className="mb-3 text-xs text-gray-500">
              Opt in to daily or weekly module reminders. Reminders stay scoped to this child profile.
            </p>
            <div className="space-y-2">
              {reminderModules.map((moduleId) => {
                  const existing = reminderForChild.find((entry) => entry.moduleId === moduleId);
                  const enabled = existing?.enabled ?? false;
                  const frequency = existing?.frequency ?? 'weekly';
                  return (
                    <div key={moduleId} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{moduleId}</p>
                          <p className="text-xs text-gray-500">Show dashboard reminder banner</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={enabled}
                          aria-label={`Toggle ${moduleId} reminders`}
                          className="nhs-toggle"
                          data-on={enabled}
                          onClick={() => {
                            if (!selectedChildId) return;
                            const next = reminderModules
                              .map((id) => {
                                const item = reminderForChild.find((entry) => entry.moduleId === id);
                                if (id !== moduleId) return item ?? { moduleId: id, enabled: false, frequency: 'weekly' as const };
                                return { moduleId: id, enabled: !enabled, frequency, snoozedUntil: null };
                              });
                            setReminderPreferences(selectedChildId, next);
                          }}
                        />
                      </div>
                      {enabled && (
                        <div className="mt-2 flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-600">Frequency</label>
                          <select
                            className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                            value={frequency}
                            onChange={(event) => {
                              if (!selectedChildId) return;
                              const next = reminderModules
                                .map((id) => {
                                  const item = reminderForChild.find((entry) => entry.moduleId === id);
                                  if (id !== moduleId) return item ?? { moduleId: id, enabled: false, frequency: 'weekly' as const };
                                  return { moduleId: id, enabled: true, frequency: event.target.value as 'daily' | 'weekly', snoozedUntil: null };
                                });
                              setReminderPreferences(selectedChildId, next);
                            }}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* ── Child Profiles ───────────────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Settings size={16} className="text-violet-500" /> Child profiles
            </h3>
            {canManageChildren && (
              <button onClick={() => setShowAddChild((v) => !v)} className="text-xs font-semibold text-violet-600">
                + Add child
              </button>
            )}
          </div>

          <div className="space-y-2">
            {children.map((child) => (
              <div key={child.id} className="relative">
                <button
                  onClick={() => selectChild(child.id)}
                  className={`w-full rounded-2xl p-4 text-left ring-1 transition-all ${
                    selectedChild?.id === child.id ? 'bg-violet-50 ring-violet-200' : 'bg-[var(--muted)] ring-[var(--border)]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[var(--foreground)]">{child.name}</div>
                  <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {(() => {
                      const showDue = !!child.dueDate && !child.isBorn;
                      const label = showDue ? 'DUE' : 'DOB';
                      const value = child.dateOfBirth || child.dueDate || 'not recorded';
                      return `${label}: ${value}`;
                    })()}
                  </div>
                </button>

                {canManageChildren && (
                  <>
                    {/* DOB edit button (opens DOB editor) */}
                    {child.dueDate && (
                      <div className="absolute right-28 top-3 text-xs font-semibold text-[var(--foreground)] uppercase">DUE</div>
                    )}
                    <button
                      onClick={() => {
                        setDueDateTargetId(dueDateTargetId === child.id ? null : child.id);
                      }}
                      className="absolute right-12 top-3 flex h-7 items-center gap-2 rounded-full bg-violet-50 px-3 text-xs font-semibold text-violet-600 ring-1 ring-violet-100 transition hover:bg-violet-100"
                      title={child.isBorn ? `Set DOB for ${child.name}` : `Set DOB for ${child.name}`}
                    >
                      {child.dateOfBirth || child.dueDate || 'Set DOB'}
                    </button>
                    <button
                      onClick={() => {
                        setRemoveTargetId(removeTargetId === child.id ? null : child.id);
                        setRemoveConfirmText('');
                      }}
                      className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-400 transition hover:bg-pink-100"
                      title={`Remove ${child.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}

                {dueDateTargetId === child.id && (
                  <div className="mt-2 rounded-2xl bg-[var(--muted)] p-4 ring-1 ring-[var(--border)]">
                    <p className="text-xs text-[var(--muted-foreground)] mb-3">
                      💡 Setting {child.name}&apos;s date of birth helps developmental leap predictions. For children not yet born,
                      you can choose to treat this date as the expected due date until they are marked born.
                    </p>
                    <DueDateEditor
                      child={child}
                      mode="dob"
                      onSave={(d, useAsDue) => handleSaveDueDate(child, d, useAsDue)}
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setDueDateTargetId(null)}
                        className="mt-2 text-xs text-[var(--muted-foreground)] underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {removeTargetId === child.id && (
                  <div className="mt-2 rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
                    <div className="mb-3 flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-pink-500" />
                      <div>
                        <p className="text-sm font-semibold text-pink-700">Remove {child.name}?</p>
                        <p className="mt-1 text-xs text-pink-600">
                          This action is <strong>irreversible</strong>. All diary entries, sleep records, food logs, and
                          toilet attempt data for this child will be permanently deleted.
                        </p>
                      </div>
                    </div>
                    <p className="mb-2 text-xs text-pink-600">
                      Type <strong>{child.name}</strong> to confirm:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={removeConfirmText}
                        onChange={(e) => setRemoveConfirmText(e.target.value)}
                        placeholder={child.name}
                        className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                      />
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        disabled={removeConfirmText !== child.name}
                        className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => {
                          setRemoveTargetId(null);
                          setRemoveConfirmText('');
                        }}
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
            <form onSubmit={handleAddChild} className="mt-4 space-y-3 rounded-2xl bg-[var(--muted)] p-4 ring-1 ring-[var(--border)]">
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
              <button className="w-full rounded-full bg-violet-500 px-4 py-3 text-sm font-semibold text-white">
                Save child profile
              </button>
            </form>
          )}
        </section>

        {/* ── Data & Privacy (unified) ─────────────────────────────── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="data-privacy-heading">
          <h3 id="data-privacy-heading" className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-700">
            <Shield size={16} className="text-violet-500" /> Data &amp; Privacy
          </h3>
          <p className="mb-4 text-xs text-gray-400">
            Your data is stored securely. You have the right to export, import, or permanently delete your account and
            all associated records at any time.
          </p>

          <div className="space-y-2">
            {/* Export */}
            <button
              onClick={exportData}
              className="flex w-full items-center gap-3 rounded-2xl bg-violet-50 p-4 text-left ring-1 ring-violet-100 transition hover:bg-violet-100"
              aria-label="Export your diary data as a CSV file"
            >
              <Download size={18} className="text-violet-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Export my data</div>
                <div className="text-xs text-gray-500">
                  Download {selectedChild?.name ? `${selectedChild.name}'s` : "the current child's"} diary as CSV.
                </div>
              </div>
            </button>

            {/* Import */}
            <div className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100">
              <div className="flex items-center gap-3">
                <Upload size={18} className="shrink-0 text-violet-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Import data</div>
                  <div className="text-xs text-gray-500">
                    Upload a CSV, JSON, or Excel file for{' '}
                    {selectedChild?.name ?? 'the selected child'}.
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing || !selectedChildId}
                  className="shrink-0 rounded-xl bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-600 disabled:opacity-40"
                >
                  <FileUp size={14} className="mr-1 inline-block" />
                  {importing ? 'Importing…' : 'Choose file'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.xlsx"
                  onChange={handleImport}
                  className="hidden"
                  aria-label="Import diary data file"
                />
              </div>
              {importMessage && (
                <p className="mt-2 text-xs text-violet-700">{importMessage}</p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-[10px] font-medium text-violet-600">
                  Template format hints
                </summary>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-[10px] text-gray-500">
                  {templateHints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              </details>
            </div>

            {/* Clear all data */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex w-full items-center gap-3 rounded-2xl bg-[#fff4f5] p-4 text-left ring-1 ring-rose-100"
            >
              <Trash2 size={18} className="text-pink-500" />
              <div>
                <div className="text-sm font-semibold text-pink-600">Clear all data</div>
                <div className="text-xs text-gray-500">Remove all saved app data from this browser.</div>
              </div>
            </button>

            {showClearConfirm && (
              <div className="rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
                <div className="mb-3 flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-pink-500" />
                  <div>
                    <p className="text-sm font-semibold text-pink-700">Clear all saved data?</p>
                    <p className="mt-1 text-xs text-pink-600">
                      This will <strong>permanently delete</strong> all accounts, children, diary entries, invites, and
                      audit history from this browser. This cannot be undone.
                    </p>
                  </div>
                </div>
                <p className="mb-2 text-xs text-pink-600">
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clearConfirmText}
                    onChange={(e) => setClearConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={handleClearAllData}
                    disabled={clearConfirmText !== 'DELETE'}
                    className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => {
                      setShowClearConfirm(false);
                      setClearConfirmText('');
                    }}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Delete account (cloud only) */}
            {cloud && (
              <button
                onClick={() => setShowDeleteAccount(true)}
                className="flex w-full items-center gap-3 rounded-2xl bg-pink-50 p-4 text-left ring-1 ring-rose-100 transition hover:bg-pink-100"
                aria-label="Permanently delete your account"
              >
                <Trash2 size={18} className="text-pink-500" />
                <div>
                  <div className="text-sm font-semibold text-pink-700">Delete my account</div>
                  <div className="text-xs text-pink-500">
                    Permanently removes your account and all data. Cannot be undone.
                  </div>
                </div>
              </button>
            )}

            {showDeleteAccount && (
              <div className="rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
                <p className="mb-2 text-sm font-semibold text-pink-700">
                  This will permanently delete your account and all data.
                </p>
                <p className="mb-3 text-xs text-pink-600">
                  Type <strong>DELETE MY ACCOUNT</strong> to confirm:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deleteAccountText}
                    onChange={(e) => setDeleteAccountText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                    aria-label="Type DELETE MY ACCOUNT to confirm"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountText !== 'DELETE MY ACCOUNT'}
                    className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteAccount(false);
                      setDeleteAccountText('');
                    }}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Audit trail */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-gray-600">Recent audit trail</h4>
              <Link to="/audit-trail" className="text-xs font-semibold text-violet-600 underline underline-offset-2 hover:text-violet-700">
                View full history
              </Link>
            </div>
            <div className="space-y-2">
              {visibleAudit.map((event) => (
                <div key={event.id} className="rounded-2xl bg-[var(--card)] px-4 py-3 ring-1 ring-[var(--border)]">
                  <div className="text-sm font-semibold text-gray-900">{event.action}</div>
                  <div className="mt-1 text-xs text-gray-500">{event.detail}</div>
                  <div className="mt-2 text-[11px] text-gray-400">
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
              {auditTrail.length === 0 && <p className="text-sm text-gray-500">No audit events yet.</p>}
            </div>
          </div>

          {/* GDPR link */}
          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Globe size={14} className="text-violet-500" />
              <Link to="/gdpr" className="underline underline-offset-2 hover:text-violet-600">
                View our full GDPR &amp; Data Protection policy
              </Link>
            </div>
          </div>
        </section>

        {/* ── Help ──────────────────────────────────────────────────── */}
        <Link
          to="/help"
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:bg-violet-50"
        >
          <HelpCircle size={18} className="text-violet-500" />
          <div>
            <div className="text-sm font-semibold text-gray-900">Help &amp; Support</div>
            <div className="text-xs text-gray-500">FAQs, guides, and contact information.</div>
          </div>
        </Link>

        {/* ── Admin panel link ─────────────────────────────────────── */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-5 shadow-sm ring-1 ring-amber-200"
          >
            <Crown size={18} className="text-amber-500" />
            <div>
              <div className="text-sm font-semibold text-amber-800">Admin panel</div>
              <div className="text-xs text-amber-600">Manage users, roles, passwords, and system data.</div>
            </div>
          </Link>
        )}

        {/* ── Sign out ─────────────────────────────────────────────── */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:bg-pink-50"
        >
          <LogOut size={18} className="text-pink-500" />
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">Sign out</div>
            <div className="text-xs text-gray-500">End your current session.</div>
          </div>
        </button>
      </div>
      </PageShell>
    </div>
  );
}
