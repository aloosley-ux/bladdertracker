import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import AppNav from './components/AppNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import ReportsPage from './pages/ReportsPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import ProfilesPage from './pages/ProfilesPage';
import AdminPage from './pages/AdminPage';
import LogPage from './pages/LogPage';
import HelpPage, { WelcomeModal } from './pages/HelpPage';
import MilestonesPage from './pages/MilestonesPage';
import { promoteToAdmin, addAuditEvent } from './utils/storage';

const ADMIN_ACCESS_KEY = 'bladdertracker-admin-2024';

function AdminAccessHandler() {
  const { user, login } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const adminKey = searchParams.get('admin-access');
    if (adminKey === ADMIN_ACCESS_KEY && user && user.role !== 'admin') {
      const promoted = promoteToAdmin(user.id);
      if (promoted) {
        addAuditEvent({
          userId: user.id,
          action: 'Promoted to admin',
          subject: user.name,
          detail: 'Account promoted to admin via secure URL.',
        });
        login(promoted);
        searchParams.delete('admin-access');
        setSearchParams(searchParams, { replace: true });
      }
    } else if (adminKey && adminKey !== ADMIN_ACCESS_KEY) {
      searchParams.delete('admin-access');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, user, login, setSearchParams]);

  return null;
}

function AppRoutes() {
  const { user } = useApp();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AppNav />
      <WelcomeModal />
      <AdminAccessHandler />
      <main className="mx-auto max-w-5xl px-0 md:px-6 pb-20 md:pb-6 pt-0 md:pt-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/add" element={<AddEntryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Legacy redirects */}
          <Route path="/journal" element={<Navigate to="/log" replace />} />
          <Route path="/charts" element={<Navigate to="/reports" replace />} />
          <Route path="/caregiver" element={<Navigate to="/profiles" replace />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
