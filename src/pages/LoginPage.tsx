import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/useApp';
import { createPasswordCredentials, verifyPassword } from '../utils/auth';
import {
  acceptInvite as acceptInviteInStorage,
  findAccountByEmail,
  generateId,
  getPendingInvitesByEmail,
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

export default function LoginPage() {
  const { login } = useApp();
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
  const pendingInvites = useMemo(() => (email ? getPendingInvitesByEmail(email) : []), [email]);

  const finalizeLogin = (user: User) => {
    login(user);
    if (inviteToken) {
      const accepted = acceptInviteInStorage(inviteToken, user);
      setMessage(
        accepted
          ? 'Welcome back — your secure invite has been accepted.'
          : 'Signed in successfully. The invite link could not be matched to this account.'
      );
      return;
    }

    setMessage('Signed in successfully. Your diary is ready.');
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 8) {
      setError('Passwords must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (findAccountByEmail(email)) {
      setError('An account with this email already exists.');
      setMode('login');
      return;
    }

    setSubmitting(true);
    try {
      const credentials = await createPasswordCredentials(password);
      const account: AccountRecord = {
        id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        createdAt: new Date().toISOString(),
        ...credentials,
      };

      registerAccount(account);
      finalizeLogin(toUser(account));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const account = findAccountByEmail(email);
    if (!account) {
      setError('No account exists with that email yet.');
      setMode('register');
      return;
    }

    setSubmitting(true);
    try {
      const isValidPassword = await verifyPassword(password, account.passwordHash, account.passwordSalt);
      if (!isValidPassword) {
        setError('Incorrect password. Please try again.');
        return;
      }

      finalizeLogin(toUser(account));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const account = findAccountByEmail(email);
    if (!account) {
      setError('No account exists with that email yet.');
      return;
    }

    if (password.length < 8) {
      setError('Please enter a new password with at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const credentials = await createPasswordCredentials(password);
      const updatedUser = updateAccountPassword(account.id, credentials.passwordHash, credentials.passwordSalt);
      if (!updatedUser) {
        setError('We could not reset your password. Please try again.');
        return;
      }

      finalizeLogin(updatedUser);
    } finally {
      setSubmitting(false);
    }
  };

  const submitHandler = mode === 'register' ? handleRegister : mode === 'login' ? handleLogin : handleReset;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f1ff] via-[#fbf7f2] to-white px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-sm flex-col justify-center gap-6">
        <section className="rounded-[2rem] bg-white/80 px-6 pb-6 pt-8 text-center shadow-[0_30px_80px_rgba(139,77,255,0.12)] ring-1 ring-white/70 backdrop-blur">
          <div className="mx-auto mb-6 flex h-52 w-full max-w-[15rem] items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,#f2e7ff_0%,#eef8ff_60%,#ffffff_100%)]">
            <div className="relative flex h-40 w-32 items-center justify-center rounded-[40%] border border-white/70 bg-white shadow-xl">
              <div className="absolute -top-5 left-4 h-10 w-10 rounded-full bg-slate-100" />
              <div className="absolute -top-5 right-4 h-10 w-10 rounded-full bg-slate-100" />
              <div className="absolute inset-x-4 top-9 rounded-[999px] bg-[#203674] px-4 py-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="h-6 w-6 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
                  <span className="h-6 w-6 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
                </div>
              </div>
              <div className="absolute bottom-8 h-16 w-16 rounded-[1.4rem] bg-gradient-to-b from-cyan-200 to-sky-400 shadow-inner" />
              <div className="absolute -bottom-3 left-5 h-10 w-7 rounded-full bg-[#28478f]" />
              <div className="absolute -bottom-3 right-5 h-10 w-7 rounded-full bg-[#28478f]" />
            </div>
          </div>

          <p className="text-sm font-semibold text-lavender-600">BladderTracker</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Smarter journaling for families and schools
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Secure diary accounts, caregiver invites, and calm school-ready journaling inspired by the attached UI reference.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-left text-[11px] text-gray-600">
            <FeaturePill icon={<ShieldCheck size={14} />} label="Secure sign-in" />
            <FeaturePill icon={<Mail size={14} />} label="Email invites" />
            <FeaturePill icon={<Sparkles size={14} />} label="Pastel cards" />
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_rgba(20,20,43,0.08)] ring-1 ring-black/5">
          <div className="mb-5 grid grid-cols-3 rounded-2xl bg-[#f6f1ff] p-1 text-sm">
            {(['register', 'login', 'reset'] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError('');
                  setMessage('');
                }}
                className={`rounded-2xl px-3 py-2 font-medium transition-all ${
                  mode === item ? 'bg-white text-lavender-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                {item === 'register' ? 'Get started' : item === 'login' ? 'Sign in' : 'Reset'}
              </button>
            ))}
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            {mode === 'register' && (
              <Field label="Full name">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Amina Patel"
                  className="input-card"
                  required
                />
              </Field>
            )}

            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.org"
                className="input-card"
                required
              />
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
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="input-card pl-11"
                  required
                />
              </div>
            </Field>

            {mode !== 'login' && (
              <Field label={mode === 'reset' ? 'Confirm new password' : 'Confirm password'}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  className="input-card"
                  required
                />
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
        </section>
      </div>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center shadow-sm ring-1 ring-lavender-100">
      <div className="mb-1 flex justify-center text-lavender-600">{icon}</div>
      <span>{label}</span>
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
