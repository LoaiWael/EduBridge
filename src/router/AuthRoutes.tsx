import { useAuthStore } from '@/features/auth'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoutes = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return isAuthenticated ? <Navigate to="/bridge/:userId" replace /> : <Outlet />
}

export default AuthRoutes