import PageShell from '../components/PageShell';
import ChildProfiles from '../components/profiles/ChildProfiles';
import TeamInvites from '../components/profiles/TeamInvites';
import PendingInvites from '../components/profiles/PendingInvites';
import Notifications from '../components/profiles/Notifications';
import AccessInfo from '../components/profiles/AccessInfo';
import { useProfiles } from '../hooks/useProfiles';

// ProfilesPage — child profile management with add/edit/remove and caregiver invites.
export default function ProfilesPage() {
  const p = useProfiles();

  return (
    <div className="pb-20">
      <PageShell
        heroAssetKey="pageProfilesHero"
        heroContent={(
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-lg font-bold text-gray-900">Profiles</h1>
            <p className="mt-0.5 text-xs text-gray-500">Manage children, caregivers, and permissions</p>
          </div>
        )}
      >
      <div className="space-y-4 px-4">
        {/* Child selector */}
        {p.children.length > 1 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <label className="text-xs font-semibold text-gray-500">Active child</label>
            <select
              value={p.selectedChildId ?? ''}
              onChange={(event) => p.selectChild(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-lavender-100 bg-lavender-50 px-3 py-2 text-sm font-semibold text-lavender-700 outline-none"
            >
              {p.children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <ChildProfiles
          children={p.children}
          selectedChildId={p.selectedChildId}
          selectChild={p.selectChild}
          canManageChildren={p.canManageChildren}
          removeTargetId={p.removeTargetId}
          removeConfirmText={p.removeConfirmText}
          setRemoveConfirmText={p.setRemoveConfirmText}
          handleToggleRemoveChild={p.handleToggleRemoveChild}
          handleRemoveChild={p.handleRemoveChild}
          handleCancelRemove={p.handleCancelRemove}
          showAddChild={p.showAddChild}
          childName={p.childName}
          setChildName={p.setChildName}
          childDob={p.childDob}
          setChildDob={p.setChildDob}
          handleAddChild={p.handleAddChild}
        />

        {/* Caregiver management */}
        {p.canManageInvites && (
          <TeamInvites
            inviteEmail={p.inviteEmail}
            setInviteEmail={p.setInviteEmail}
            inviteRole={p.inviteRole}
            setInviteRole={p.setInviteRole}
            inviteRoles={p.inviteRoles}
            sentInvites={p.sentInvites}
            statusMessage={p.statusMessage}
            handleInvite={p.handleInvite}
          />
        )}

        {/* Pending invites for current user */}
        {p.pendingReceivedInvites.length > 0 && (
          <PendingInvites
            pendingReceivedInvites={p.pendingReceivedInvites}
            acceptInvite={p.handleAcceptInvite}
            setStatusMessage={p.setStatusMessage}
          />
        )}

        <Notifications
          notifications={p.notifications}
          markNotificationRead={p.markNotificationRead}
        />

        {/* Who can see/edit — per child access list */}
        <AccessInfo selectedChild={p.selectedChild} />
      </div>
      </PageShell>
    </div>
  );
}
