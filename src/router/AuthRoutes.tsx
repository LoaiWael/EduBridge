import { useAuthStore } from '@/features/auth'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AuthRoutes = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authId = useAuthStore(state => state.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/`, { replace: true, viewTransition: true });
    }
  }, [isAuthenticated, authId, navigate]);

  return !isAuthenticated ? <Outlet /> : null;
}

export default AuthRoutes