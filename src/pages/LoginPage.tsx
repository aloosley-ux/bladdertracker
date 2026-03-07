import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/useApp';
import { createPasswordCredentials, verifyPassword } from '../utils/auth';
import * as api from '../utils/api';
import {
  findAccountByEmail,
  generateId,
  getPendingInvitesByEmail,
  normaliseEmail,
  registerAccount,
  toUser,
  updateAccountPassword,
} from '../utils/storage';
import type { AccountRecord, User, UserRole } from '../types';

type AuthMode = 'register' | 'login' | 'reset';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'parent', label: 'Parent' },
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'schoolAdmin', label: 'School admin' },
];

function isCloudMode(): boolean {
  return !!import.meta.env.VITE_USE_CLOUD;
}

export default function LoginPage() {
  const { login, acceptInvite } = useApp();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inviteToken = searchParams.get('invite');
  const cloud = isCloudMode();
  const pendingInvites = useMemo(
    () => (!cloud && email ? getPendingInvitesByEmail(normaliseEmail(email)) : []),
    [cloud, email],
  );

  const finalizeLogin = async (user: User) => {
    login(user);
    if (inviteToken) {
      const accepted = await acceptInvite(inviteToken);
      setMessage(
        accepted
          ? 'Welcome — your secure invite has been accepted.'
          : 'Signed in successfully. The invite link could not be matched to this account.',
      );
      return;
    }
    setMessage('Signed in successfully. Your diary is ready.');
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 8) { setError('Passwords must be at least 8 characters long.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    try {
      if (cloud) {
        const user = await api.apiRegister(name.trim(), email, password, role);
        await finalizeLogin(user);
      } else {
        if (findAccountByEmail(email)) { setError('An account with this email already exists.'); setMode('login'); return; }
        const credentials = await createPasswordCredentials(password);
        const account: AccountRecord = {
          id: generateId(),
          name: name.trim(),
          email: normaliseEmail(email),
          role,
          createdAt: new Date().toISOString(),
          ...credentials,
        };
        registerAccount(account);
        await finalizeLogin(toUser(account));
      }
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    setSubmitting(true);
    try {
      if (cloud) {
        const user = await api.apiLogin(email, password);
        await finalizeLogin(user);
      } else {
        const account = findAccountByEmail(email);
        if (!account) { setError('No account exists with that email yet.'); setMode('register'); return; }
        const isValid = await verifyPassword(password, account.passwordHash, account.passwordSalt);
        if (!isValid) { setError('Incorrect password. Please try again.'); return; }
        await finalizeLogin(toUser(account));
      }
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) { setError('Please enter a new password with at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    try {
      if (cloud) {
        const user = await api.apiResetPassword(email, password);
        await finalizeLogin(user);
      } else {
        const account = findAccountByEmail(email);
        if (!account) { setError('No account exists with that email yet.'); return; }
        const credentials = await createPasswordCredentials(password);
        const updatedUser = updateAccountPassword(account.id, credentials.passwordHash, credentials.passwordSalt);
        if (!updatedUser) { setError('We could not reset your password. Please try again.'); return; }
        await finalizeLogin(updatedUser);
      }
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : 'Password reset failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitHandler = mode === 'register' ? handleRegister : mode === 'login' ? handleLogin : handleReset;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f1ff] via-[#fbf7f2] to-white px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-sm flex-col justify-center">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(139,77,255,0.12)] ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-[radial-gradient(ellipse_at_top,#f2e7ff_0%,#eef8ff_50%,#ffffff_100%)] px-6 pb-5 pt-7 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <div className="relative flex h-[4.5rem] w-14 items-center justify-center rounded-[40%] border border-white/70 bg-white shadow-lg">
                <div className="absolute -top-2.5 left-1 h-5 w-5 rounded-full bg-slate-100" />
                <div className="absolute -top-2.5 right-1 h-5 w-5 rounded-full bg-slate-100" />
                <div className="absolute inset-x-1.5 top-4 rounded-[999px] bg-[#203674] px-2 py-2 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                  </div>
                </div>
                <div className="absolute bottom-3 h-6 w-6 rounded-lg bg-gradient-to-b from-cyan-200 to-sky-400 shadow-inner" />
                <div className="absolute -bottom-1.5 left-2 h-4 w-3 rounded-full bg-[#28478f]" />
                <div className="absolute -bottom-1.5 right-2 h-4 w-3 rounded-full bg-[#28478f]" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wide text-lavender-500 uppercase">BladderTracker</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Smarter journaling for families &amp; schools
            </h1>
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1"><ShieldCheck size={12} className="text-lavender-400" /> Secure</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1"><Mail size={12} className="text-lavender-400" /> Invites</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1"><Sparkles size={12} className="text-lavender-400" /> {cloud ? 'Cloud sync' : 'Private'}</span>
            </div>
          </div>

          {/* Tabs + Form */}
          <div className="px-5 pb-6 pt-4">
            <div className="mb-5 grid grid-cols-3 rounded-2xl bg-[#f6f1ff] p-1 text-sm">
              {(['register', 'login', 'reset'] as AuthMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => { setMode(item); setError(''); setMessage(''); }}
                  className={`rounded-2xl px-3 py-2 font-medium transition-all ${
                    mode === item ? 'bg-white text-lavender-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {item === 'register' ? 'Get started' : item === 'login' ? 'Sign in' : 'Reset'}
                </button>
              ))}
            </div>

            <form onSubmit={submitHandler} className="space-y-3.5">
              {mode === 'register' && (
                <Field label="Full name">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amina Patel" className="input-card" required />
                </Field>
              )}

              <Field label="Email address">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.org" className="input-card" required />
              </Field>

              {mode === 'register' && (
                <Field label="Role">
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-all ${
                          role === option.value
                            ? 'border-lavender-300 bg-lavender-50 text-lavender-700'
                            : 'border-gray-200 text-gray-500 hover:border-lavender-200 hover:bg-lavender-50/60'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              <Field label={mode === 'reset' ? 'New password' : 'Password'}>
                <div className="relative">
                  <LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="input-card pl-11" required />
                </div>
              </Field>

              {mode !== 'login' && (
                <Field label={mode === 'reset' ? 'Confirm new password' : 'Confirm password'}>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className="input-card" required />
                </Field>
              )}

              {pendingInvites.length > 0 && (
                <div className="rounded-2xl border border-lavender-100 bg-lavender-50 px-4 py-3 text-xs text-lavender-800">
                  {pendingInvites.length} secure invite{pendingInvites.length > 1 ? 's are' : ' is'} waiting for this email.
                </div>
              )}

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
              {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(139,77,255,0.28)] transition-all hover:bg-lavender-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? 'Please wait…'
                  : mode === 'register'
                    ? 'Get started'
                    : mode === 'login'
                      ? 'Sign in securely'
                      : 'Reset password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
