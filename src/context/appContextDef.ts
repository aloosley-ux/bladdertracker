import { createContext } from 'react';
import type { User, Child, DrinkEntry, UrineEntry, BowelEntry } from '../types';

interface AppState {
  user: User | null;
  children: Child[];
  selectedChildId: string | null;
  drinks: DrinkEntry[];
  urineEntries: UrineEntry[];
  bowelEntries: BowelEntry[];
}

export interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addChild: (child: Child) => void;
  selectChild: (childId: string) => void;
  addDrink: (drink: DrinkEntry) => void;
  updateDrink: (drink: DrinkEntry) => void;
  deleteDrink: (id: string) => void;
  addUrineEntry: (entry: UrineEntry) => void;
  updateUrineEntry: (entry: UrineEntry) => void;
  deleteUrineEntry: (id: string) => void;
  addBowelEntry: (entry: BowelEntry) => void;
  updateBowelEntry: (entry: BowelEntry) => void;
  deleteBowelEntry: (id: string) => void;
  exportData: () => void;
  selectedChild: Child | null;
}

export const AppContext = createContext<AppContextType | null>(null);
