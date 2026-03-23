import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const isAuthenticated = true
  return isAuthenticated
}

const AuthRoutes = () => {
  const isAuthenticated = useAuth()
  return isAuthenticated ? <Navigate to="/:userName" replace /> : <Outlet />
}

export default AuthRoutes