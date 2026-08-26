import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Crown, Download, FileUp, Globe, HelpCircle, LogOut, Settings, Shield, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DueDateEditor } from '../leaps';

interface SettingsFormsProps {
  children: any[];
  selectedChild: any;
  selectChild: (id: string) => void;
  canManageChildren: boolean;
  dueDateTargetId: string | null;
  setDueDateTargetId: (id: string | null) => void;
  removeTargetId: string | null;
  setRemoveTargetId: (id: string | null) => void;
  removeConfirmText: string;
  setRemoveConfirmText: (v: string) => void;
  handleSaveDueDate: (child: any, date: string, useAsDue?: boolean) => void;
  handleRemoveChild: (childId: string) => void;
  showAddChild: boolean;
  setShowAddChild: (v: boolean) => void;
  childName: string;
  setChildName: (v: string) => void;
  childDob: string;
  setChildDob: (v: string) => void;
  handleAddChild: (e: React.FormEvent) => void;
  exportData: () => void;
  importMessage: string;
  importing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  templateHints: string[];
  selectedChildId: string | null;
  cloud: boolean;
  showClearConfirm: boolean;
  setShowClearConfirm: (v: boolean) => void;
  clearConfirmText: string;
  setClearConfirmText: (v: string) => void;
  handleClearAllData: () => void;
  showDeleteAccount: boolean;
  setShowDeleteAccount: (v: boolean) => void;
  deleteAccountText: string;
  setDeleteAccountText: (v: string) => void;
  handleDeleteAccount: () => void;
  visibleAudit: any[];
  logout: () => void;
  isAdmin: boolean;
}

