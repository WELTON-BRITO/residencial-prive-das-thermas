import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute() {

  const { isAuthenticated, user } = useAuth();

  console.log("========== PRIVATE ROUTE ==========");
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
