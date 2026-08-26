import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/useApp';
import { useTheme } from '../context/useTheme';
import { apiDeleteAccount, apiResetPassword } from '../utils/api';
import { getImportTemplateDescription, parseImportFile } from '../utils/importers';
import { generateId } from '../utils/storage';
import type { Child, ModuleId } from '../types';

const REMINDER_ENABLED_MODULES: ModuleId[] = ['milestones', 'therapy', 'routine', 'mood', 'leaps'];

export function useSettings() {
  const {
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    addChild,
    removeChild,
    exportData,
    importDiaryData,
    auditTrail,
    logout,
    clearAllData,
    enabledModules,
    setEnabledModules,
    reminderPreferences,
    setReminderPreferences,
    updateChild,
  } = useApp();
  const { theme, setTheme, dyslexiaFont, setDyslexiaFont } = useTheme();

  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');

  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [removeConfirmText, setRemoveConfirmText] = useState('');

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteAccountText, setDeleteAccountText] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [importMessage, setImportMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dueDateTargetId, setDueDateTargetId] = useState<string | null>(null);

  const handleSaveDueDate = (child: Child, date: string, useAsDue = false) => {
    const updated: Partial<Child> = { ...child, lastUpdatedAt: new Date().toISOString() };
    updated.dateOfBirth = date;

    if (child.isBorn) {
      updated.dueDate = undefined;
    } else {
      if (useAsDue) {
        updated.dueDate = date;
      } else {
        updated.dueDate = undefined;
      }
    }

    updateChild(updated as Child);
    setDueDateTargetId(null);
  };

  const cloud = typeof window !== 'undefined' && !!import.meta.env.VITE_USE_CLOUD;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const canManageChildren = isAdmin || isParent;

  const userInitials = useMemo(
    () =>
      user?.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ?? 'BT',
    [user?.name],
  );

  const formatRole = (role: string) => {
    if (role === 'schoolAdmin') return 'School admin';
    if (role === 'admin') return 'Administrator';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleAddChild = (event: React.FormEvent) => {
    event.preventDefault();
    if (!childName.trim() || !user) return;

    const child: Child = {
      id: generateId(),
      name: childName.trim(),
      dateOfBirth: childDob,
      caregivers: user.role === 'parent' || user.role === 'admin' ? [] : [user.id],
      parentIds: user.role === 'parent' || user.role === 'admin' ? [user.id] : [],
      createdBy: user.id,
      lastUpdatedAt: new Date().toISOString(),
    };

    addChild(child);
    setChildName('');
    setChildDob('');
    setShowAddChild(false);
  };

  const handleRemoveChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child || removeConfirmText !== child.name) return;
    removeChild(childId);
    setRemoveTargetId(null);
    setRemoveConfirmText('');
  };

  const handleClearAllData = () => {
    if (clearConfirmText !== 'DELETE') return;
    clearAllData();
    setShowClearConfirm(false);
    setClearConfirmText('');
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountText !== 'DELETE MY ACCOUNT') return;
    try {
      await apiDeleteAccount();
      clearAllData();
    } catch {
      setDeleteAccountText('');
      setShowDeleteAccount(false);
      alert('Account deletion failed. Please try again or contact support.');
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await apiResetPassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Could not change password. Check your current password and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChildId) return;

    setImportMessage('');
    setImporting(true);
    try {
      const payload = await parseImportFile(file);
      const summary = await importDiaryData(payload, selectedChildId);
      const total =
        summary.drinks +
        summary.urineEntries +
        summary.bowelEntries +
        summary.sleepEntries +
        summary.toiletAttemptEntries +
        summary.foodEntries;
      const errorText = summary.errors.length > 0 ? ` ${summary.errors.join(' ')}` : '';
      setImportMessage(`Imported ${total} records.${errorText}`);
    } catch {
      setImportMessage('Could not read that file. Please use CSV, JSON, or XLSX with the provided template structure.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const visibleAudit = auditTrail.slice(0, 5);
  const templateHints = getImportTemplateDescription();
  const reminderForChild = selectedChildId
    ? reminderPreferences.filter((entry) => entry.childId === selectedChildId)
    : [];
  const reminderModules = enabledModules.filter((moduleId) => REMINDER_ENABLED_MODULES.includes(moduleId));

  return {
    // Context state
    user,
    children,
    selectedChild,
    selectedChildId,
    selectChild,
    addChild,
    removeChild,
    exportData,
    importDiaryData,
    auditTrail,
    logout,
    clearAllData,
    enabledModules,
    setEnabledModules,
    reminderPreferences,
    setReminderPreferences,
    updateChild,
    theme,
    setTheme,
    dyslexiaFont,
    setDyslexiaFont,
    // Local state
    showAddChild,
    setShowAddChild,
    childName,
    setChildName,
    childDob,
    setChildDob,
    removeTargetId,
    setRemoveTargetId,
    removeConfirmText,
    setRemoveConfirmText,
    showClearConfirm,
    setShowClearConfirm,
    clearConfirmText,
    setClearConfirmText,
    showDeleteAccount,
    setShowDeleteAccount,
    deleteAccountText,
    setDeleteAccountText,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    changingPassword,
    importMessage,
    importing,
    fileInputRef,
    dueDateTargetId,
    setDueDateTargetId,
    // Computed
    cloud,
    isAdmin,
    isParent,
    canManageChildren,
    userInitials,
    formatRole,
    visibleAudit,
    templateHints,
    reminderForChild,
    reminderModules,
    // Handlers
    handleSaveDueDate,
    handleAddChild,
    handleRemoveChild,
    handleClearAllData,
    handleDeleteAccount,
    handleChangePassword,
    handleImport,
  };
}
