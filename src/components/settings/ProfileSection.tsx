import { Bell, Crown, Lock, Palette, Type, UserCheck } from 'lucide-react';
import type { ModuleId, User, Child } from '../../types';
import type { Theme } from '../../context/themeContextDef';
import { Switch } from '../ui/switch';
import ModuleSettings from './ModuleSettings';

interface ProfileSectionProps {
  user: User;
  selectedChild: Child;
  selectedChildId: string | null;
  enabledModules: ModuleId[];
  setEnabledModules: (modules: ModuleId[]) => void;
  reminderPreferences: { moduleId: string; enabled: boolean; time?: string }[];
  setReminderPreferences: (childId: string, prefs: { moduleId: string; enabled: boolean; time?: string }[]) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (v: boolean) => void;
  userInitials: string;
  formatRole: (role: string) => string;
  isAdmin: boolean;
  cloud: boolean;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  passwordError: string;
  passwordSuccess: string;
  changingPassword: boolean;
  handleChangePassword: (e: React.FormEvent) => void;
  reminderModules: { moduleId: string; enabled: boolean; time?: string }[];
  reminderForChild: { moduleId: string; enabled: boolean; time?: string }[];
}

export function ProfileSection({
  user,
  selectedChild,
  selectedChildId,
  enabledModules,
  setEnabledModules,
  setReminderPreferences,
  theme,
  setTheme,
  dyslexiaFont,
  setDyslexiaFont,
  userInitials,
  formatRole,
  isAdmin,
  cloud,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  passwordSuccess,
  changingPassword,
  handleChangePassword,
  reminderModules,
  reminderForChild,
}: ProfileSectionProps) {
  return (
    <>
      {/* User Profile Card */}
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

      {/* Change Password (cloud only) */}
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

      {/* Role & Permissions */}
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

      {/* Appearance */}
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

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Type size={16} className="shrink-0 text-violet-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Dyslexia-friendly font</p>
              <p className="text-xs text-gray-500">Switches to Atkinson Hyperlegible — designed for readability</p>
            </div>
          </div>
          <Switch
            checked={dyslexiaFont}
            onCheckedChange={(checked) => setDyslexiaFont(checked)}
            aria-label="Toggle dyslexia-friendly font"
          />
        </div>
      </section>

      {/* Module Management */}
      {selectedChild && (
        <ModuleSettings
          key={selectedChild.id}
          childName={selectedChild.name}
          initialModules={enabledModules}
          onSave={setEnabledModules}
        />
      )}

      {/* Reminder preferences */}
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
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => {
                        if (!selectedChildId) return;
                        const next = reminderModules
                          .map((id) => {
                            const item = reminderForChild.find((entry) => entry.moduleId === id);
                            if (id !== moduleId) return item ?? { moduleId: id, enabled: false, frequency: 'weekly' as const };
                            return { moduleId: id, enabled: !enabled, frequency, snoozedUntil: null };
                          });
                        setReminderPreferences(selectedChildId, next);
                      }}
                      aria-label={`Toggle ${moduleId} reminders`}
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
    </>
  );
}
