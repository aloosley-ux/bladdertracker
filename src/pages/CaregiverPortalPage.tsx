import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Copy, FileUp, MailPlus, Shield, UsersRound } from 'lucide-react';
import { useApp } from '../context/useApp';
import { getImportTemplateDescription, parseImportFile } from '../utils/importers';
import BrandBanner from '../components/BrandBanner';
import type { UserRole } from '../types';

function getInviteRoles(userRole: UserRole | undefined): UserRole[] {
  if (userRole === 'admin') return ['admin', 'parent', 'caregiver', 'schoolAdmin'];
  if (userRole === 'parent') return ['parent', 'caregiver', 'schoolAdmin'];
  if (userRole === 'schoolAdmin') return ['caregiver'];
  return [];
}

function formatRole(role: UserRole): string {
  if (role === 'schoolAdmin') return 'School admin';
  if (role === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function CaregiverPortalPage() {
  const {
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    invites,
    notifications,
    createInvite,
    acceptInvite,
    importDiaryData,
    markNotificationRead,
  } = useApp();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('caregiver');
  const [statusMessage, setStatusMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const inviteRoles = getInviteRoles(user?.role);
  const canManageInvites = user?.role === 'admin' || user?.role === 'parent' || user?.role === 'schoolAdmin';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const pendingReceivedInvites = useMemo(
    () => invites.filter((invite) => invite.status === 'pending' && invite.email === user?.email),
    [invites, user?.email]
  );
  const sentInvites = useMemo(() => invites.filter((invite) => invite.invitedBy === user?.id), [invites, user?.id]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage('');
    if (!selectedChildId) return;

    const invite = await createInvite(inviteEmail, inviteRole, selectedChildId);
    if (!invite) {
      setStatusMessage('Choose a child before sending an invite.');
      return;
    }

    setInviteEmail('');
    setStatusMessage(`Invite prepared for ${invite.email}. Share the secure link or notify them by email.`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChildId) return;

    setImportMessage('');
    setImporting(true);
    try {
      const payload = await parseImportFile(file);
      const summary = await importDiaryData(payload, selectedChildId);
      const total = summary.drinks + summary.urineEntries + summary.bowelEntries + summary.sleepEntries + summary.toiletAttemptEntries + summary.foodEntries;
      const errorText = summary.errors.length > 0 ? ` ${summary.errors.join(' ')}` : '';
      setImportMessage(`Imported ${total} records.${errorText}`);
    } catch {
      setImportMessage('We could not read that file. Please use CSV, JSON, or XLSX with the provided template structure.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4">
        <BrandBanner />
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="mt-1 text-base font-bold text-gray-900">Collaborative diary management</h1>
          <p className="mt-0.5 text-xs text-gray-500">Invite parents or staff, import shared updates, and keep an audit-friendly workflow.</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-700">Assigned children</h2>
              <p className="mt-1 text-xs text-gray-400">Caregivers only see the children they are linked to.</p>
            </div>
            {children.length > 0 && (
              <select
                value={selectedChildId ?? ''}
                onChange={(event) => selectChild(event.target.value)}
                className="rounded-2xl border border-lavender-100 bg-lavender-50 px-3 py-2 text-xs font-semibold text-lavender-700 outline-none"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            {children.map((child) => (
              <div key={child.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{child.name}</div>
                    <div className="text-xs text-gray-500">
                      {child.dateOfBirth || 'DOB not recorded'} · {child.caregivers.length} caregiver{child.caregivers.length === 1 ? '' : 's'} · {child.parentIds.length} parent{child.parentIds.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-lavender-700">
                    {selectedChild?.id === child.id ? 'Active child' : 'Available'}
                  </div>
                </div>
              </div>
            ))}
            {children.length === 0 && (
              <div className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-6 text-center text-sm text-gray-500 ring-1 ring-lavender-100">
                No assignments yet. Accept an invite or add a child in Settings.
              </div>
            )}
          </div>
        </section>

        {canManageInvites && (
          <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
                <MailPlus size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-700">Secure invites</h2>
                <p className="mt-1 text-xs text-gray-400">Generate role-specific access links for parents, caregivers, or school admins.</p>
              </div>
            </div>

            <form onSubmit={handleInvite} className="mt-4 space-y-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="caregiver@example.org"
                className="input-card"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                {inviteRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setInviteRole(role)}
                    className={`rounded-2xl border px-3 py-2 text-xs font-semibold capitalize transition-all ${
                      inviteRole === role
                        ? 'border-lavender-300 bg-lavender-50 text-lavender-700'
                        : 'border-gray-200 text-gray-500 hover:border-lavender-200 hover:bg-lavender-50/60'
                    }`}
                  >
                    {formatRole(role)}
                  </button>
                ))}
              </div>
              <button className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(139,77,255,0.24)]">
                Create secure invite
              </button>
            </form>
            {statusMessage && <p className="mt-3 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">{statusMessage}</p>}

            <div className="mt-4 space-y-3">
              {sentInvites.slice(0, 4).map((invite) => (
                <div key={invite.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{invite.email}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {invite.childName} · {formatRole(invite.role)} · {invite.status}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(invite.link)}
                      className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-lavender-700 ring-1 ring-lavender-100"
                    >
                      <Copy size={12} /> Copy link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef9ff] text-sky-600">
              <FileUp size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-700">Bulk import</h2>
              <p className="mt-1 text-xs text-gray-400">Import CSV, JSON, or XLSX files for school or caregiver updates.</p>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-lavender-200 bg-[#faf7ff] px-4 py-6 text-center">
            <input type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={handleImport} />
            <span className="text-sm font-semibold text-lavender-700">{importing ? 'Importing…' : 'Choose import file'}</span>
            <span className="mt-1 text-xs text-gray-500">Supported formats: .csv, .json, .xlsx</span>
          </label>
          {importMessage && <p className="mt-3 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-lavender-700">{importMessage}</p>}

          <ul className="mt-4 space-y-2 text-xs text-gray-500">
            {getImportTemplateDescription().map((item) => (
              <li key={item} className="rounded-2xl bg-[#faf7ff] px-3 py-2 ring-1 ring-lavender-100">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {pendingReceivedInvites.length > 0 && (
          <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef9ff] text-sky-600">
                <UsersRound size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-700">Pending invites for you</h2>
                <p className="mt-1 text-xs text-gray-400">Accept diary access that matches your signed-in email address.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {pendingReceivedInvites.map((invite) => (
                <div key={invite.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{invite.childName}</div>
                      <div className="mt-1 text-xs text-gray-500">Role: {formatRole(invite.role)}</div>
                    </div>
                    <button
                      onClick={async () => {
                        const accepted = await acceptInvite(invite.token);
                        setStatusMessage(accepted ? `Accepted access to ${invite.childName}.` : 'This invite could not be accepted.');
                      }}
                      className="rounded-full bg-lavender-500 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Accept invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-700">Notifications & audit awareness</h2>
              <p className="mt-1 text-xs text-gray-400">Recent activity keeps families and schools aligned.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`w-full rounded-[1.5rem] px-4 py-3 text-left ring-1 transition-all ${
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
      </div>
    </div>
  );
}
