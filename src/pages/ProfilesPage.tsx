import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Copy, MailPlus, Baby, Trash2, AlertTriangle, Bell, Users, Shield } from 'lucide-react';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import type { Child, UserRole } from '../types';

function getInviteRoles(userRole: UserRole | undefined): UserRole[] {
  if (userRole === 'admin') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'parent') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'schoolAdmin') return ['caregiver'];
  return [];
}

function formatRole(role: UserRole): string {
  if (role === 'schoolAdmin') return 'School admin';
  if (role === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function ProfilesPage() {
  const {
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    addChild,
    removeChild,
    invites,
    notifications,
    createInvite,
    acceptInvite,
    markNotificationRead,
  } = useApp();

  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [removeConfirmText, setRemoveConfirmText] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('caregiver');
  const [statusMessage, setStatusMessage] = useState('');

  const inviteRoles = getInviteRoles(user?.role);
  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const canManageChildren = isAdmin || isParent;
  const canManageInvites = isAdmin || isParent || user?.role === 'schoolAdmin';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const pendingReceivedInvites = useMemo(
    () => invites.filter((invite) => invite.status === 'pending' && invite.email === user?.email),
    [invites, user?.email],
  );

  const sentInvites = useMemo(
    () => invites.filter((invite) => invite.invitedBy === user?.id),
    [invites, user?.id],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications],
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

  const handleToggleRemoveChild = (childId: string) => {
    setRemoveTargetId(removeTargetId === childId ? null : childId);
    setRemoveConfirmText('');
  };

  const handleRemoveChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child || removeConfirmText !== child.name) return;
    removeChild(childId);
    setRemoveTargetId(null);
    setRemoveConfirmText('');
  };

  const handleCancelRemove = () => {
    setRemoveTargetId(null);
    setRemoveConfirmText('');
  };

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

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Profiles</h1>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Manage children, caregivers, and permissions</p>
      </div>

      <div className="space-y-4 px-4">
        {/* Child selector */}
        {children.length > 1 && (
          <div className="rounded-2xl bg-[var(--bg-card)] p-4 shadow-sm ring-1 ring-[var(--border-color)]">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Active child</label>
            <select
              value={selectedChildId ?? ''}
              onChange={(event) => selectChild(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-lavender-100 bg-lavender-50 px-3 py-2 text-sm font-semibold text-lavender-700 outline-none"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Child profiles */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
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
                  className={`w-full rounded-2xl p-4 text-left ring-1 transition-all ${
                    selectedChild?.id === child.id ? 'bg-lavender-50 ring-lavender-200' : 'theme-surface-muted'
                  }`}
                >
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{child.name}</div>
                  <div className="mt-1 text-xs text-[var(--text-secondary)]">{child.dateOfBirth || 'DOB not recorded'}</div>
                  {selectedChild?.id === child.id && (
                    <span className="mt-1 inline-block rounded-full bg-lavender-100 px-2 py-0.5 text-[11px] font-semibold text-lavender-700 tag-selected">
                      Selected
                    </span>
                  )}
                </button>

                {canManageChildren && (
                  <button
                    onClick={() => handleToggleRemoveChild(child.id)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-400 transition hover:bg-rose-100"
                    title={`Remove ${child.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {removeTargetId === child.id && (
                  <div className="mt-2 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
                    <div className="mb-3 flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                      <div>
                        <p className="text-sm font-semibold text-rose-700">Remove {child.name}?</p>
                        <p className="mt-1 text-xs text-rose-600">
                          This action is <strong>irreversible</strong>. All diary entries, sleep records, food logs, and toilet attempt data for this child will be permanently deleted.
                        </p>
                      </div>
                    </div>
                    <p className="mb-2 text-xs text-rose-600">
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
                        onClick={handleCancelRemove}
                        className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {children.length === 0 && (
              <div className="rounded-2xl theme-surface-muted px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                No children added yet. Use the button above to add a child profile.
              </div>
            )}
          </div>

          {showAddChild && canManageChildren && (
            <form onSubmit={handleAddChild} className="mt-4 space-y-3 rounded-2xl theme-surface-muted p-4">
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

        {/* Caregiver management */}
        {canManageInvites && (
          <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
                <MailPlus size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Team invites</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Generate role-specific access links for parents, caregivers, school admins, therapists, or specialists.</p>
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

            {sentInvites.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-semibold text-gray-500">Sent invites</h4>
                {sentInvites.map((invite) => (
                  <div key={invite.id} className="rounded-2xl theme-surface-muted px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">{invite.email}</div>
                        <div className="mt-1 text-xs text-[var(--text-secondary)]">
                          {invite.childName} · {formatRole(invite.role)} ·{' '}
                          <span className={invite.status === 'accepted' ? 'text-green-600' : 'text-amber-600'}>
                            {invite.status}
                          </span>
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
            )}
          </section>
        )}

        {/* Pending invites for current user */}
        {pendingReceivedInvites.length > 0 && (
          <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef9ff] text-sky-600">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Pending invites for you</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Accept diary access that matches your signed-in email address.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {pendingReceivedInvites.map((invite) => (
                <div key={invite.id} className="rounded-2xl theme-surface-muted px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{invite.childName}</div>
                      <div className="mt-1 text-xs text-[var(--text-secondary)]">Role: {formatRole(invite.role)}</div>
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

        {/* Notifications */}
        <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Notifications
                {unreadNotifications.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">Recent activity and updates.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.slice(0, 6).map((notification) => (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left ring-1 transition-all ${
                  notification.read ? 'bg-[var(--bg-card)] ring-[var(--border-color)]' : 'bg-lavender-50 ring-lavender-100'
                }`}
              >
                <div className="text-sm font-semibold text-[var(--text-primary)]">{notification.title}</div>
                <div className="mt-1 text-xs text-[var(--text-secondary)]">{notification.message}</div>
                <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </button>
            ))}
            {notifications.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No notifications yet.</p>}
          </div>
        </section>

        {/* Who can see/edit — per child access list */}
        {selectedChild && (
          <section className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-sm ring-1 ring-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Who can see / edit {selectedChild.name}</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">People with access to this child's diary.</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {selectedChild.parentIds.length > 0 && (
                <div className="rounded-2xl theme-surface-muted px-4 py-3">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]">Parents</div>
                  <div className="mt-1 text-sm text-[var(--text-primary)]">
                    {selectedChild.parentIds.length} parent{selectedChild.parentIds.length === 1 ? '' : 's'} linked
                  </div>
                </div>
              )}
              {selectedChild.caregivers.length > 0 && (
                <div className="rounded-2xl theme-surface-muted px-4 py-3">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]">Caregivers</div>
                  <div className="mt-1 text-sm text-[var(--text-primary)]">
                    {selectedChild.caregivers.length} caregiver{selectedChild.caregivers.length === 1 ? '' : 's'} linked
                  </div>
                </div>
              )}
              {selectedChild.parentIds.length === 0 && selectedChild.caregivers.length === 0 && (
                <p className="text-sm text-[var(--text-secondary)]">No one else has access yet. Send an invite above.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
