import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import EntryEditForm from './EntryEditForm';

// EntryEditModal — modal wrapper around EntryEditForm with shadcn Dialog.
// Lock background scroll while open and reset on close.
export default function EntryEditModal({ type, entry, onSaved, onCancel }: {
  type: string;
  entry: unknown;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-auto rounded-3xl p-6 ring-1 ring-black/10"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-gray-900">Edit entry</DialogTitle>
        </DialogHeader>

        <EntryEditForm type={type} entry={entry} onSaved={onSaved} onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
