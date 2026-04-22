import { useAuthStore } from '@/features/auth'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true, viewTransition: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
}

export default ProtectedRoutes