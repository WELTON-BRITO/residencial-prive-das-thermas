import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';

interface AppRouterProps {
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}

export function AppRouter({ mode, onToggleMode }: AppRouterProps) {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Layout user={user} onLogout={logout} mode={mode} onToggleMode={onToggleMode}>
              <DashboardPage />
            </Layout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
