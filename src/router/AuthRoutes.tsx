import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const isAuthenticated = false
  return isAuthenticated
}

const AuthRoutes = () => {
  const isAuthenticated = useAuth()
  return isAuthenticated ? <Navigate to="/:userName" replace /> : <Outlet />
}

export default AuthRoutes