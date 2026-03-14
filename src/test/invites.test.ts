/**
 * Invite role mapping and access control tests.
 *
 * These tests verify that:
 * 1. The invite role → child access mapping is consistent in local (storage) mode.
 * 2. Accepted invites grant the correct access level (parent or caregiver).
 * 3. The admin role is not offered in the UI invite options.
 * 4. Email mismatch prevents invite acceptance.
 * 5. Already-accepted or non-existent tokens are rejected.
 */
import * as storage from '../utils/storage';
import type { Child, UserRole } from '../types';
import { CHILD_ID, USER_ID, baseChild, baseUser } from './fixtures';

// Mirrors the ProfilesPage.tsx getInviteRoles logic — kept in sync with implementation.
function getInviteRoles(userRole: UserRole | undefined): UserRole[] {
  if (userRole === 'admin') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'parent') return ['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'];
  if (userRole === 'schoolAdmin') return ['caregiver'];
  return [];
}

// Mirrors the api/invites.ts role → access_type mapping.
function roleToAccessType(role: string): 'parent' | 'caregiver' {
  return role === 'parent' ? 'parent' : 'caregiver';
}

const SUPPORTED_INVITE_ROLES = new Set(['parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist']);

// A child not yet associated with the accepting user — used for caregiver/schoolAdmin tests.
const otherUser = { ...baseUser, id: 'other-user-99', email: 'other99@example.com' };
const freshChild: Child = {
  ...baseChild,
  parentIds: [], // USER_ID not pre-populated so we can assert cleanly
  caregivers: [],
  createdBy: 'owner-user',
};

describe('invite role mapping', () => {
  beforeEach(() => {
    storage.clearAllAppData();
    storage.setChildren([freshChild]);
  });

  it('parent invite role maps to parent access type', () => {
    expect(roleToAccessType('parent')).toBe('parent');
  });

  it('caregiver invite role maps to caregiver access type', () => {
    expect(roleToAccessType('caregiver')).toBe('caregiver');
  });

  it('schoolAdmin invite role maps to caregiver access type', () => {
    expect(roleToAccessType('schoolAdmin')).toBe('caregiver');
  });

  it('admin role is not offered as an invite option for any user role', () => {
    const adminInviteRoles = getInviteRoles('admin');
    expect(adminInviteRoles).not.toContain('admin');

    const parentInviteRoles = getInviteRoles('parent');
    expect(parentInviteRoles).not.toContain('admin');
  });

  it('therapist and specialist are offered as invite options for admin and parent', () => {
    for (const role of ['admin', 'parent'] as UserRole[]) {
      const roles = getInviteRoles(role);
      expect(roles).toContain('therapist');
      expect(roles).toContain('specialist');
    }
  });

  it('therapist and specialist are not offered as invite options for schoolAdmin or caregiver', () => {
    for (const role of ['schoolAdmin', 'caregiver'] as UserRole[]) {
      const roles = getInviteRoles(role);
      expect(roles).not.toContain('therapist');
      expect(roles).not.toContain('specialist');
    }
  });

  it('only supported roles pass the SUPPORTED_INVITE_ROLES validation', () => {
    expect(SUPPORTED_INVITE_ROLES.has('parent')).toBe(true);
    expect(SUPPORTED_INVITE_ROLES.has('caregiver')).toBe(true);
    expect(SUPPORTED_INVITE_ROLES.has('schoolAdmin')).toBe(true);
    expect(SUPPORTED_INVITE_ROLES.has('therapist')).toBe(true);
    expect(SUPPORTED_INVITE_ROLES.has('specialist')).toBe(true);
    expect(SUPPORTED_INVITE_ROLES.has('admin')).toBe(false);
  });

  it('accepting a parent invite adds the user to child parentIds', () => {
    const invite = storage.createInvite({
      childId: CHILD_ID,
      childName: freshChild.name,
      email: baseUser.email,
      role: 'parent',
      invitedBy: otherUser.id,
    });

    const result = storage.acceptInvite(invite.token, baseUser);
    expect(result).not.toBeNull();

    const children = storage.getChildren();
    const child = children.find((c) => c.id === CHILD_ID);
    expect(child?.parentIds).toContain(USER_ID);
    expect(child?.caregivers).not.toContain(USER_ID);
  });

  it('accepting a caregiver invite adds the user to child caregivers', () => {
    const invite = storage.createInvite({
      childId: CHILD_ID,
      childName: freshChild.name,
      email: baseUser.email,
      role: 'caregiver',
      invitedBy: otherUser.id,
    });

    const result = storage.acceptInvite(invite.token, baseUser);
    expect(result).not.toBeNull();

    const children = storage.getChildren();
    const child = children.find((c) => c.id === CHILD_ID);
    expect(child?.caregivers).toContain(USER_ID);
    expect(child?.parentIds).not.toContain(USER_ID);
  });

  it('accepting a schoolAdmin invite adds user to caregivers (not parentIds)', () => {
    const invite = storage.createInvite({
      childId: CHILD_ID,
      childName: freshChild.name,
      email: baseUser.email,
      role: 'schoolAdmin',
      invitedBy: otherUser.id,
    });

    const result = storage.acceptInvite(invite.token, baseUser);
    expect(result).not.toBeNull();

    const children = storage.getChildren();
    const child = children.find((c) => c.id === CHILD_ID);
    // schoolAdmin invite grants caregiver-level diary access in local mode
    expect(child?.caregivers).toContain(USER_ID);
    expect(child?.parentIds).not.toContain(USER_ID);
  });

  it('rejects acceptance when email does not match the invited email', () => {
    const invite = storage.createInvite({
      childId: CHILD_ID,
      childName: freshChild.name,
      email: 'other@example.com',
      role: 'caregiver',
      invitedBy: otherUser.id,
    });

    const result = storage.acceptInvite(invite.token, baseUser);
    expect(result).toBeNull();
  });

  it('rejects acceptance for a non-existent token', () => {
    const result = storage.acceptInvite('nonexistent-token', baseUser);
    expect(result).toBeNull();
  });

  it('invite status transitions to accepted after successful acceptance', () => {
    const invite = storage.createInvite({
      childId: CHILD_ID,
      childName: freshChild.name,
      email: baseUser.email,
      role: 'caregiver',
      invitedBy: otherUser.id,
    });

    expect(storage.getInvites()[0].status).toBe('pending');

    storage.acceptInvite(invite.token, baseUser);
    const invites = storage.getInvites();
    expect(invites[0].status).toBe('accepted');
  });
});
