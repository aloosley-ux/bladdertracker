import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
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
import BrandIcon from '../components/BrandIcon';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <div className="flex justify-center mb-1">
              <BrandIcon width={180} />
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
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
                  {/* Role description */}
                  <div className="rounded-xl bg-lavender-50 px-3 py-2 text-xs text-lavender-700 mt-2">
                    {role === 'parent' && 'Full access: manage children, log all entries, invite others, and export data.'}
                    {role === 'caregiver' && 'Can view and log entries for children you are invited to. Cannot manage child profiles or invites.'}
                    {role === 'schoolAdmin' && 'School-based access: log school-time entries (food, routine, toilet). Cannot manage profiles.'}
                  </div>
                </Field>
              )}

              <Field label={mode === 'reset' ? 'New password' : 'Password'}>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="input-card pl-11 pr-11 peer"
                    required
                  />
                  <LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity peer-focus:opacity-40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {mode !== 'login' && (
                <Field label={mode === 'reset' ? 'Confirm new password' : 'Confirm password'}>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="input-card pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
