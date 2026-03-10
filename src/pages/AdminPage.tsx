import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Crown, Key, Shield, Trash2, UserCog, Users } from 'lucide-react';
import { useApp } from '../context/useApp';
import {
  deleteAccount,
  getAllAccounts,
  getAuditEvents,
  getChildren as getAllChildren,
  updateAccountPassword,
  updateAccountRole,
} from '../utils/storage';
import { createPasswordCredentials } from '../utils/auth';
import BrandBanner from '../components/BrandBanner';
import type { UserRole } from '../types';

const allRoles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'parent', label: 'Parent' },
  { value: 'schoolAdmin', label: 'School Admin' },
  { value: 'caregiver', label: 'Caregiver' },
];

export default function AdminPage() {
  const { user, login } = useApp();
  const [accounts, setAccounts] = useState(getAllAccounts());
  const [allChildren] = useState(() => getAllChildren());
  const [auditEvents] = useState(() => getAuditEvents());
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = updateAccountRole(userId, newRole);
    if (updated) {
      setAccounts(getAllAccounts());
      setMessage(`Role updated to ${newRole} for ${updated.name}.`);
      // If changing own role, update session
      if (userId === user?.id) {
        login({ ...user!, role: newRole });
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }
    const credentials = await createPasswordCredentials(newPassword);
    const updated = updateAccountPassword(userId, credentials.passwordHash, credentials.passwordSalt);
    if (updated) {
      setMessage(`Password reset for ${updated.name}.`);
      setResetPasswordId(null);
      setNewPassword('');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const account = accounts.find((a) => a.id === userId);
    if (!account) return;
    if (deleteConfirmText !== account.email) {
      setMessage('Type the user\'s email exactly to confirm deletion.');
      return;
    }
    const success = deleteAccount(userId);
    if (success) {
      setAccounts(getAllAccounts());
      setMessage(`Account ${account.email} deleted.`);
      setDeleteConfirmId(null);
      setDeleteConfirmText('');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="pb-20">
        <BrandBanner />
        <div className="px-4 pt-4">
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <Crown size={32} className="mx-auto text-gray-300" />
            <h1 className="mt-3 text-lg font-bold text-gray-900">Admin access required</h1>
            <p className="mt-2 text-sm text-gray-500">This page is only accessible to administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4">
        <BrandBanner />
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="mt-1 text-base font-bold text-gray-900">
            <Crown size={16} className="inline -mt-0.5 mr-1 text-amber-500" />
            Admin Panel
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">Manage users, roles, passwords, and view all system data.</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {message && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
            <button onClick={() => setMessage('')} className="ml-2 text-emerald-500 font-semibold">✕</button>
          </div>
        )}

        {/* User Accounts */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
            <UserCog size={16} className="text-lavender-500" /> User accounts ({accounts.length})
          </h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="rounded-[1.5rem] bg-[#faf7ff] p-4 ring-1 ring-lavender-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      {account.name}
                      {account.id === user?.id && (
                        <span className="text-[10px] bg-lavender-100 text-lavender-700 px-2 py-0.5 rounded-full font-bold">You</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{account.email}</div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Joined {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={account.role}
                      onChange={(e) => handleRoleChange(account.id, e.target.value as UserRole)}
                      aria-label={`Role for ${account.name}`}
                      className="rounded-xl border border-lavender-100 bg-white px-2 py-1.5 text-xs font-semibold text-lavender-700 outline-none"
                    >
                      {allRoles.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setResetPasswordId(resetPasswordId === account.id ? null : account.id); setNewPassword(''); }}
                        className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                      >
                        <Key size={10} /> Reset pw
                      </button>
                      {account.id !== user?.id && (
                        <button
                          onClick={() => { setDeleteConfirmId(deleteConfirmId === account.id ? null : account.id); setDeleteConfirmText(''); }}
                          className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reset password form */}
                {resetPasswordId === account.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 chars)"
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-lavender-400"
                    />
                    <button
                      onClick={() => handleResetPassword(account.id)}
                      className="rounded-xl bg-lavender-500 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Reset
                    </button>
                  </div>
                )}

                {/* Delete confirmation */}
                {deleteConfirmId === account.id && (
                  <div className="mt-3 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
                    <p className="text-xs text-rose-700 font-medium mb-2">
                      ⚠️ This is irreversible. Type <strong>{account.email}</strong> to confirm:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder={account.email}
                        className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                      />
                      <button
                        onClick={() => handleDeleteUser(account.id)}
                        disabled={deleteConfirmText !== account.email}
                        className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* All Children */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Users size={16} className="text-lavender-500" /> All children ({allChildren.length})
          </h3>
          <div className="space-y-2">
            {allChildren.map((child) => (
              <div key={child.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                <div className="text-sm font-semibold text-gray-900">{child.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {child.dateOfBirth || 'DOB not recorded'} · {child.parentIds.length} parent{child.parentIds.length !== 1 ? 's' : ''} · {child.caregivers.length} caregiver{child.caregivers.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
            {allChildren.length === 0 && <p className="text-sm text-gray-500">No children registered.</p>}
          </div>
        </section>

        {/* Full Audit Trail */}
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Shield size={16} className="text-lavender-500" /> Full audit trail ({auditEvents.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditEvents.map((event) => (
              <div key={event.id} className="rounded-[1.5rem] bg-[#faf7ff] px-4 py-3 ring-1 ring-lavender-100">
                <div className="text-sm font-semibold text-gray-900">{event.action}</div>
                <div className="mt-0.5 text-xs text-gray-500">{event.detail}</div>
                <div className="mt-1 text-[11px] text-gray-400">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
            {auditEvents.length === 0 && <p className="text-sm text-gray-500">No audit events.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
