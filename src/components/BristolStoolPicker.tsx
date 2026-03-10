import type { BristolStoolType } from '../types';
import { BRISTOL_GUIDANCE_TEXT } from '../content/presentation';

const bristolDescriptions: Record<BristolStoolType, { label: string; desc: string; emoji: string; color: string }> = {
  1: { label: 'Type 1', desc: 'Separate hard lumps', emoji: '🟤', color: 'bg-amber-900' },
  2: { label: 'Type 2', desc: 'Lumpy & sausage-like', emoji: '🟫', color: 'bg-amber-800' },
  3: { label: 'Type 3', desc: 'Sausage with cracks', emoji: '🟧', color: 'bg-amber-700' },
  4: { label: 'Type 4', desc: 'Smooth & soft (ideal)', emoji: '✅', color: 'bg-green-600' },
  5: { label: 'Type 5', desc: 'Soft blobs', emoji: '🟡', color: 'bg-yellow-500' },
  6: { label: 'Type 6', desc: 'Fluffy, mushy', emoji: '🟠', color: 'bg-orange-400' },
  7: { label: 'Type 7', desc: 'Watery, no solids', emoji: '🔴', color: 'bg-red-400' },
};

interface BristolStoolPickerProps {
  value: BristolStoolType | null;
  onChange: (type: BristolStoolType) => void;
}

export default function BristolStoolPicker({ value, onChange }: BristolStoolPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">Poo consistency (Bristol chart)</label>
      <div className="grid grid-cols-1 gap-2">
        {(Object.entries(bristolDescriptions) as [string, typeof bristolDescriptions[1]][]).map(
          ([type, info]) => {
            const typeNum = Number(type) as BristolStoolType;
            const isSelected = value === typeNum;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange(typeNum)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-lavender-500 bg-lavender-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-lavender-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center text-white text-lg`}>
                  {typeNum}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">{info.label}</div>
                  <div className="text-xs text-gray-500">{info.desc}</div>
                </div>
                <span className="text-xl">{info.emoji}</span>
              </button>
            );
          }
        )}
      </div>
      <p className="text-xs text-gray-400 italic mt-1">
        💡 {BRISTOL_GUIDANCE_TEXT}
      </p>
    </div>
  );
}
