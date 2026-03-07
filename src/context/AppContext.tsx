import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Child, DrinkEntry, UrineEntry, BowelEntry } from '../types';
import * as storage from '../utils/storage';
import { AppContext } from './appContextDef';

export function AppProvider({ children: childrenProp }: { children: ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    children: Child[];
    selectedChildId: string | null;
    drinks: DrinkEntry[];
    urineEntries: UrineEntry[];
    bowelEntries: BowelEntry[];
  }>(() => {
    const user = storage.getUser();
    const childList = storage.getChildren();
    const selectedChildId = childList.length > 0 ? childList[0].id : null;
    return {
      user,
      children: childList,
      selectedChildId,
      drinks: storage.getDrinks(),
      urineEntries: storage.getUrineEntries(),
      bowelEntries: storage.getBowelEntries(),
    };
  });

  const refreshData = useCallback(() => {
    setState(prev => ({
      ...prev,
      drinks: storage.getDrinks(),
      urineEntries: storage.getUrineEntries(),
      bowelEntries: storage.getBowelEntries(),
      children: storage.getChildren(),
    }));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('bt_')) refreshData();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshData]);

  const login = (user: User) => {
    storage.setUser(user);
    setState(prev => ({ ...prev, user }));
  };

  const logout = () => {
    storage.clearUser();
    setState(prev => ({ ...prev, user: null }));
  };

  const addChild = (child: Child) => {
    storage.addChild(child);
    setState(prev => ({
      ...prev,
      children: [...prev.children, child],
      selectedChildId: prev.selectedChildId ?? child.id,
    }));
  };

  const selectChild = (childId: string) => {
    setState(prev => ({ ...prev, selectedChildId: childId }));
  };

  const addDrinkFn = (drink: DrinkEntry) => {
    storage.addDrink(drink);
    setState(prev => ({ ...prev, drinks: [...prev.drinks, drink] }));
  };

  const updateDrinkFn = (drink: DrinkEntry) => {
    storage.updateDrink(drink);
    setState(prev => ({
      ...prev,
      drinks: prev.drinks.map(d => d.id === drink.id ? drink : d),
    }));
  };

  const deleteDrinkFn = (id: string) => {
    storage.deleteDrink(id);
    setState(prev => ({
      ...prev,
      drinks: prev.drinks.filter(d => d.id !== id),
    }));
  };

  const addUrineEntryFn = (entry: UrineEntry) => {
    storage.addUrineEntry(entry);
    setState(prev => ({ ...prev, urineEntries: [...prev.urineEntries, entry] }));
  };

  const updateUrineEntryFn = (entry: UrineEntry) => {
    storage.updateUrineEntry(entry);
    setState(prev => ({
      ...prev,
      urineEntries: prev.urineEntries.map(e => e.id === entry.id ? entry : e),
    }));
  };

  const deleteUrineEntryFn = (id: string) => {
    storage.deleteUrineEntry(id);
    setState(prev => ({
      ...prev,
      urineEntries: prev.urineEntries.filter(e => e.id !== id),
    }));
  };

  const addBowelEntryFn = (entry: BowelEntry) => {
    storage.addBowelEntry(entry);
    setState(prev => ({ ...prev, bowelEntries: [...prev.bowelEntries, entry] }));
  };

  const updateBowelEntryFn = (entry: BowelEntry) => {
    storage.updateBowelEntry(entry);
    setState(prev => ({
      ...prev,
      bowelEntries: prev.bowelEntries.map(e => e.id === entry.id ? entry : e),
    }));
  };

  const deleteBowelEntryFn = (id: string) => {
    storage.deleteBowelEntry(id);
    setState(prev => ({
      ...prev,
      bowelEntries: prev.bowelEntries.filter(e => e.id !== id),
    }));
  };

  const exportData = () => {
    const child = state.children.find(c => c.id === state.selectedChildId);
    if (child) {
      storage.downloadCSV(child.id, child.name);
    }
  };

  const selectedChild = state.children.find(c => c.id === state.selectedChildId) ?? null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        selectedChild,
        login,
        logout,
        addChild,
        selectChild,
        addDrink: addDrinkFn,
        updateDrink: updateDrinkFn,
        deleteDrink: deleteDrinkFn,
        addUrineEntry: addUrineEntryFn,
        updateUrineEntry: updateUrineEntryFn,
        deleteUrineEntry: deleteUrineEntryFn,
        addBowelEntry: addBowelEntryFn,
        updateBowelEntry: updateBowelEntryFn,
        deleteBowelEntry: deleteBowelEntryFn,
        exportData,
      }}
    >
      {childrenProp}
    </AppContext.Provider>
  );
}


