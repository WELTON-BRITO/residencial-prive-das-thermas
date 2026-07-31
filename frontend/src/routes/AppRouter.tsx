import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { CreateClientPage } from '../pages/Cadastrar/Cliente';
import { CreateExpensePage } from '../pages/Cadastrar/Despesas';
import AgendamentoPage from '../pages/Agendamento/AgendamentoPage';
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
        <Route
          path="clientes"
          element={
            <Layout user={user} onLogout={logout} mode={mode} onToggleMode={onToggleMode}>
              <CreateClientPage />
            </Layout>
          }
        />
        <Route
          path="despesas"
          element={
            <Layout user={user} onLogout={logout} mode={mode} onToggleMode={onToggleMode}>
              <CreateExpensePage />
            </Layout>
          }
        />
        <Route
          path="agendamento"
          element={
            <Layout user={user} onLogout={logout} mode={mode} onToggleMode={onToggleMode}>
              <AgendamentoPage />
            </Layout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
