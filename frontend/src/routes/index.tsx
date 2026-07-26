import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';

interface AppRoutesProps {
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}

export function AppRoutes({ mode, onToggleMode }: AppRoutesProps) {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Layout user={user} onLogout={logout} mode={mode} onToggleMode={onToggleMode}>
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
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
