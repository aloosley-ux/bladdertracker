import { Users } from 'lucide-react';
import type { CaregiverInvite } from '../../types';

interface PendingInvitesProps {
  pendingReceivedInvites: CaregiverInvite[];
  acceptInvite: (token: string) => Promise<boolean>;
  setStatusMessage: (msg: string) => void;
}

function formatRole(role: string): string {
  if (role === 'schoolAdmin') return 'School admin';
  if (role === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function PendingInvites(props: PendingInvitesProps) {
  const { pendingReceivedInvites, acceptInvite, setStatusMessage } = props;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef9ff] text-sky-600">
          <Users size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700">Pending invites for you</h2>
          <p className="mt-1 text-xs text-gray-400">Accept diary access that matches your signed-in email address.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {pendingReceivedInvites.map((invite) => (
          <div key={invite.id} className="rounded-2xl bg-[var(--bg-accent)] px-4 py-3 ring-1 ring-lavender-100">
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
  );
}
