import { Navigate, Outlet } from 'react-router-dom'

// TODO: Replace with actual auth store (Zustand)
const useAuth = () => {
  const isAuthenticated = true // localStorage.getItem('token') !== null
  return isAuthenticated
}

const ProtectedRoutes = () => {
  const isAuthenticated = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoutes