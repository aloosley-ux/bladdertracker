import { Shield } from 'lucide-react';

interface AccessInfoProps {
  selectedChild: { name: string; parentIds: string[]; caregivers: string[] } | null;
}

export default function AccessInfo({ selectedChild }: AccessInfoProps) {
  if (!selectedChild) return null;

  const hasParents = selectedChild.parentIds.length > 0;
  const hasCaregivers = selectedChild.caregivers.length > 0;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
          <Shield size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700">Who can see / edit {selectedChild.name}</h2>
          <p className="mt-1 text-xs text-gray-400">People with access to this child's diary.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {hasParents && (
          <div className="rounded-2xl bg-[var(--bg-accent)] px-4 py-3 ring-1 ring-lavender-100">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Parents</div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {selectedChild.parentIds.length} parent{selectedChild.parentIds.length === 1 ? '' : 's'} linked
            </div>
          </div>
        )}
        {hasCaregivers && (
          <div className="rounded-2xl bg-[var(--bg-accent)] px-4 py-3 ring-1 ring-lavender-100">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Caregivers</div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {selectedChild.caregivers.length} caregiver{selectedChild.caregivers.length === 1 ? '' : 's'} linked
            </div>
          </div>
        )}
        {!hasParents && !hasCaregivers && (
          <p className="text-sm text-gray-500">No one else has access yet. Send an invite above.</p>
        )}
      </div>
    </section>
  );
}
