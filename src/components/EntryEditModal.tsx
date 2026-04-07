import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import EntryEditForm from './EntryEditForm';

// EntryEditModal — modal wrapper around EntryEditForm with focus trap and keyboard handling.
export default function EntryEditModal({ type, entry, onSaved, onCancel }: {
  type: string;
  entry: unknown;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    // prevent background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  // focus trap + initial focus
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));
    const first = focusable[0];
    if (first) first.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focused = document.activeElement as HTMLElement | null;
      const idx = focusable.indexOf(focused as HTMLElement);
      if (e.shiftKey) {
        // move backward
        const prev = idx > 0 ? focusable[idx - 1] : focusable[focusable.length - 1];
        e.preventDefault();
        prev.focus();
      } else {
        const next = idx >= 0 && idx < focusable.length - 1 ? focusable[idx + 1] : focusable[0];
        e.preventDefault();
        next.focus();
      }
    };

    node.addEventListener('keydown', onKey as EventListener);
    return () => node.removeEventListener('keydown', onKey as EventListener);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit entry"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div ref={wrapperRef} className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10 max-h-[90vh] overflow-auto">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Close edit"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900">Edit entry</h2>
        </div>

        <EntryEditForm type={type} entry={entry} onSaved={onSaved} onCancel={onCancel} />
      </div>
    </div>
  );
}
