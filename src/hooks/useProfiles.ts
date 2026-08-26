import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import type { Child, UserRole } from '../types';

function getInviteRoles(userRole: UserRole | undefined): UserRole[] {
  if (userRole === 'admin') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'parent') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'schoolAdmin') return ['caregiver'];
  return [];
}

export function useProfiles() {
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

  const handleAcceptInvite = async (token: string): Promise<boolean> => {
    return await acceptInvite(token);
  };

  return {
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    showAddChild,
    setShowAddChild,
    childName,
    setChildName,
    childDob,
    setChildDob,
    removeTargetId,
    setRemoveTargetId,
    removeConfirmText,
    setRemoveConfirmText,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    statusMessage,
    setStatusMessage,
    inviteRoles,
    isAdmin,
    isParent,
    canManageChildren,
    canManageInvites,
    pendingReceivedInvites,
    sentInvites,
    unreadNotifications,
    notifications,
    handleAddChild,
    handleToggleRemoveChild,
    handleRemoveChild,
    handleCancelRemove,
    handleInvite,
    handleAcceptInvite,
    createInvite,
    acceptInvite,
    markNotificationRead,
  };
}
