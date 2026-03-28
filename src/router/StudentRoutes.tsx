import { useProfileStore } from "@/features/profile";
import { Navigate, Outlet } from "react-router-dom";

const StudentRoutes = () => {
  const role = useProfileStore(state => state.role);

  if (role === 'student') return <Outlet />
  else return <Navigate to={'/'} replace />
}

export default StudentRoutes