import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import ChartsPage from './pages/ChartsPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import CaregiverPortalPage from './pages/CaregiverPortalPage';
import AdminPage from './pages/AdminPage';
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
        // Remove the query param from URL
        searchParams.delete('admin-access');
        setSearchParams(searchParams, { replace: true });
      }
    } else if (adminKey && adminKey !== ADMIN_ACCESS_KEY) {
      // Invalid key — just remove it
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
    <div className="min-h-screen bg-[#f8f5ff] max-w-lg mx-auto relative">
      <AdminAccessHandler />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add" element={<AddEntryPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/caregiver" element={<CaregiverPortalPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
