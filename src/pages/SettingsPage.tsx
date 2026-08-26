import PageShell from '../components/PageShell';
import { useSettings } from '../hooks/useSettings';
import { ProfileSection } from '../components/settings/ProfileSection';
import { SettingsForms } from '../components/settings/SettingsForms';

// SettingsPage — user settings for theme, font, notifications, password, and data import/export.
export default function SettingsPage() {
  const s = useSettings();

  return (
    <div className="pb-20">
      <PageShell
        heroAssetKey="pageSettingsHero"
        heroContent={
          <div className="px-4 pb-6 pt-8">
            <h1 className="text-xl font-bold text-[var(--foreground)]">Account &amp; Settings</h1>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              Manage your profile, preferences, data, and privacy in one place.
            </p>
          </div>
        }
      >
      <div className="space-y-4 px-4 pt-2">
        <ProfileSection
          user={s.user}
          selectedChild={s.selectedChild}
          selectedChildId={s.selectedChildId}
          enabledModules={s.enabledModules}
          setEnabledModules={s.setEnabledModules}
          setReminderPreferences={s.setReminderPreferences}
          theme={s.theme}
          setTheme={s.setTheme}
          dyslexiaFont={s.dyslexiaFont}
          setDyslexiaFont={s.setDyslexiaFont}
          userInitials={s.userInitials}
          formatRole={s.formatRole}
          isAdmin={s.isAdmin}
          cloud={s.cloud}
          currentPassword={s.currentPassword}
          setCurrentPassword={s.setCurrentPassword}
          newPassword={s.newPassword}
          setNewPassword={s.setNewPassword}
          confirmPassword={s.confirmPassword}
          setConfirmPassword={s.setConfirmPassword}
          passwordError={s.passwordError}
          passwordSuccess={s.passwordSuccess}
          changingPassword={s.changingPassword}
          handleChangePassword={s.handleChangePassword}
          reminderModules={s.reminderModules}
          reminderForChild={s.reminderForChild}
        />

        <SettingsForms
          children={s.children}
          selectedChild={s.selectedChild}
          selectChild={s.selectChild}
          canManageChildren={s.canManageChildren}
          dueDateTargetId={s.dueDateTargetId}
          setDueDateTargetId={s.setDueDateTargetId}
          removeTargetId={s.removeTargetId}
          setRemoveTargetId={s.setRemoveTargetId}
          removeConfirmText={s.removeConfirmText}
          setRemoveConfirmText={s.setRemoveConfirmText}
          handleSaveDueDate={s.handleSaveDueDate}
          handleRemoveChild={s.handleRemoveChild}
          showAddChild={s.showAddChild}
          setShowAddChild={s.setShowAddChild}
          childName={s.childName}
          setChildName={s.setChildName}
          childDob={s.childDob}
          setChildDob={s.setChildDob}
          handleAddChild={s.handleAddChild}
          exportData={s.exportData}
          importMessage={s.importMessage}
          importing={s.importing}
          fileInputRef={s.fileInputRef}
          handleImport={s.handleImport}
          templateHints={s.templateHints}
          selectedChildId={s.selectedChildId}
          cloud={s.cloud}
          showClearConfirm={s.showClearConfirm}
          setShowClearConfirm={s.setShowClearConfirm}
          clearConfirmText={s.clearConfirmText}
          setClearConfirmText={s.setClearConfirmText}
          handleClearAllData={s.handleClearAllData}
          showDeleteAccount={s.showDeleteAccount}
          setShowDeleteAccount={s.setShowDeleteAccount}
          deleteAccountText={s.deleteAccountText}
          setDeleteAccountText={s.setDeleteAccountText}
          handleDeleteAccount={s.handleDeleteAccount}
          visibleAudit={s.visibleAudit}
          logout={s.logout}
          isAdmin={s.isAdmin}
        />
      </div>
      </PageShell>
    </div>
  );
}
