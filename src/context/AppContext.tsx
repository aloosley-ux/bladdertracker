import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  Child,
  DrinkEntry,
  UrineEntry,
  BowelEntry,
  ImportedDiaryPayload,
  UserRole,
  CaregiverInvite,
  NotificationItem,
  AuditEvent,
  ImportSummary,
} from '../types';
import * as api from '../utils/api';
import * as localStorage from '../utils/storage';
import { AppContext } from './appContextDef';

function isApiAvailable(): boolean {
  return typeof window !== 'undefined' && !!import.meta.env.VITE_USE_CLOUD;
}

export function AppProvider({ children: childrenProp }: { children: ReactNode }) {
  const cloud = isApiAvailable();

  const [user, setUserState] = useState<User | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [urineEntries, setUrineEntries] = useState<UrineEntry[]>([]);
  const [bowelEntries, setBowelEntries] = useState<BowelEntry[]>([]);
  const [invites, setInvites] = useState<CaregiverInvite[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [ready, setReady] = useState(false);

  const refreshCloudData = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setChildrenList([]);
      setDrinks([]);
      setUrineEntries([]);
      setBowelEntries([]);
      setInvites([]);
      setNotifications([]);
      setAuditTrail([]);
      return;
    }

    try {
      const [ch, dr, ur, bo, inv, notif, aud] = await Promise.all([
        api.apiGetChildren(),
        api.apiGetDrinks(),
        api.apiGetUrineEntries(),
        api.apiGetBowelEntries(),
        api.apiGetInvites(),
        api.apiGetNotifications(),
        api.apiGetAuditEvents(),
      ]);
      setChildrenList(ch);
      setDrinks(dr);
      setUrineEntries(ur);
      setBowelEntries(bo);
      setInvites(inv);
      setNotifications(notif);
      setAuditTrail(aud);

      setSelectedChildId((prev) => {
        if (prev && ch.some((c) => c.id === prev)) return prev;
        return ch[0]?.id ?? null;
      });
    } catch {
      // If API calls fail, data stays as-is
    }
  }, []);

  const refreshLocalData = useCallback((currentUser: User | null, childId?: string | null) => {
    const ch = currentUser ? localStorage.getChildren(currentUser.id) : [];
    const ids = ch.map((c) => c.id);
    const resolvedId =
      childId && ids.includes(childId) ? childId : ch[0]?.id ?? null;

    setChildrenList(ch);
    setSelectedChildId(resolvedId);
    setDrinks(localStorage.getDrinks(ids));
    setUrineEntries(localStorage.getUrineEntries(ids));
    setBowelEntries(localStorage.getBowelEntries(ids));
    setInvites(currentUser ? localStorage.getInvites(currentUser) : []);
    setNotifications(currentUser ? localStorage.getNotifications(currentUser.id) : []);
    setAuditTrail(currentUser ? localStorage.getAuditEvents(currentUser.id) : []);
  }, []);

  // Initialize session
  useEffect(() => {
    (async () => {
      if (cloud) {
        try {
          const sessionUser = await api.apiGetSession();
          setUserState(sessionUser);
          if (sessionUser) await refreshCloudData(sessionUser);
        } catch {
          setUserState(null);
        }
      } else {
        const sessionUser = localStorage.getUser();
        setUserState(sessionUser);
        refreshLocalData(sessionUser);
      }
      setReady(true);
    })();
  }, [cloud, refreshCloudData, refreshLocalData]);

  // Listen for storage events in local mode
  useEffect(() => {
    if (cloud) return;
    const handle = (e: StorageEvent) => {
      if (e.key?.startsWith('bt_')) {
        const u = localStorage.getUser();
        setUserState(u);
        refreshLocalData(u, selectedChildId);
      }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, [cloud, refreshLocalData, selectedChildId]);

  const login = (u: User) => {
    setUserState(u);
    if (cloud) {
      refreshCloudData(u);
    } else {
      localStorage.setUser(u);
      refreshLocalData(u);
    }
  };

  const logout = async () => {
    if (cloud) {
      try { await api.apiLogout(); } catch { /* ignore */ }
    } else {
      localStorage.clearUser();
    }
    setUserState(null);
    setChildrenList([]);
    setDrinks([]);
    setUrineEntries([]);
    setBowelEntries([]);
    setInvites([]);
    setNotifications([]);
    setAuditTrail([]);
    setSelectedChildId(null);
  };

  const addChild = async (child: Child) => {
    if (cloud) {
      try {
        const created = await api.apiAddChild(child.name, child.dateOfBirth);
        await refreshCloudData(user);
        setSelectedChildId((prev) => prev ?? created.id);
      } catch { /* ignore */ }
    } else {
      localStorage.addChild(child);
      localStorage.addAuditEvent({
        userId: child.createdBy,
        action: 'Created child profile',
        subject: child.name,
        detail: 'Added a new child profile for diary tracking.',
      });
      refreshLocalData(user, selectedChildId ?? child.id);
    }
  };

  const selectChild = (childId: string) => {
    setSelectedChildId(childId);
  };

  const addDrink = async (drink: DrinkEntry) => {
    if (cloud) {
      try {
        await api.apiAddDrink(drink);
        await refreshCloudData(user);
      } catch { /* ignore */ }
    } else {
      localStorage.addDrink(drink);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added drink entry',
          subject: drink.childId,
          detail: `${drink.amountMl}ml recorded at ${drink.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateDrink = async (drink: DrinkEntry) => {
    if (cloud) {
      try { await api.apiUpdateDrink(drink); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateDrink(drink);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteDrink = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteDrink(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteDrink(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  const addUrineEntry = async (entry: UrineEntry) => {
    if (cloud) {
      try {
        await api.apiAddUrineEntry(entry);
        await refreshCloudData(user);
      } catch { /* ignore */ }
    } else {
      localStorage.addUrineEntry(entry);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added urine entry',
          subject: entry.childId,
          detail: `Urine event logged at ${entry.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateUrineEntry = async (entry: UrineEntry) => {
    if (cloud) {
      try { await api.apiUpdateUrineEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateUrineEntry(entry);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteUrineEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteUrineEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteUrineEntry(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  const addBowelEntry = async (entry: BowelEntry) => {
    if (cloud) {
      try {
        await api.apiAddBowelEntry(entry);
        await refreshCloudData(user);
      } catch { /* ignore */ }
    } else {
      localStorage.addBowelEntry(entry);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added bowel entry',
          subject: entry.childId,
          detail: `Bowel event logged at ${entry.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateBowelEntry = async (entry: BowelEntry) => {
    if (cloud) {
      try { await api.apiUpdateBowelEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateBowelEntry(entry);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteBowelEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteBowelEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteBowelEntry(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  const exportData = async () => {
    const child = childrenList.find((c) => c.id === selectedChildId);
    if (!child) return;

    if (cloud) {
      try { await api.apiExportCSV(child.id, child.name); } catch { /* ignore */ }
    } else {
      localStorage.downloadCSV(child.id, child.name);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Exported diary',
          subject: child.name,
          detail: 'Downloaded CSV export for the selected child.',
        });
        refreshLocalData(user, selectedChildId);
      }
    }
  };

  const createInvite = async (email: string, role: UserRole, childId: string) => {
    if (!user) return null;

    if (cloud) {
      try {
        const invite = await api.apiCreateInvite(childId, email, role);
        await refreshCloudData(user);
        return invite;
      } catch {
        return null;
      }
    } else {
      const child = childrenList.find((c) => c.id === childId);
      if (!child) return null;

      const invite = localStorage.createInvite({
        childId,
        childName: child.name,
        email,
        role,
        invitedBy: user.id,
      });

      localStorage.addAuditEvent({
        userId: user.id,
        action: 'Created secure invite',
        subject: child.name,
        detail: `Shared a ${role} invite with ${invite.email}.`,
      });

      refreshLocalData(user, selectedChildId);
      return invite;
    }
  };

  const acceptInvite = async (token: string) => {
    if (!user) return false;

    if (cloud) {
      try {
        await api.apiAcceptInvite(token);
        await refreshCloudData(user);
        return true;
      } catch {
        return false;
      }
    } else {
      const accepted = localStorage.acceptInvite(token, user);
      if (!accepted) return false;

      localStorage.addAuditEvent({
        userId: user.id,
        action: 'Accepted invite',
        subject: accepted.childName,
        detail: `Accepted ${accepted.role} access to the diary.`,
      });

      refreshLocalData(user, selectedChildId);
      return true;
    }
  };

  const importDiaryData = async (payload: ImportedDiaryPayload, childId: string): Promise<ImportSummary> => {
    if (cloud) {
      try {
        const summary = await api.apiImportData(childId, payload);
        await refreshCloudData(user);
        return summary;
      } catch {
        return { drinks: 0, urineEntries: 0, bowelEntries: 0, errors: ['Import failed'] };
      }
    } else {
      const summary = localStorage.importDiaryPayload(payload, childId, user?.id ?? '');
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Imported diary data',
          subject: childId,
          detail: `Imported ${summary.drinks + summary.urineEntries + summary.bowelEntries} records.`,
        });
      }
      refreshLocalData(user, selectedChildId);
      return summary;
    }
  };

  const markNotificationRead = async (id: string) => {
    if (cloud) {
      try { await api.apiMarkNotificationRead(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.markNotificationRead(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  const clearAllData = () => {
    if (!cloud) {
      localStorage.clearAllAppData();
    }
    setUserState(null);
    setChildrenList([]);
    setDrinks([]);
    setUrineEntries([]);
    setBowelEntries([]);
    setInvites([]);
    setNotifications([]);
    setAuditTrail([]);
    setSelectedChildId(null);
  };

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) ?? null;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff]">
        <div className="animate-pulse text-lavender-500 text-sm font-medium">Loading…</div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        user,
        children: childrenList,
        selectedChildId,
        selectedChild,
        drinks,
        urineEntries,
        bowelEntries,
        invites,
        notifications,
        auditTrail,
        login,
        logout,
        addChild,
        selectChild,
        addDrink: addDrink,
        updateDrink: updateDrink,
        deleteDrink: deleteDrink,
        addUrineEntry: addUrineEntry,
        updateUrineEntry: updateUrineEntry,
        deleteUrineEntry: deleteUrineEntry,
        addBowelEntry: addBowelEntry,
        updateBowelEntry: updateBowelEntry,
        deleteBowelEntry: deleteBowelEntry,
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
