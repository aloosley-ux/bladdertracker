import { useState } from 'react';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import type { User, Child } from '../types';

export default function LoginPage() {
  const { login, addChild, user } = useApp();
  const [step, setStep] = useState<'login' | 'addChild'>(user ? 'addChild' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'parent' | 'caregiver'>('parent');
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email: email.trim(),
      role,
    };
    login(newUser);
    setStep('addChild');
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    const child: Child = {
      id: generateId(),
      name: childName.trim(),
      dateOfBirth: childDob,
      caregivers: [],
    };
    addChild(child);
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🧸</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">BladderTracker</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track your child&apos;s bladder &amp; bowel diary
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-3xl p-6 shadow-lg shadow-lavender-100 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">I am a...</label>
              <div className="flex gap-3 mt-1">
                {(['parent', 'caregiver'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      role === r
                        ? 'bg-lavender-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
                    }`}
                  >
                    {r === 'parent' ? '👨‍👩‍👧 Parent' : '🤝 Caregiver'}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👶</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Add Your Child</h1>
          <p className="text-gray-500 text-sm mt-1">
            Set up a profile for your child to start tracking
          </p>
        </div>

        <form onSubmit={handleAddChild} className="bg-white rounded-3xl p-6 shadow-lg shadow-lavender-100 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Child&apos;s Name</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter child's name"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none transition-all text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={childDob}
              onChange={(e) => setChildDob(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200"
          >
            Add Child &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
}
