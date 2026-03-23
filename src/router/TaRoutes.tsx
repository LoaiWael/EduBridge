import type { Role } from "@/features/auth";
import { Navigate, Outlet } from "react-router-dom";

const TaRoutes = () => {
  const role: Role = 'ta';

  if (role === 'ta') return <Outlet />
  else return <Navigate to={'/'} replace />
}

export default TaRoutes