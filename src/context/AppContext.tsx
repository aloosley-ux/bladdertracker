import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  Child,
  DrinkEntry,
  UrineEntry,
  BowelEntry,
  ImportedDiaryPayload,
  UserRole,
} from '../types';
import * as storage from '../utils/storage';
import { AppContext } from './appContextDef';

function hydrateState(user: User | null, selectedChildId?: string | null) {
  const children = user ? storage.getChildren(user.id) : [];
  const availableChildIds = children.map((child) => child.id);
  const resolvedSelectedChildId =
    selectedChildId && availableChildIds.includes(selectedChildId)
      ? selectedChildId
      : children[0]?.id ?? null;

  return {
    user,
    children,
    selectedChildId: resolvedSelectedChildId,
    drinks: storage.getDrinks(availableChildIds),
    urineEntries: storage.getUrineEntries(availableChildIds),
    bowelEntries: storage.getBowelEntries(availableChildIds),
    invites: user ? storage.getInvites(user) : [],
    notifications: user ? storage.getNotifications(user.id) : [],
    auditTrail: user ? storage.getAuditEvents(user.id) : [],
  };
}

export function AppProvider({ children: childrenProp }: { children: ReactNode }) {
  const [state, setState] = useState(() => hydrateState(storage.getUser()));

  const refreshData = useCallback(() => {
    setState((prev) => hydrateState(prev.user, prev.selectedChildId));
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.startsWith('bt_')) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshData]);

  const login = (user: User) => {
    storage.setUser(user);
    setState((prev) => hydrateState(user, prev.selectedChildId));
  };

  const logout = () => {
    storage.clearUser();
    setState(hydrateState(null));
  };

  const addChild = (child: Child) => {
    storage.addChild(child);
    storage.addAuditEvent({
      userId: child.createdBy,
      action: 'Created child profile',
      subject: child.name,
      detail: 'Added a new child profile for diary tracking.',
    });
    setState((prev) => hydrateState(prev.user, prev.selectedChildId ?? child.id));
  };

  const selectChild = (childId: string) => {
    setState((prev) => ({ ...prev, selectedChildId: childId }));
  };

  const addDrinkFn = (drink: DrinkEntry) => {
    storage.addDrink(drink);
    if (state.user) {
      storage.addAuditEvent({
        userId: state.user.id,
        action: 'Added drink entry',
        subject: drink.childId,
        detail: `${drink.amountMl}ml recorded at ${drink.time}.`,
      });
    }
    refreshData();
  };

  const updateDrinkFn = (drink: DrinkEntry) => {
    storage.updateDrink(drink);
    refreshData();
  };

  const deleteDrinkFn = (id: string) => {
    storage.deleteDrink(id);
    refreshData();
  };

  const addUrineEntryFn = (entry: UrineEntry) => {
    storage.addUrineEntry(entry);
    if (state.user) {
      storage.addAuditEvent({
        userId: state.user.id,
        action: 'Added urine entry',
        subject: entry.childId,
        detail: `Urine event logged at ${entry.time}.`,
      });
    }
    refreshData();
  };

  const updateUrineEntryFn = (entry: UrineEntry) => {
    storage.updateUrineEntry(entry);
    refreshData();
  };

  const deleteUrineEntryFn = (id: string) => {
    storage.deleteUrineEntry(id);
    refreshData();
  };

  const addBowelEntryFn = (entry: BowelEntry) => {
    storage.addBowelEntry(entry);
    if (state.user) {
      storage.addAuditEvent({
        userId: state.user.id,
        action: 'Added bowel entry',
        subject: entry.childId,
        detail: `Bowel event logged at ${entry.time}.`,
      });
    }
    refreshData();
  };

  const updateBowelEntryFn = (entry: BowelEntry) => {
    storage.updateBowelEntry(entry);
    refreshData();
  };

  const deleteBowelEntryFn = (id: string) => {
    storage.deleteBowelEntry(id);
    refreshData();
  };

  const exportData = () => {
    const child = state.children.find((item) => item.id === state.selectedChildId);
    if (!child) return;
    storage.downloadCSV(child.id, child.name);
    if (state.user) {
      storage.addAuditEvent({
        userId: state.user.id,
        action: 'Exported diary',
        subject: child.name,
        detail: 'Downloaded CSV export for the selected child.',
      });
      refreshData();
    }
  };

  const createInvite = (email: string, role: UserRole, childId: string) => {
    if (!state.user) return null;

    const child = state.children.find((item) => item.id === childId);
    if (!child) return null;

    const invite = storage.createInvite({
      childId,
      childName: child.name,
      email,
      role,
      invitedBy: state.user.id,
    });

    storage.addAuditEvent({
      userId: state.user.id,
      action: 'Created secure invite',
      subject: child.name,
      detail: `Shared a ${role} invite with ${invite.email}.`,
    });

    refreshData();
    return invite;
  };

  const acceptInvite = (token: string) => {
    if (!state.user) return false;

    const acceptedInvite = storage.acceptInvite(token, state.user);
    if (!acceptedInvite) return false;

    storage.addAuditEvent({
      userId: state.user.id,
      action: 'Accepted invite',
      subject: acceptedInvite.childName,
      detail: `Accepted ${acceptedInvite.role} access to the diary.`,
    });

    refreshData();
    return true;
  };

  const importDiaryData = (payload: ImportedDiaryPayload, childId: string) => {
    const summary = storage.importDiaryPayload(payload, childId, state.user?.id ?? '');
    if (state.user) {
      storage.addAuditEvent({
        userId: state.user.id,
        action: 'Imported diary data',
        subject: childId,
        detail: `Imported ${summary.drinks + summary.urineEntries + summary.bowelEntries} records.`,
      });
    }
    refreshData();
    return summary;
  };

  const markNotificationRead = (id: string) => {
    storage.markNotificationRead(id);
    refreshData();
  };

  const clearAllData = () => {
    storage.clearAllAppData();
    setState(hydrateState(null));
  };

  const selectedChild = state.children.find((child) => child.id === state.selectedChildId) ?? null;

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
        createInvite,
        acceptInvite,
        importDiaryData,
        markNotificationRead,
        clearAllData,
      }}
    >
      {childrenProp}
    </AppContext.Provider>
  );
}
