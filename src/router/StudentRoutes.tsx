import type { Role } from "@/features/profile";
import { Navigate, Outlet } from "react-router-dom";

const StudentRoutes = () => {
  const role: Role = 'student';

  if (role === 'student') return <Outlet />
  else return <Navigate to={'/'} replace />
}

export default StudentRoutes