import { AlertTriangle, Baby, Trash2 } from 'lucide-react';

interface ChildProfilesProps {
  children: any[];
  selectedChildId: string | null;
  selectChild: (id: string) => void;
  canManageChildren: boolean;
  removeTargetId: string | null;
  removeConfirmText: string;
  setRemoveConfirmText: (v: string) => void;
  handleToggleRemoveChild: (id: string) => void;
  handleRemoveChild: (id: string) => void;
  handleCancelRemove: () => void;
  showAddChild: boolean;
  childName: string;
  setChildName: (v: string) => void;
  childDob: string;
  setChildDob: (v: string) => void;
  handleAddChild: (e: React.FormEvent) => void;
}

export default function ChildProfiles(props: ChildProfilesProps) {
  const {
    children: kids,
    selectedChildId,
    selectChild,
    canManageChildren,
    removeTargetId,
    removeConfirmText,
    setRemoveConfirmText,
    handleToggleRemoveChild,
    handleRemoveChild,
    handleCancelRemove,
    showAddChild,
    childName,
    setChildName,
    childDob,
    setChildDob,
    handleAddChild,
  } = props;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Baby size={16} className="text-lavender-500" /> Child profiles
        </h3>
        {canManageChildren && (
          <button onClick={() => { setChildName(''); setChildDob(''); }} className="text-xs font-semibold text-lavender-600">
            + Add child
          </button>
        )}
      </div>

      <div className="space-y-2">
        {kids.map((child) => (
          <div key={child.id} className="relative">
            <button
              onClick={() => selectChild(child.id)}
              className={`w-full rounded-2xl p-4 text-left ring-1 transition-all ${
                selectedChildId === child.id ? 'bg-lavender-50 ring-lavender-200' : 'bg-[var(--bg-accent)] ring-[var(--border-color)]'
              }`}
            >
              <div className="text-sm font-semibold text-[var(--text-primary)]">{child.name}</div>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">{child.dateOfBirth || 'DOB not recorded'}</div>
              {selectedChildId === child.id && (
                <span className="mt-1 inline-block rounded-full bg-lavender-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Selected
                </span>
              )}
            </button>

            {canManageChildren && (
              <button
                onClick={() => handleToggleRemoveChild(child.id)}
                className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-400 transition hover:bg-rose-100"
                title={`Remove ${child.name}`}
              >
                <Trash2 size={14} />
              </button>
            )}

            {removeTargetId === child.id && (
              <div className="mt-2 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
                <div className="mb-3 flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                  <div>
                    <p className="text-sm font-semibold text-rose-700">Remove {child.name}?</p>
                    <p className="mt-1 text-xs text-rose-600">
                      This action is <strong>irreversible</strong>. All diary entries, sleep records, food logs, and toilet attempt data for this child will be permanently deleted.
                    </p>
                  </div>
                </div>
                <p className="mb-2 text-xs text-rose-600">
                  Type <strong>{child.name}</strong> to confirm:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={removeConfirmText}
                    onChange={(e) => setRemoveConfirmText(e.target.value)}
                    placeholder={child.name}
                    className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                  />
                  <button
                    onClick={() => handleRemoveChild(child.id)}
                    disabled={removeConfirmText !== child.name}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleCancelRemove}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {kids.length === 0 && (
          <div className="rounded-2xl bg-[var(--bg-accent)] px-4 py-6 text-center text-sm text-gray-500 ring-1 ring-lavender-100">
            No children added yet. Use the button above to add a child profile.
          </div>
        )}
      </div>

      {showAddChild && canManageChildren && (
        <form onSubmit={handleAddChild} className="mt-4 space-y-3 rounded-2xl bg-[var(--bg-accent)] p-4 ring-1 ring-lavender-100">
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
          <button className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white">Save child profile</button>
        </form>
      )}
    </section>
  );
}
