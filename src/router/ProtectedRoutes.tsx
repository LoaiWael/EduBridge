import { useAuthStore } from '@/features/auth'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return isAuthenticated ?
    <Outlet />
    : <Navigate to="/login" replace />
}

export default ProtectedRoutes