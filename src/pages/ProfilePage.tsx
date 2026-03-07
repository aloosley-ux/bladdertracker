import { useState } from 'react';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import { LogOut, UserPlus, Download, Baby, Shield, Trash2 } from 'lucide-react';
import type { Child } from '../types';

export default function ProfilePage() {
  const { user, children, logout, addChild, exportData, selectedChild, selectChild } = useApp();
  const [showAddChild, setShowAddChild] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

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
    setChildName('');
    setChildDob('');
    setShowAddChild(false);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    // In a real app, this would send an email invitation
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInvite(false);
      setInviteEmail('');
    }, 2000);
  };

  return (
    <div className="pb-20">
      <div className="bg-white px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-gray-800">Profile &amp; Settings</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* User info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-lavender-100 flex items-center justify-center text-2xl">
              {user?.role === 'parent' ? '👨‍👩‍👧' : '🤝'}
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{user?.name}</h2>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              {user?.email && <p className="text-xs text-gray-400">{user.email}</p>}
            </div>
          </div>
        </div>

        {/* Children */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Baby size={16} className="text-lavender-500" /> Children
            </h3>
            <button
              onClick={() => setShowAddChild(!showAddChild)}
              className="text-xs text-lavender-600 font-medium hover:text-lavender-700"
            >
              + Add Child
            </button>
          </div>

          <div className="space-y-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => selectChild(child.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  selectedChild?.id === child.id
                    ? 'bg-lavender-50 border-2 border-lavender-300'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-lavender-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-lavender-200 flex items-center justify-center text-sm">
                  👶
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{child.name}</div>
                  {child.dateOfBirth && (
                    <div className="text-[10px] text-gray-400">DOB: {child.dateOfBirth}</div>
                  )}
                </div>
                {selectedChild?.id === child.id && (
                  <span className="text-[10px] bg-lavender-500 text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>

          {showAddChild && (
            <form onSubmit={handleAddChild} className="mt-3 space-y-3 p-3 bg-lavender-50 rounded-xl">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Child's name"
                className="w-full px-3 py-2 rounded-lg border border-lavender-200 text-sm focus:border-lavender-400 outline-none"
                required
              />
              <input
                type="date"
                value={childDob}
                onChange={(e) => setChildDob(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-lavender-200 text-sm focus:border-lavender-400 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-lavender-500 text-white rounded-lg text-sm font-medium"
              >
                Add Child
              </button>
            </form>
          )}
        </div>

        {/* Invite caregiver */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <UserPlus size={16} className="text-lavender-500" /> Invite Caregiver
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Invite another caregiver to help track {selectedChild?.name}&apos;s diary
          </p>

          {showInvite ? (
            <form onSubmit={handleInvite} className="space-y-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Caregiver's email"
                className="w-full px-3 py-2 rounded-lg border border-lavender-200 text-sm focus:border-lavender-400 outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-lavender-500 text-white rounded-lg text-sm font-medium"
              >
                {inviteSent ? '✅ Invite Sent!' : 'Send Invite'}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowInvite(true)}
              className="w-full py-2.5 border-2 border-dashed border-lavender-200 text-lavender-600 rounded-xl text-sm font-medium hover:bg-lavender-50 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={14} /> Send Invitation
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-2">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Shield size={16} className="text-lavender-500" /> Actions
          </h3>

          <button
            onClick={exportData}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-lavender-50 transition-all text-left"
          >
            <Download size={16} className="text-lavender-500" />
            <div>
              <div className="text-sm font-medium text-gray-700">Export Diary (CSV)</div>
              <div className="text-[10px] text-gray-400">Download data for clinic visits</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('Clear all data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-all text-left"
          >
            <Trash2 size={16} className="text-red-400" />
            <div>
              <div className="text-sm font-medium text-red-500">Clear All Data</div>
              <div className="text-[10px] text-gray-400">Remove all entries permanently</div>
            </div>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-all text-left"
          >
            <LogOut size={16} className="text-red-400" />
            <div>
              <div className="text-sm font-medium text-red-500">Sign Out</div>
              <div className="text-[10px] text-gray-400">Log out of your account</div>
            </div>
          </button>
        </div>

        {/* Clinical info */}
        <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">📋 Clinical Information</h3>
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Constipation signs:</strong> Hard, pellet-like stools (Bristol Type 1-2),
              straining, infrequent bowel movements (&lt;3 per week), or abdominal discomfort.
            </p>
            <p>
              <strong>Bladder health:</strong> Children should drink 6-8 cups daily and visit the
              toilet every 2-3 hours. Holding urine can lead to urinary tract infections.
            </p>
            <p>
              <strong>When to seek help:</strong> If your child has persistent constipation,
              soiling accidents, blood in stools, or frequent urinary symptoms, consult your
              GP or paediatrician.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
