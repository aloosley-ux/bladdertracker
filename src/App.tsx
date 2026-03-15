import { Suspense, lazy, useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import { DEFAULT_MODULES } from './types';
import AppNav from './components/AppNav';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import HelpPage, { WelcomeModal } from './pages/HelpPage';
import { promoteToAdmin, addAuditEvent } from './utils/storage';
import { apiPromoteToAdmin } from './utils/api';
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AddEntryPage = lazy(() => import('./pages/AddEntryPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilesPage = lazy(() => import('./pages/ProfilesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LogPage = lazy(() => import('./pages/LogPage'));
const MilestonesPage = lazy(() => import('./pages/MilestonesPage'));
const LeapsPage = lazy(() => import('./pages/LeapsPage'));
const GdprPage = lazy(() => import('./pages/GdprPage'));
const AuditTrailPage = lazy(() => import('./pages/AuditTrailPage'));

function RouteLoadingFallback() {
  return (
    <div className="px-4 py-6 md:px-0">
      <div
        className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5"
        role="status"
        aria-live="polite"
      >
        <div className="h-3 w-32 rounded-full bg-lavender-100" />
        <div className="mt-4 h-5 w-48 rounded-full bg-lavender-50" />
        <div className="mt-6 space-y-3">
          <div className="h-20 rounded-3xl bg-[#faf7ff]" />
          <div className="h-20 rounded-3xl bg-[#faf7ff]" />
          <div className="h-20 rounded-3xl bg-[#faf7ff]" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading your tracker…</p>
      </div>
    </div>
  );
}

function AdminAccessHandler() {
  const { user, login } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const adminKey = searchParams.get('admin-access');
    if (!adminKey || !user || user.role === 'admin') return;

    const clearAdminAccess = () => {
      searchParams.delete('admin-access');
      setSearchParams(searchParams, { replace: true });
    };

    const attemptPromotion = async () => {
      try {
        const isCloudMode = Boolean(import.meta.env.VITE_USE_CLOUD);
        if (isCloudMode) {
          const promoted = await apiPromoteToAdmin(adminKey);
          login(promoted);
        } else if (adminKey === import.meta.env.VITE_ADMIN_KEY) {
          const promoted = promoteToAdmin(user.id);
          if (!promoted) return;
          addAuditEvent({
            userId: user.id,
            action: 'Promoted to admin',
            subject: user.name,
            detail: 'Account promoted to admin via local admin access key.',
          });
          login(promoted);
        }
      } finally {
        clearAdminAccess();
      }
    };

    void attemptPromotion();
  }, [searchParams, user, login, setSearchParams]);

  return null;
}

/** Fallback used during the brief loading window before enabledModules is populated. */
const DEFAULT_ENABLED = new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id));

function AppRoutes() {
  const { user, enabledModules } = useApp();

  const enabled = useMemo(
    () => (enabledModules.length > 0 ? new Set(enabledModules) : DEFAULT_ENABLED),
    [enabledModules],
  );

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-lavender-700"
      >
        Skip to main content
      </a>
      <AppNav />
      <WelcomeModal />
      <AdminAccessHandler />
      <main id="main-content" className="mx-auto max-w-5xl px-0 md:px-6 pb-20 md:pb-6 pt-0 md:pt-4">
        <ErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/log" element={<LogPage />} />
              <Route path="/add" element={<AddEntryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/milestones" element={enabled.has('milestones') ? <MilestonesPage /> : <Navigate to="/" replace />} />
              <Route path="/leaps" element={enabled.has('leaps') ? <LeapsPage /> : <Navigate to="/" replace />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profiles" element={<ProfilesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/gdpr" element={<GdprPage />} />
              <Route path="/audit-trail" element={<AuditTrailPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Legacy redirects */}
              <Route path="/journal" element={<Navigate to="/log" replace />} />
              <Route path="/charts" element={<Navigate to="/reports" replace />} />
              <Route path="/caregiver" element={<Navigate to="/profiles" replace />} />
              <Route path="/profile" element={<Navigate to="/settings" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