export function SettingsForms({
  children,
  selectedChild,
  selectChild,
  canManageChildren,
  dueDateTargetId,
  setDueDateTargetId,
  removeTargetId,
  setRemoveTargetId,
  removeConfirmText,
  setRemoveConfirmText,
  handleSaveDueDate,
  handleRemoveChild,
  showAddChild,
  setShowAddChild,
  childName,
  setChildName,
  childDob,
  setChildDob,
  handleAddChild,
  exportData,
  importMessage,
  importing,
  fileInputRef,
  handleImport,
  templateHints,
  selectedChildId,
  cloud,
  showClearConfirm,
  setShowClearConfirm,
  clearConfirmText,
  setClearConfirmText,
  handleClearAllData,
  showDeleteAccount,
  setShowDeleteAccount,
  deleteAccountText,
  setDeleteAccountText,
  handleDeleteAccount,
  visibleAudit,
  logout,
  isAdmin,
}: SettingsFormsProps) {
  return (
    <>
      {/* Child Profiles */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Settings size={16} className="text-violet-500" /> Child profiles
          </h3>
          {canManageChildren && (
            <button onClick={() => setShowAddChild(!showAddChild)} className="text-xs font-semibold text-violet-600">
              + Add child
            </button>
          )}
        </div>

        <div className="space-y-2">
          {children.map((child) => (
            <div key={child.id} className="relative">
              <button
                onClick={() => selectChild(child.id)}
                className={`w-full rounded-2xl p-4 text-left ring-1 transition-all ${
                  selectedChild?.id === child.id ? 'bg-violet-50 ring-violet-200' : 'bg-[var(--muted)] ring-[var(--border)]'
                }`}
              >
                <div className="text-sm font-semibold text-[var(--foreground)]">{child.name}</div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {(() => {
                    const showDue = !!child.dueDate && !child.isBorn;
                    const label = showDue ? 'DUE' : 'DOB';
                    const value = child.dateOfBirth || child.dueDate || 'not recorded';
                    return `${label}: ${value}`;
                  })()}
                </div>
              </button>

              {canManageChildren && (
                <>
                  {child.dueDate && (
                    <div className="absolute right-28 top-3 text-xs font-semibold text-[var(--foreground)] uppercase">DUE</div>
                  )}
                  <button
                    onClick={() => {
                      setDueDateTargetId(dueDateTargetId === child.id ? null : child.id);
                    }}
                    className="absolute right-12 top-3 flex h-7 items-center gap-2 rounded-full bg-violet-50 px-3 text-xs font-semibold text-violet-600 ring-1 ring-violet-100 transition hover:bg-violet-100"
                    title={child.isBorn ? `Set DOB for ${child.name}` : `Set DOB for ${child.name}`}
                  >
                    {child.dateOfBirth || child.dueDate || 'Set DOB'}
                  </button>
                  <button
                    onClick={() => {
                      setRemoveTargetId(removeTargetId === child.id ? null : child.id);
                      setRemoveConfirmText('');
                    }}
                    className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-400 transition hover:bg-pink-100"
                    title={`Remove ${child.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}

              {dueDateTargetId === child.id && (
                <div className="mt-2 rounded-2xl bg-[var(--muted)] p-4 ring-1 ring-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-3">
                    💡 Setting {child.name}&apos;s date of birth helps developmental leap predictions. For children not yet born,
                    you can choose to treat this date as the expected due date until they are marked born.
                  </p>
                  <DueDateEditor
                    child={child}
                    mode="dob"
                    onSave={(d, useAsDue) => handleSaveDueDate(child, d, useAsDue)}
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setDueDateTargetId(null)}
                      className="mt-2 text-xs text-[var(--muted-foreground)] underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {removeTargetId === child.id && (
                <div className="mt-2 rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
                  <div className="mb-3 flex items-start gap-2">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-pink-500" />
                    <div>
                      <p className="text-sm font-semibold text-pink-700">Remove {child.name}?</p>
                      <p className="mt-1 text-xs text-pink-600">
                        This action is <strong>irreversible</strong>. All diary entries, sleep records, food logs, and
                        toilet attempt data for this child will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  <p className="mb-2 text-xs text-pink-600">
                    Type <strong>{child.name}</strong> to confirm:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={removeConfirmText}
                      onChange={(e) => setRemoveConfirmText(e.target.value)}
                      placeholder={child.name}
                      className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                    />
                    <button
                      onClick={() => handleRemoveChild(child.id)}
                      disabled={removeConfirmText !== child.name}
                      className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => {
                        setRemoveTargetId(null);
                        setRemoveConfirmText('');
                      }}
                      className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddChild && canManageChildren && (
          <form onSubmit={handleAddChild} className="mt-4 space-y-3 rounded-2xl bg-[var(--muted)] p-4 ring-1 ring-[var(--border)]">
            <input
              type="text"
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Child's name"
              className="input-card"
              required
            />
            <input
              type="date"
              value={childDob}
              onChange={(event) => setChildDob(event.target.value)}
              className="input-card"
            />
            <button className="w-full rounded-full bg-violet-500 px-4 py-3 text-sm font-semibold text-white">
              Save child profile
            </button>
          </form>
        )}
      </section>

      {/* Data & Privacy */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="data-privacy-heading">
        <h3 id="data-privacy-heading" className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Shield size={16} className="text-violet-500" /> Data &amp; Privacy
        </h3>
        <p className="mb-4 text-xs text-gray-400">
          Your data is stored securely. You have the right to export, import, or permanently delete your account and
          all associated records at any time.
        </p>

        <div className="space-y-2">
          {/* Export */}
          <button
            onClick={exportData}
            className="flex w-full items-center gap-3 rounded-2xl bg-violet-50 p-4 text-left ring-1 ring-violet-100 transition hover:bg-violet-100"
            aria-label="Export your diary data as a CSV file"
          >
            <Download size={18} className="text-violet-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Export my data</div>
              <div className="text-xs text-gray-500">
                Download {selectedChild?.name ? `${selectedChild.name}'s` : "the current child's"} diary as CSV.
              </div>
            </div>
          </button>

          {/* Import */}
          <div className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100">
            <div className="flex items-center gap-3">
              <Upload size={18} className="shrink-0 text-violet-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Import data</div>
                <div className="text-xs text-gray-500">
                  Upload a CSV, JSON, or Excel file for{' '}
                  {selectedChild?.name ?? 'the selected child'}.
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing || !selectedChildId}
                className="shrink-0 rounded-xl bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-600 disabled:opacity-40"
              >
                <FileUp size={14} className="mr-1 inline-block" />
                {importing ? 'Importing…' : 'Choose file'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.xlsx"
                onChange={handleImport}
                className="hidden"
                aria-label="Import diary data file"
              />
            </div>
            {importMessage && (
              <p className="mt-2 text-xs text-violet-700">{importMessage}</p>
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] font-medium text-violet-600">
                Template format hints
              </summary>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-[10px] text-gray-500">
                {templateHints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </details>
          </div>

          {/* Clear all data */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-[#fff4f5] p-4 text-left ring-1 ring-rose-100"
          >
            <Trash2 size={18} className="text-pink-500" />
            <div>
              <div className="text-sm font-semibold text-pink-600">Clear all data</div>
              <div className="text-xs text-gray-500">Remove all saved app data from this browser.</div>
            </div>
          </button>

          {showClearConfirm && (
            <div className="rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
              <div className="mb-3 flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-pink-500" />
                <div>
                  <p className="text-sm font-semibold text-pink-700">Clear all saved data?</p>
                  <p className="mt-1 text-xs text-pink-600">
                    This will <strong>permanently delete</strong> all accounts, children, diary entries, invites, and
                    audit history from this browser. This cannot be undone.
                  </p>
                </div>
              </div>
              <p className="mb-2 text-xs text-pink-600">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                />
                <button
                  onClick={handleClearAllData}
                  disabled={clearConfirmText !== 'DELETE'}
                  className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Clear all
                </button>
                <button
                  onClick={() => {
                    setShowClearConfirm(false);
                    setClearConfirmText('');
                  }}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete account (cloud only) */}
          {cloud && (
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="flex w-full items-center gap-3 rounded-2xl bg-pink-50 p-4 text-left ring-1 ring-rose-100 transition hover:bg-pink-100"
              aria-label="Permanently delete your account"
            >
              <Trash2 size={18} className="text-pink-500" />
              <div>
                <div className="text-sm font-semibold text-pink-700">Delete my account</div>
                <div className="text-xs text-pink-500">
                  Permanently removes your account and all data. Cannot be undone.
                </div>
              </div>
            </button>
          )}

          {showDeleteAccount && (
            <div className="rounded-2xl bg-pink-50 p-4 ring-1 ring-rose-200">
              <p className="mb-2 text-sm font-semibold text-pink-700">
                This will permanently delete your account and all data.
              </p>
              <p className="mb-3 text-xs text-pink-600">
                Type <strong>DELETE MY ACCOUNT</strong> to confirm:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteAccountText}
                  onChange={(e) => setDeleteAccountText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs outline-none focus:border-pink-400"
                  aria-label="Type DELETE MY ACCOUNT to confirm"
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountText !== 'DELETE MY ACCOUNT'}
                  className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteAccount(false);
                    setDeleteAccountText('');
                  }}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit trail */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-600">Recent audit trail</h4>
            <Link to="/audit-trail" className="text-xs font-semibold text-violet-600 underline underline-offset-2 hover:text-violet-700">
              View full history
            </Link>
          </div>
          <div className="space-y-2">
            {visibleAudit.map((event) => (
              <div key={event.id} className="rounded-2xl bg-[var(--card)] px-4 py-3 ring-1 ring-[var(--border)]">
                <div className="text-sm font-semibold text-gray-900">{event.action}</div>
                <div className="mt-1 text-xs text-gray-500">{event.detail}</div>
                <div className="mt-2 text-[11px] text-gray-400">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
            {visibleAudit.length === 0 && <p className="text-sm text-gray-500">No audit events yet.</p>}
          </div>
        </div>

        {/* GDPR link */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe size={14} className="text-violet-500" />
            <Link to="/gdpr" className="underline underline-offset-2 hover:text-violet-600">
              View our full GDPR &amp; Data Protection policy
            </Link>
          </div>
        </div>
      </section>

      {/* Help */}
      <Link
        to="/help"
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:bg-violet-50"
      >
        <HelpCircle size={18} className="text-violet-500" />
        <div>
          <div className="text-sm font-semibold text-gray-900">Help &amp; Support</div>
          <div className="text-xs text-gray-500">FAQs, guides, and contact information.</div>
        </div>
      </Link>

      {/* Admin panel link */}
      {isAdmin && (
        <Link
          to="/admin"
          className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-5 shadow-sm ring-1 ring-amber-200"
        >
          <Crown size={18} className="text-amber-500" />
          <div>
            <div className="text-sm font-semibold text-amber-800">Admin panel</div>
            <div className="text-xs text-amber-600">Manage users, roles, passwords, and system data.</div>
          </div>
        </Link>
      )}

      {/* Sign out */}
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:bg-pink-50"
      >
        <LogOut size={18} className="text-pink-500" />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">Sign out</div>
          <div className="text-xs text-gray-500">End your current session.</div>
        </div>
      </button>
    </>
  );
}
