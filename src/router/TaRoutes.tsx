import { useProfileStore } from "@/features/profile";
import { Navigate, Outlet } from "react-router-dom";

const TaRoutes = () => {
  const role = useProfileStore(state => state.role);

  if (role === 'ta') return <Outlet />
  else return <Navigate to={'/'} replace />
}

export default TaRoutes