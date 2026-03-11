import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { getLeapReferenceDate, getCurrentLeap, getNextLeap } from '../data/leapData';
import { differenceInDays } from 'date-fns';
import type {
  User,
  Child,
  DrinkEntry,
  UrineEntry,
  BowelEntry,
  SleepEntry,
  ToiletAttemptEntry,
  FoodEntry,
  MoodEntry,
  SensoryEntry,
  MedicationEntry,
  TherapyEntry,
  RoutineEntry,
  Milestone,
  LeapSymptomLog,
  LeapDiaryEntry,
  ModuleId,
  ImportedDiaryPayload,
  UserRole,
  CaregiverInvite,
  NotificationItem,
  ReminderPreference,
  AuditEvent,
  ImportSummary,
} from '../types';
import { EMPTY_IMPORT_SUMMARY } from '../types';
import * as api from '../utils/api';
import * as localStorage from '../utils/storage';
import { AppContext } from './appContextDef';

function isApiAvailable(): boolean {
  return typeof window !== 'undefined' && !!import.meta.env.VITE_USE_CLOUD;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * DAY_IN_MS;

export function AppProvider({ children: childrenProp }: { children: ReactNode }) {
  const cloud = isApiAvailable();

  const [user, setUserState] = useState<User | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [urineEntries, setUrineEntries] = useState<UrineEntry[]>([]);
  const [bowelEntries, setBowelEntries] = useState<BowelEntry[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [toiletAttemptEntries, setToiletAttemptEntries] = useState<ToiletAttemptEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [sensoryEntries, setSensoryEntries] = useState<SensoryEntry[]>([]);
  const [medicationEntries, setMedicationEntries] = useState<MedicationEntry[]>([]);
  const [therapyEntries, setTherapyEntries] = useState<TherapyEntry[]>([]);
  const [routineEntries, setRoutineEntries] = useState<RoutineEntry[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [leapSymptomLogs, setLeapSymptomLogs] = useState<LeapSymptomLog[]>([]);
  const [leapDiaryEntries, setLeapDiaryEntries] = useState<LeapDiaryEntry[]>([]);
  const [enabledModules, setEnabledModulesState] = useState<ModuleId[]>([]);
  const [invites, setInvites] = useState<CaregiverInvite[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reminderPreferences, setReminderPreferencesState] = useState<ReminderPreference[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [ready, setReady] = useState(false);

  // Ref so refreshCloudData (which has an empty dep array) can always read the latest selectedChildId
  const selectedChildIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedChildIdRef.current = selectedChildId;
  }, [selectedChildId]);

  const refreshCloudData = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setChildrenList([]);
      setDrinks([]);
      setUrineEntries([]);
      setBowelEntries([]);
      setSleepEntries([]);
      setToiletAttemptEntries([]);
      setFoodEntries([]);
      setMoodEntries([]);
      setSensoryEntries([]);
      setMedicationEntries([]);
      setTherapyEntries([]);
      setRoutineEntries([]);
      setMilestones([]);
      setLeapSymptomLogs([]);
      setLeapDiaryEntries([]);
      setEnabledModulesState([]);
      setInvites([]);
      setNotifications([]);
      setReminderPreferencesState([]);
      setAuditTrail([]);
      return;
    }

    try {
      const [
        childrenData, drinksData, urineData, bowelData, sleepData, toiletData, foodData,
        moodData, sensoryData, medicationData, therapyData, routineData, milestonesData,
        invitesData, notificationsData, reminderData, auditData,
      ] = await Promise.all([
        api.apiGetChildren(),
        api.apiGetDrinks(),
        api.apiGetUrineEntries(),
        api.apiGetBowelEntries(),
        api.apiGetSleepEntries(),
        api.apiGetToiletAttemptEntries(),
        api.apiGetFoodEntries(),
        api.apiGetMoodEntries(),
        api.apiGetSensoryEntries(),
        api.apiGetMedicationEntries(),
        api.apiGetTherapyEntries(),
        api.apiGetRoutineEntries(),
        api.apiGetMilestones(),
        api.apiGetInvites(),
        api.apiGetNotifications(),
        api.apiGetReminderPreferences(),
        api.apiGetAuditEvents(),
      ]);
      setChildrenList(childrenData);
      setDrinks(drinksData);
      setUrineEntries(urineData);
      setBowelEntries(bowelData);
      setSleepEntries(sleepData);
      setToiletAttemptEntries(toiletData);
      setFoodEntries(foodData);
      setMoodEntries(moodData);
      setSensoryEntries(sensoryData);
      setMedicationEntries(medicationData);
      setTherapyEntries(therapyData);
      setRoutineEntries(routineData);
      setMilestones(milestonesData);
      setInvites(invitesData);
      setNotifications(notificationsData);
      setReminderPreferencesState(reminderData);
      setAuditTrail(auditData);

      // Resolve the selected child: keep current selection if still valid, else fall back to first.
      // Use the ref (not closure-captured state) so we always get the latest selectedChildId.
      const currentChildId = selectedChildIdRef.current;
      const resolvedChildId =
        currentChildId && childrenData.some((c) => c.id === currentChildId)
          ? currentChildId
          : childrenData[0]?.id ?? null;
      setSelectedChildId(resolvedChildId);

      // Load enabled modules for the resolved child, fall back to empty list on error
      if (resolvedChildId) {
        api.apiGetEnabledModules(resolvedChildId)
          .then(setEnabledModulesState)
          .catch((err) => { console.error('Failed to load enabled modules:', err); setEnabledModulesState([]); });
      } else {
        setEnabledModulesState([]);
      }
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
    setSleepEntries(localStorage.getSleepEntries(ids));
    setToiletAttemptEntries(localStorage.getToiletAttemptEntries(ids));
    setFoodEntries(localStorage.getFoodEntries(ids));
    setMoodEntries(localStorage.getMoodEntries(ids));
    setSensoryEntries(localStorage.getSensoryEntries(ids));
    setMedicationEntries(localStorage.getMedicationEntries(ids));
    setTherapyEntries(localStorage.getTherapyEntries(ids));
    setRoutineEntries(localStorage.getRoutineEntries(ids));
    setMilestones(localStorage.getMilestones(ids));
    setLeapSymptomLogs(localStorage.getLeapSymptomLogs(ids));
    setLeapDiaryEntries(localStorage.getLeapDiaryEntries(ids));
    setEnabledModulesState(resolvedId ? localStorage.getEnabledModules(resolvedId) : []);
    setInvites(currentUser ? localStorage.getInvites(currentUser) : []);
    setNotifications(currentUser ? localStorage.getNotifications(currentUser.id) : []);
    setReminderPreferencesState(currentUser ? localStorage.getReminderPreferences(currentUser.id) : []);
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

  // Check leap reminders — runs in local mode when user and children are loaded
  useEffect(() => {
    if (cloud || !user || childrenList.length === 0) return;
    const now = new Date();

    let prefs: ReturnType<typeof localStorage.getReminderPreferences> = [];
    try {
      prefs = localStorage.getReminderPreferences(user.id).filter(
        (p) => p.moduleId === 'leaps' && p.enabled,
      );
    } catch {
      return;
    }
    if (prefs.length === 0) return;

    let didAddNotification = false;
    for (const pref of prefs) {
      try {
        // Only fire if nextReminderAt has never been set or is in the past
        if (pref.nextReminderAt && new Date(pref.nextReminderAt) > now) continue;
        // Respect snoozedUntil
        if (pref.snoozedUntil && new Date(pref.snoozedUntil) > now) continue;

        const child = childrenList.find((c) => c.id === pref.childId);
        if (!child) continue;

        const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
        const currentLeap = getCurrentLeap(refDate, now);
        const nextLeap = getNextLeap(refDate, now);

        let title = '';
        let message = '';

        if (currentLeap) {
          const leapPhase = currentLeap.status === 'stormy' ? 'stormy phase' : 'sunny phase';
          title = `🌟 Leap ${currentLeap.leap.number} – ${currentLeap.leap.title}`;
          message = `${child.name} is in the ${leapPhase} of Leap ${currentLeap.leap.number}. Check the Leaps page for tips and symptom logging.`;
        } else if (nextLeap) {
          const daysAway = differenceInDays(nextLeap.stormyStart, now);
          if (daysAway <= 14) {
            title = `🔜 Leap ${nextLeap.leap.number} approaching`;
            message = `${child.name}'s next developmental leap (${nextLeap.leap.title}) begins in about ${daysAway} day${daysAway === 1 ? '' : 's'}. Visit the Leaps page to prepare.`;
          }
        }

        if (title && message) {
          localStorage.addNotification({ userId: user.id, title, message });
          didAddNotification = true;
        }

        // Always advance nextReminderAt so we don't spam
        const nextAt = pref.frequency === 'daily'
          ? new Date(now.getTime() + DAY_IN_MS).toISOString()
          : new Date(now.getTime() + WEEK_IN_MS).toISOString();
        localStorage.upsertReminderPreference({ ...pref, nextReminderAt: nextAt, updatedAt: now.toISOString() });
      } catch {
        // Continue processing other preferences even if one fails
      }
    }

    // Refresh state so the bell updates with new notifications
    if (didAddNotification) {
      refreshLocalData(user, selectedChildId);
    }
  // Run once when user + children are available; not on every render cycle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, childrenList.length, cloud]);

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
    setSleepEntries([]);
    setToiletAttemptEntries([]);
    setFoodEntries([]);
    setMoodEntries([]);
    setSensoryEntries([]);
    setMedicationEntries([]);
    setTherapyEntries([]);
    setRoutineEntries([]);
    setMilestones([]);
    setLeapSymptomLogs([]);
    setEnabledModulesState([]);
    setInvites([]);
    setNotifications([]);
    setReminderPreferencesState([]);
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
    if (cloud) {
      api.apiGetEnabledModules(childId)
        .then(setEnabledModulesState)
        .catch((err) => { console.error('Failed to load enabled modules:', err); setEnabledModulesState([]); });
    } else {
      setEnabledModulesState(localStorage.getEnabledModules(childId));
    }
  };

  const removeChild = async (childId: string) => {
    const child = childrenList.find((c) => c.id === childId);
    if (!child) return;

    if (cloud) {
      try {
        await api.apiDeleteChild(childId);
        await refreshCloudData(user);
      } catch { /* ignore */ }
    } else {
      localStorage.removeChild(childId);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Removed child profile',
          subject: child.name,
          detail: `Permanently removed child profile and all associated diary entries.`,
        });
      }
      const nextId = selectedChildId === childId ? null : selectedChildId;
      refreshLocalData(user, nextId);
    }
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

  // Sleep entry CRUD
  const addSleepEntry = async (entry: SleepEntry) => {
    if (cloud) {
      try { await api.apiAddSleepEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addSleepEntry(entry);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added sleep entry',
          subject: entry.childId,
          detail: `Sleep ${entry.eventType} logged at ${entry.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateSleepEntry = async (entry: SleepEntry) => {
    if (cloud) {
      try { await api.apiUpdateSleepEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateSleepEntry(entry);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteSleepEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteSleepEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteSleepEntry(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  // Toilet attempt entry CRUD
  const addToiletAttemptEntry = async (entry: ToiletAttemptEntry) => {
    if (cloud) {
      try { await api.apiAddToiletAttemptEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addToiletAttemptEntry(entry);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added toilet attempt',
          subject: entry.childId,
          detail: `Toilet attempt (${entry.outcome}) logged at ${entry.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateToiletAttemptEntry = async (entry: ToiletAttemptEntry) => {
    if (cloud) {
      try { await api.apiUpdateToiletAttemptEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateToiletAttemptEntry(entry);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteToiletAttemptEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteToiletAttemptEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteToiletAttemptEntry(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  // Food entry CRUD
  const addFoodEntry = async (entry: FoodEntry) => {
    if (cloud) {
      try { await api.apiAddFoodEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addFoodEntry(entry);
      if (user) {
        localStorage.addAuditEvent({
          userId: user.id,
          action: 'Added food entry',
          subject: entry.childId,
          detail: `${entry.mealType} logged at ${entry.time}.`,
        });
      }
      refreshLocalData(user, selectedChildId);
    }
  };

  const updateFoodEntry = async (entry: FoodEntry) => {
    if (cloud) {
      try { await api.apiUpdateFoodEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.updateFoodEntry(entry);
      refreshLocalData(user, selectedChildId);
    }
  };

  const deleteFoodEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteFoodEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.deleteFoodEntry(id);
      refreshLocalData(user, selectedChildId);
    }
  };

  // Mood entry CRUD
  const addMoodEntry = async (entry: MoodEntry) => {
    if (cloud) {
      try { await api.apiAddMoodEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addMoodEntry(entry);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added mood entry', subject: entry.childId, detail: `Mood ${entry.level}/5 logged at ${entry.time}.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateMoodEntry = async (entry: MoodEntry) => {
    if (cloud) {
      try { await api.apiUpdateMoodEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateMoodEntry(entry); refreshLocalData(user, selectedChildId); }
  };
  const deleteMoodEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteMoodEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteMoodEntry(id); refreshLocalData(user, selectedChildId); }
  };

  // Sensory entry CRUD
  const addSensoryEntry = async (entry: SensoryEntry) => {
    if (cloud) {
      try { await api.apiAddSensoryEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addSensoryEntry(entry);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added sensory entry', subject: entry.childId, detail: `${entry.sensoryType} (${entry.response}) logged at ${entry.time}.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateSensoryEntry = async (entry: SensoryEntry) => {
    if (cloud) {
      try { await api.apiUpdateSensoryEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateSensoryEntry(entry); refreshLocalData(user, selectedChildId); }
  };
  const deleteSensoryEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteSensoryEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteSensoryEntry(id); refreshLocalData(user, selectedChildId); }
  };

  // Medication entry CRUD
  const addMedicationEntry = async (entry: MedicationEntry) => {
    if (cloud) {
      try { await api.apiAddMedicationEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addMedicationEntry(entry);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added medication entry', subject: entry.childId, detail: `${entry.name} ${entry.dosage} at ${entry.time}.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateMedicationEntry = async (entry: MedicationEntry) => {
    if (cloud) {
      try { await api.apiUpdateMedicationEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateMedicationEntry(entry); refreshLocalData(user, selectedChildId); }
  };
  const deleteMedicationEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteMedicationEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteMedicationEntry(id); refreshLocalData(user, selectedChildId); }
  };

  // Therapy entry CRUD
  const addTherapyEntry = async (entry: TherapyEntry) => {
    if (cloud) {
      try { await api.apiAddTherapyEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addTherapyEntry(entry);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added therapy entry', subject: entry.childId, detail: `${entry.therapyType} session (${entry.durationMinutes}min) at ${entry.time}.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateTherapyEntry = async (entry: TherapyEntry) => {
    if (cloud) {
      try { await api.apiUpdateTherapyEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateTherapyEntry(entry); refreshLocalData(user, selectedChildId); }
  };
  const deleteTherapyEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteTherapyEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteTherapyEntry(id); refreshLocalData(user, selectedChildId); }
  };

  // Routine entry CRUD
  const addRoutineEntry = async (entry: RoutineEntry) => {
    if (cloud) {
      try { await api.apiAddRoutineEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addRoutineEntry(entry);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added routine entry', subject: entry.childId, detail: `${entry.routineName} ${entry.completed ? 'completed' : 'incomplete'} at ${entry.time}.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateRoutineEntry = async (entry: RoutineEntry) => {
    if (cloud) {
      try { await api.apiUpdateRoutineEntry(entry); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateRoutineEntry(entry); refreshLocalData(user, selectedChildId); }
  };
  const deleteRoutineEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteRoutineEntry(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteRoutineEntry(id); refreshLocalData(user, selectedChildId); }
  };

  // Milestone CRUD
  const addMilestoneEntry = async (milestone: Milestone) => {
    if (cloud) {
      try { await api.apiAddMilestone(milestone); await refreshCloudData(user); } catch { /* ignore */ }
    } else {
      localStorage.addMilestone(milestone);
      if (user) {
        localStorage.addAuditEvent({ userId: user.id, action: 'Added milestone', subject: milestone.childId, detail: `"${milestone.name}" (${milestone.category}) created.` });
      }
      refreshLocalData(user, selectedChildId);
    }
  };
  const updateMilestoneEntry = async (milestone: Milestone) => {
    if (cloud) {
      try { await api.apiUpdateMilestone(milestone); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.updateMilestone(milestone); refreshLocalData(user, selectedChildId); }
  };
  const deleteMilestoneEntry = async (id: string) => {
    if (cloud) {
      try { await api.apiDeleteMilestone(id); await refreshCloudData(user); } catch { /* ignore */ }
    } else { localStorage.deleteMilestone(id); refreshLocalData(user, selectedChildId); }
  };

  // Leap symptom log CRUD (local-only — no cloud API yet)
  const addLeapSymptomLogEntry = (log: LeapSymptomLog) => {
    localStorage.addLeapSymptomLog(log);
    refreshLocalData(user, selectedChildId);
  };
  const updateLeapSymptomLogEntry = (log: LeapSymptomLog) => {
    localStorage.updateLeapSymptomLog(log);
    refreshLocalData(user, selectedChildId);
  };
  const deleteLeapSymptomLogEntry = (id: string) => {
    localStorage.deleteLeapSymptomLog(id);
    refreshLocalData(user, selectedChildId);
  };

  // Leap diary CRUD (local-only — no cloud API yet)
  const addLeapDiaryEntryFn = (entry: LeapDiaryEntry) => {
    localStorage.addLeapDiaryEntry(entry);
    refreshLocalData(user, selectedChildId);
  };
  const updateLeapDiaryEntryFn = (entry: LeapDiaryEntry) => {
    localStorage.updateLeapDiaryEntry(entry);
    refreshLocalData(user, selectedChildId);
  };
  const deleteLeapDiaryEntryFn = (id: string) => {
    localStorage.deleteLeapDiaryEntry(id);
    refreshLocalData(user, selectedChildId);
  };

  // Module management
  const setEnabledModulesForChild = async (modules: ModuleId[]) => {
    // Update UI immediately so Dashboard/Log/Reports/AddEntry all re-render at once.
    // In cloud mode: if the API call fails, the in-memory state stays correct for this
    // session, but the DB retains the old value. The next login/page-reload will reload
    // from DB. This is acceptable — optimistic UI gives the best responsiveness.
    setEnabledModulesState(modules);
    // Persist in background (localStorage is synchronous; cloud is fire-and-forget)
    if (cloud) {
      if (selectedChildId) {
        try { await api.apiSetEnabledModules(selectedChildId, modules); } catch { /* ignore */ }
      }
    } else {
      if (selectedChildId) {
        localStorage.setEnabledModules(selectedChildId, modules);
      }
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
        return { ...EMPTY_IMPORT_SUMMARY, errors: ['Import failed'] };
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

  const setReminderPreferences = async (childId: string, reminders: Array<Partial<ReminderPreference> & { moduleId: ReminderPreference['moduleId'] }>) => {
    if (!user) return;
    if (cloud) {
      try {
        await api.apiSetReminderPreferences(childId, reminders);
        await refreshCloudData(user);
      } catch (error) {
        console.error('Failed to persist reminder preferences', error);
      }
      return;
    }

    const existing = localStorage.getReminderPreferences(user.id);
    const now = new Date().toISOString();
    const untouched = existing.filter((entry) => entry.childId !== childId);
    const next = reminders.map((entry) => {
      const found = existing.find((item) => item.childId === childId && item.moduleId === entry.moduleId);
      const frequency = entry.frequency ?? found?.frequency ?? 'daily';
      const enabled = entry.enabled ?? found?.enabled ?? true;
      const nextReminderAt = enabled
        ? (frequency === 'daily'
          ? new Date(Date.now() + DAY_IN_MS).toISOString()
          : new Date(Date.now() + WEEK_IN_MS).toISOString())
        : null;

      return {
        id: found?.id ?? localStorage.generateId(),
        userId: user.id,
        childId,
        moduleId: entry.moduleId,
        frequency,
        enabled,
        snoozedUntil: entry.snoozedUntil ?? found?.snoozedUntil ?? null,
        nextReminderAt,
        createdAt: found?.createdAt ?? now,
        updatedAt: now,
      } satisfies ReminderPreference;
    });

    localStorage.setReminderPreferences([...untouched, ...next]);
    refreshLocalData(user, selectedChildId);
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
    setSleepEntries([]);
    setToiletAttemptEntries([]);
    setFoodEntries([]);
    setMoodEntries([]);
    setSensoryEntries([]);
    setMedicationEntries([]);
    setTherapyEntries([]);
    setRoutineEntries([]);
    setMilestones([]);
    setLeapSymptomLogs([]);
    setLeapDiaryEntries([]);
    setEnabledModulesState([]);
    setInvites([]);
    setNotifications([]);
    setReminderPreferencesState([]);
    setAuditTrail([]);
    setSelectedChildId(null);
  };

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) ?? null;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
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
        sleepEntries,
        toiletAttemptEntries,
        foodEntries,
        moodEntries,
        sensoryEntries,
        medicationEntries,
        therapyEntries,
        routineEntries,
        milestones,
        leapSymptomLogs,
        leapDiaryEntries,
        enabledModules,
        invites,
        notifications,
        reminderPreferences,
        auditTrail,
        login,
        logout,
        addChild,
        removeChild,
        selectChild,
        addDrink,
        updateDrink,
        deleteDrink,
        addUrineEntry,
        updateUrineEntry,
        deleteUrineEntry,
        addBowelEntry,
        updateBowelEntry,
        deleteBowelEntry,
        addSleepEntry,
        updateSleepEntry,
        deleteSleepEntry,
        addToiletAttemptEntry,
        updateToiletAttemptEntry,
        deleteToiletAttemptEntry,
        addFoodEntry,
        updateFoodEntry,
        deleteFoodEntry,
        addMoodEntry,
        updateMoodEntry,
        deleteMoodEntry,
        addSensoryEntry,
        updateSensoryEntry,
        deleteSensoryEntry,
        addMedicationEntry,
        updateMedicationEntry,
        deleteMedicationEntry,
        addTherapyEntry,
        updateTherapyEntry,
        deleteTherapyEntry,
        addRoutineEntry,
        updateRoutineEntry,
        deleteRoutineEntry,
        addMilestone: addMilestoneEntry,
        updateMilestone: updateMilestoneEntry,
        deleteMilestone: deleteMilestoneEntry,
        addLeapSymptomLog: addLeapSymptomLogEntry,
        updateLeapSymptomLog: updateLeapSymptomLogEntry,
        deleteLeapSymptomLog: deleteLeapSymptomLogEntry,
        addLeapDiaryEntry: addLeapDiaryEntryFn,
        updateLeapDiaryEntry: updateLeapDiaryEntryFn,
        deleteLeapDiaryEntry: deleteLeapDiaryEntryFn,
        setEnabledModules: setEnabledModulesForChild,
        exportData,
        createInvite,
        acceptInvite,
        importDiaryData,
        markNotificationRead,
        setReminderPreferences,
        clearAllData,
      }}
    >
      {childrenProp}
    </AppContext.Provider>
  );
}
