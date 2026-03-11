import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Apple } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';
import type { MealType, FoodTexture, FoodAcceptance } from '../../types';

export default function FoodForm() {
  const { addFoodEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<MealType>('snack');
  const [description, setDescription] = useState('');
  const [portions, setPortions] = useState('');
  const [isTrying, setIsTrying] = useState(false);
  const [texture, setTexture] = useState<FoodTexture | ''>('');
  const [accepted, setAccepted] = useState<FoodAcceptance | ''>('');
  const [notes, setNotes] = useState('');

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' },
  ];

  const textures: { value: FoodTexture; label: string }[] = [
    { value: 'pureed', label: 'Puréed' },
    { value: 'mashed', label: 'Mashed' },
    { value: 'soft', label: 'Soft' },
    { value: 'chopped', label: 'Chopped' },
    { value: 'whole', label: 'Whole' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const acceptanceOptions: { value: FoodAcceptance; label: string; emoji: string }[] = [
    { value: 'accepted', label: 'Accepted', emoji: '✅' },
    { value: 'refused', label: 'Refused', emoji: '❌' },
    { value: 'partial', label: 'Partial', emoji: '🔶' },
    { value: 'first_try', label: 'First try!', emoji: '⭐' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !description.trim()) return;
    addFoodEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      mealType,
      description: description.trim(),
      portions: portions ? Number(portions) : null,
      isTrying,
      texture: texture || null,
      accepted: accepted || null,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fff5eb] p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Apple size={18} className="text-orange-500" /> Log Food
      </h2>

      <HelpPanel title="Logging a Meal or Snack">
        <p><strong>Meal type:</strong> Breakfast, lunch, dinner, or snack.</p>
        <p><strong>Description:</strong> What was eaten — keep it brief, e.g., "pasta with tomato sauce".</p>
        <p><strong>New food:</strong> Toggle on if this is the first time trying this food.</p>
        <p><strong>Texture &amp; Acceptance:</strong> Track texture and whether child accepted it (helpful for feeding therapy).</p>
        <p><strong>Portions:</strong> Estimated portions eaten — 0.25, 0.5, 0.75, 1, or 1.5+.</p>
        <p><strong>Notes:</strong> Any observations — e.g., "refused vegetables", "ate well".</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="What">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Meal Type</label>
          <div className="grid grid-cols-4 gap-2">
            {mealTypes.map((m) => (
              <button key={m.value} type="button" onClick={() => setMealType(m.value)}
                className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                  mealType === m.value
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-orange-50'
                }`}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Food description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Pasta with vegetables, yoghurt"
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
            required />
        </div>

        {/* Food Trying Tracker fields (#15) */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isTrying} onChange={(e) => setIsTrying(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-200" />
            <span className="text-sm font-medium text-gray-700">⭐ New food — trying for the first time</span>
          </label>
        </div>

        {isTrying && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">
                Texture <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {textures.map((t) => (
                  <button key={t.value} type="button" onClick={() => setTexture(texture === t.value ? '' : t.value)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      texture === t.value
                        ? 'bg-orange-400 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-orange-50'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">
                Acceptance <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {acceptanceOptions.map((a) => (
                  <button key={a.value} type="button" onClick={() => setAccepted(accepted === a.value ? '' : a.value)}
                    className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                      accepted === a.value
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-orange-50'
                    }`}>
                    {a.emoji} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600">Portions <span className="text-gray-400 font-normal">— optional</span></label>
          <input type="number" value={portions} onChange={(e) => setPortions(e.target.value)}
            placeholder="Number of portions"
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
            min="0" step="0.5" />
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Dietary notes, allergies, reactions..."
          aria-label="Food notes"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-200">
        Save Food Entry 🍽️
      </button>
    </form>
  );
}
