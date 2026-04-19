import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function PrivateRoute() {
  const { token } = useAuthStore();
  const location = useLocation();
  return token
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
