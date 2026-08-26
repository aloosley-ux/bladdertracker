import { MailPlus, Copy } from 'lucide-react';
import type { CaregiverInvite, UserRole } from '../../types';

interface TeamInvitesProps {
  inviteEmail: string;
  setInviteEmail: (v: string) => void;
  inviteRole: UserRole;
  setInviteRole: (r: UserRole) => void;
  inviteRoles: UserRole[];
  sentInvites: CaregiverInvite[];
  statusMessage: string;
  handleInvite: (e: React.FormEvent) => void;
}

function formatRole(role: UserRole): string {
  if (role === 'schoolAdmin') return 'School admin';
  if (role === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function TeamInvites(props: TeamInvitesProps) {
  const {
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    inviteRoles,
    sentInvites,
    statusMessage,
    handleInvite,
  } = props;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
          <MailPlus size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700">Team invites</h2>
          <p className="mt-1 text-xs text-gray-400">Generate role-specific access links for parents, caregivers, school admins, therapists, or specialists.</p>
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
          <h4 className="text-xs font-semibold text-[var(--text-secondary)]">Sent invites</h4>
          {sentInvites.map((invite) => (
            <div key={invite.id} className="rounded-2xl bg-[var(--bg-card)] px-4 py-3 ring-1 ring-[var(--border-color)]">
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
                  className="flex items-center gap-1 rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[11px] font-semibold text-lavender-600 ring-1 ring-[var(--border-color)]"
                >
                  <Copy size={12} /> Copy link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
