import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import ChartsPage from './pages/ChartsPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { user, children } = useApp();

  if (!user || children.length === 0) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] max-w-lg mx-auto relative">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add" element={<AddEntryPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
